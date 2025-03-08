/**
 * @file relationship-icon-replacement.js
 * @description Replaces default relationship icons with custom icons in Civilization VII
 */

import DiploRibbonData from '/base-standard/ui/diplo-ribbon/model-diplo-ribbon.js';
import DiplomacyManager from '/base-standard/ui/diplomacy/diplomacy-manager.js';

// Custom relationship icon paths
const CUSTOM_RELATIONSHIP_ICONS = {
    "PLAYER_RELATIONSHIP_ALLIANCE": "fs://game/enhanced-diplomacy-banners/icons/alliance.png",
    "PLAYER_RELATIONSHIP_FRIENDLY": "fs://game/enhanced-diplomacy-banners/icons/friendly.png",
    "PLAYER_RELATIONSHIP_HELPFUL": "fs://game/enhanced-diplomacy-banners/icons/helpful.png",
    "PLAYER_RELATIONSHIP_HOSTILE": "fs://game/enhanced-diplomacy-banners/icons/hostile.png",
    "PLAYER_RELATIONSHIP_NEUTRAL": "fs://game/enhanced-diplomacy-banners/icons/neutral.png",
    "PLAYER_RELATIONSHIP_UNFRIENDLY": "fs://game/enhanced-diplomacy-banners/icons/unfriendly.png",
    "PLAYER_RELATIONSHIP_AT_WAR": "fs://game/enhanced-diplomacy-banners/icons/war.png"
};

/**
 * Direct override of UI.getIcon method to intercept war icon requests
 */
(function() {
    try {
        // Store original method
        const originalGetIcon = UI.getIcon;
        
        // Replace method to intercept relationship icon requests
        UI.getIcon = function(iconName, context) {
            // Handle relationship icons
            if (context === "PLAYER_RELATIONSHIP" && CUSTOM_RELATIONSHIP_ICONS[iconName]) {
                return CUSTOM_RELATIONSHIP_ICONS[iconName];
            }
            // Otherwise use original implementation
            return originalGetIcon(iconName, context);
        };
        
        console.log("UI.getIcon successfully patched for relationship icons");
    } catch (error) {
        console.error("Failed to patch UI.getIcon:", error);
    }
})();

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Custom implementation to replace relationship icons
 */
class RelationshipIconReplacer {
    /**
     * Initializes the relationship icon replacer
     */
    constructor() {
        this.processedIcons = new WeakSet();
        this.installHooks();
        this.setupEventListeners();
        this.setupRegularMonitor();
    }

    /**
     * Install hooks on DiploRibbonData methods to replace icons
     */
    installHooks() {
        try {
            // Store original methods
            this.originalCreatePlayerData = DiploRibbonData.createPlayerData;
            this.originalOnDiplomacyWarUpdate = DiploRibbonData.onDiplomacyWarUpdate;
            this.originalUpdateDiploStatementPlayerData = DiploRibbonData.updateDiploStatementPlayerData;
            this.originalQueueUpdate = DiploRibbonData.queueUpdate;
            
            // Override queueUpdate to ensure our icons are applied after any update
            DiploRibbonData.queueUpdate = () => {
                this.originalQueueUpdate.call(DiploRibbonData);
                // After the update is queued, also queue our icon replacement
                this.debouncedForceApply();
            };
            
            // Override createPlayerData to replace relationship icons
            DiploRibbonData.createPlayerData = (player, playerDiplomacy, isKnownPlayer, relationshipData) => {
                // Call original method
                const playerData = this.originalCreatePlayerData.call(DiploRibbonData, player, playerDiplomacy, isKnownPlayer, relationshipData);
                
                // Replace relationship icons with custom ones
                if (isKnownPlayer) {
                    if (playerDiplomacy.isAtWarWith(GameContext.localPlayerID)) {
                        playerData.relationshipIcon = CUSTOM_RELATIONSHIP_ICONS["PLAYER_RELATIONSHIP_AT_WAR"];
                    } 
                    else if (playerDiplomacy.hasAllied(GameContext.localPlayerID)) {
                        playerData.relationshipIcon = CUSTOM_RELATIONSHIP_ICONS["PLAYER_RELATIONSHIP_ALLIANCE"];
                    }
                    else if (relationshipData && relationshipData.relationshipType !== DiplomacyPlayerRelationships.PLAYER_RELATIONSHIP_UNKNOWN && 
                             relationshipData.relationshipType !== DiplomacyPlayerRelationships.PLAYER_RELATIONSHIP_NEUTRAL) {
                        const relationshipType = DiplomacyManager.getRelationshipTypeString(relationshipData.relationshipType);
                        playerData.relationshipIcon = CUSTOM_RELATIONSHIP_ICONS[relationshipType] || playerData.relationshipIcon;
                    }
                }
                
                return playerData;
            };
            
            // Override onDiplomacyWarUpdate to use custom icons
            DiploRibbonData.onDiplomacyWarUpdate = (data, isWar) => {
                // Call original method
                this.originalOnDiplomacyWarUpdate.call(DiploRibbonData, data, isWar);
                
                // Apply custom icons after original method runs
                const actingPlayerIndex = DiploRibbonData.playerData.findIndex(o => o.id == data.actingPlayer);
                const reactingPlayerIndex = DiploRibbonData.playerData.findIndex(o => o.id == data.reactingPlayer);
                
                if (actingPlayerIndex !== -1 && reactingPlayerIndex !== -1) {
                    if (data.reactingPlayer == GameContext.localPlayerID) {
                        const actingPlayer = DiploRibbonData._playerData[actingPlayerIndex];
                        if (actingPlayer) {
                            if (isWar) {
                                actingPlayer.relationshipIcon = CUSTOM_RELATIONSHIP_ICONS["PLAYER_RELATIONSHIP_AT_WAR"];
                            } else {
                                const localPlayerDiplomacy = Players.get(GameContext.localPlayerID)?.Diplomacy;
                                if (localPlayerDiplomacy) {
                                    const relationship = localPlayerDiplomacy.getRelationshipEnum(actingPlayer.id);
                                    if (relationship != DiplomacyPlayerRelationships.PLAYER_RELATIONSHIP_NEUTRAL && 
                                        relationship != DiplomacyPlayerRelationships.PLAYER_RELATIONSHIP_UNKNOWN) {
                                        const relType = DiplomacyManager.getRelationshipTypeString(relationship);
                                        actingPlayer.relationshipIcon = CUSTOM_RELATIONSHIP_ICONS[relType] || "";
                                    } else {
                                        actingPlayer.relationshipIcon = "";
                                    }
                                }
                            }
                        }
                    } else if (data.actingPlayer == GameContext.localPlayerID) {
                        const reactingPlayer = DiploRibbonData._playerData[reactingPlayerIndex];
                        if (reactingPlayer) {
                            if (isWar) {
                                reactingPlayer.relationshipIcon = CUSTOM_RELATIONSHIP_ICONS["PLAYER_RELATIONSHIP_AT_WAR"];
                            } else {
                                const localPlayerDiplomacy = Players.get(GameContext.localPlayerID)?.Diplomacy;
                                if (localPlayerDiplomacy) {
                                    const relationship = localPlayerDiplomacy.getRelationshipEnum(reactingPlayer.id);
                                    if (relationship != DiplomacyPlayerRelationships.PLAYER_RELATIONSHIP_NEUTRAL && 
                                        relationship != DiplomacyPlayerRelationships.PLAYER_RELATIONSHIP_UNKNOWN) {
                                        const relType = DiplomacyManager.getRelationshipTypeString(relationship);
                                        reactingPlayer.relationshipIcon = CUSTOM_RELATIONSHIP_ICONS[relType] || "";
                                    } else {
                                        reactingPlayer.relationshipIcon = "";
                                    }
                                }
                            }
                        }
                    }
                }
                
                // Force apply icons after war updates
                this.debouncedForceApply();
            };
            
            // Override updateDiploStatementPlayerData for diplomacy dialog icons
            DiploRibbonData.updateDiploStatementPlayerData = () => {
                // Call original method
                this.originalUpdateDiploStatementPlayerData.call(DiploRibbonData);
                
                // Update icons in diplomatic statements
                if (DiploRibbonData._diploStatementPlayerData && DiploRibbonData._diploStatementPlayerData.length >= 2) {
                    const leftPlayer = DiploRibbonData._diploStatementPlayerData[0];
                    const rightPlayer = DiploRibbonData._diploStatementPlayerData[1];
                    
                    if (leftPlayer.isAtWar) {
                        leftPlayer.relationshipIcon = CUSTOM_RELATIONSHIP_ICONS["PLAYER_RELATIONSHIP_AT_WAR"];
                    }
                    
                    if (rightPlayer.isAtWar) {
                        rightPlayer.relationshipIcon = CUSTOM_RELATIONSHIP_ICONS["PLAYER_RELATIONSHIP_AT_WAR"];
                    }
                }
            };
            
            // Create debounced functions
            this.debouncedForceApply = debounce(() => this.forceApplyCustomIcons(), 100);
            
            console.log("Relationship Icon Replacer: Successfully installed hooks");
            
            // Trigger an update to apply our changes
            DiploRibbonData.queueUpdate();
            
            // Force apply immediately
            this.debouncedForceApply();
        } catch (error) {
            console.error("Relationship Icon Replacer: Error installing hooks -", error);
        }
    }
    
    /**
     * Set up event listeners for relevant game events
     */
    setupEventListeners() {
        // Listen for relevant events that might change relationship status
        const gameEvents = [
            'DiplomacyDeclareWar',
            'DiplomacyMakePeace',
            'DiplomacyEventStarted',
            'DiplomacyEventEnded',
            'DiplomacyRelationshipStatusChanged',
            'PlayerTurnActivated',
            'PlayerTurnDeactivated'
        ];
        
        gameEvents.forEach(event => {
            engine.on(event, this.debouncedForceApply, this);
        });
        
        // Listen for interface mode changes with debouncing
        const debouncedInterfaceChange = debounce(() => this.forceApplyCustomIcons(), 100);
        window.addEventListener('interface-mode-changed', debouncedInterfaceChange);
        window.addEventListener('update-diplo-ribbon', debouncedInterfaceChange);
    }
    
    /**
     * Set up a smarter monitor to check for relationship icons
     */
    setupRegularMonitor() {
        // Start with more frequent checks during game startup/load
        let checkCount = 0;
        this.monitorInterval = setInterval(() => {
            // After 10 checks (5 seconds), reduce frequency to every 2 seconds
            if (checkCount > 10) {
                clearInterval(this.monitorInterval);
                this.monitorInterval = setInterval(() => {
                    this.replaceRelationshipIconsInDOM();
                }, 2000);
            }
            this.replaceRelationshipIconsInDOM();
            checkCount++;
        }, 500);
    }
    
    /**
     * Replace relationship icons in the DOM more efficiently
     */
    replaceRelationshipIconsInDOM() {
        try {
            // Find all relationship icons in the DOM
            const icons = document.querySelectorAll('.relationship-icon');
            
            icons.forEach(icon => {
                // Skip icons we've already processed in this cycle
                if (this.processedIcons.has(icon)) return;
                
                const style = icon.getAttribute('style');
                if (!style) return;
                
                let iconReplaced = false;
                
                // Check for each relationship type in the style
                Object.keys(CUSTOM_RELATIONSHIP_ICONS).forEach(relType => {
                    if (style.includes(relType)) {
                        icon.style.backgroundImage = `url('${CUSTOM_RELATIONSHIP_ICONS[relType]}')`;
                        iconReplaced = true;
                    }
                });
                
                // If no icon was replaced by type name, check by player war status
                if (!iconReplaced) {
                    const playerElem = icon.closest('[data-player-id]');
                    if (playerElem) {
                        const playerId = playerElem.getAttribute('data-player-id');
                        if (playerId) {
                            const playerIdNum = parseInt(playerId);
                            if (!isNaN(playerIdNum)) {
                                // Check if this player is at war
                                const isAtWar = this.isPlayerAtWar(playerIdNum);
                                if (isAtWar) {
                                    icon.style.backgroundImage = `url('${CUSTOM_RELATIONSHIP_ICONS["PLAYER_RELATIONSHIP_AT_WAR"]}')`;
                                }
                            }
                        }
                    }
                }
                
                // Mark this icon as processed
                this.processedIcons.add(icon);
            });
        } catch (error) {
            console.error("Relationship Icon Replacer: Error replacing icons in DOM -", error);
        }
    }
    
    /**
     * Check if a player is at war with the local player
     */
    isPlayerAtWar(playerId) {
        try {
            // Check DiploRibbonData first
            const player = DiploRibbonData.playerData.find(p => p.id === playerId);
            if (player && player.isAtWar) {
                return true;
            }
            
            // Check diplomatic statement data
            if (DiploRibbonData._diploStatementPlayerData) {
                const statementPlayer = DiploRibbonData._diploStatementPlayerData.find(p => p.id === playerId);
                if (statementPlayer && statementPlayer.isAtWar) {
                    return true;
                }
            }
            
            // Fall back to direct diplomacy check
            const localPlayerId = GameContext.localPlayerID;
            const playerDiplomacy = Players.get(playerId)?.Diplomacy;
            if (playerDiplomacy && playerDiplomacy.isAtWarWith(localPlayerId)) {
                return true;
            }
            
            return false;
        } catch (error) {
            console.error("Error checking war status:", error);
            return false;
        }
    }
    
    /**
     * Force apply custom icons to all player data
     */
    forceApplyCustomIcons() {
        try {
            // Reset processed icons for next cycle
            this.processedIcons = new WeakSet();
            
            // Update player data
            if (DiploRibbonData._playerData) {
                DiploRibbonData._playerData.forEach(playerData => {
                    if (playerData.isAtWar) {
                        playerData.relationshipIcon = CUSTOM_RELATIONSHIP_ICONS["PLAYER_RELATIONSHIP_AT_WAR"];
                    } else if (playerData.relationshipIcon) {
                        // Check for other relationship types
                        Object.keys(CUSTOM_RELATIONSHIP_ICONS).forEach(relType => {
                            if (playerData.relationshipIcon.includes(relType)) {
                                playerData.relationshipIcon = CUSTOM_RELATIONSHIP_ICONS[relType];
                            }
                        });
                    }
                });
            }
            
            // Update diplomatic statement data
            if (DiploRibbonData._diploStatementPlayerData) {
                DiploRibbonData._diploStatementPlayerData.forEach(playerData => {
                    if (playerData.isAtWar) {
                        playerData.relationshipIcon = CUSTOM_RELATIONSHIP_ICONS["PLAYER_RELATIONSHIP_AT_WAR"];
                    } else if (playerData.relationshipIcon) {
                        // Check for other relationship types
                        Object.keys(CUSTOM_RELATIONSHIP_ICONS).forEach(relType => {
                            if (playerData.relationshipIcon.includes(relType)) {
                                playerData.relationshipIcon = CUSTOM_RELATIONSHIP_ICONS[relType];
                            }
                        });
                    }
                });
            }
            
            // Also directly update any relationship icons in the DOM
            this.replaceRelationshipIconsInDOM();
            
            // Trigger refresh event
            DiploRibbonData._eventNotificationRefresh.trigger();
        } catch (error) {
            console.error("Relationship Icon Replacer: Error forcing icon application -", error);
        }
    }
}

// Initialize the relationship icon replacer when the engine is ready
engine.whenReady.then(() => {
    try {
        window.relationshipIconReplacer = new RelationshipIconReplacer();
        console.log("Relationship Icon Replacer: Initialized");
    } catch (error) {
        console.error("Relationship Icon Replacer: Initialization failed -", error);
    }
});

// Initialize immediately if engine is already ready
if (engine.isReady) {
    window.relationshipIconReplacer = new RelationshipIconReplacer();
}
