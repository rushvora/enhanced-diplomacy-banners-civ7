/**
 * @file panel-diplo-ribbon-extension.js
 * @description Enhanced Diplomacy Ribbon mod for Civilization VII
 */

import { InterfaceMode } from '/core/ui/interface-modes/interface-modes.js';
import DiploRibbonData from '/base-standard/ui/diplo-ribbon/model-diplo-ribbon.js';
import { Audio } from '/core/ui/audio-base/audio-support.js';
import { enhancedDiploBannersSettings } from 'fs://game/enhanced-diplomacy-banners/ui/settings/settings.js';

import { StyleManager } from './core/style-manager.js';
import { PortraitManager } from './core/portrait-manager.js';
import { BackgroundManager } from './core/background-manager.js';
import { YieldManager } from './core/yield-manager.js';
import { DOMUtils } from './core/dom-utils.js';
import { SettingsManager } from './core/settings-manager.js';

export class DiploRibbonEnhancer {
    constructor(component) {
        this.component = component;
        
        // Store original methods to allow restoration if needed
        this.originalOnInitialize = component.onInitialize;
        this.originalPopulateFlags = component.populateFlags;
        
        // Initialize managers
        this.styleManager = new StyleManager();
        this.portraitManager = new PortraitManager(component);
        this.backgroundManager = new BackgroundManager();
        this.yieldManager = new YieldManager(component);
        this.settingsManager = new SettingsManager();
        
        // Bind and override component methods
        component.onInitialize = this.onInitialize.bind(this);
        component.populateFlags = this.populateFlags.bind(this);
        component.displayRibbonDetails = this.displayRibbonDetails.bind(this);
        component.hideRibbonDetails = this.hideRibbonDetails.bind(this);

        // Track initial banner visibility state
        this.initialBannersHidden = enhancedDiploBannersSettings?.HideBanners === true;

        // Apply initial styles
        this.styleManager.applyAllStyles(enhancedDiploBannersSettings);

        // Set up settings listener with specific handling for each setting
        this.settingsUnsubscribe = this.settingsManager.addListener(this.handleSettingsChange.bind(this));
    }

    /**
     * Handle specific setting changes
     * @param {Object} changedSettings - Map of changed settings
     */
    handleSettingsChange(changedSettings) {
        console.log('Settings changed:', changedSettings);
        
        // Apply style changes
        this.styleManager.applyAllStyles(enhancedDiploBannersSettings);
        
        // Reset ribbon classes
        const bannersHidden = enhancedDiploBannersSettings?.HideBanners === true;
        this.resetRibbonClasses(bannersHidden);
        
        // Check if we need to repopulate flags
        if ('HideBanners' in changedSettings || 'ShowCivSymbol' in changedSettings) {
            this.component.populateFlags();
        }
    }
    
    /**
     * Reset all ribbon classes to ensure proper update after settings change
     * @param {boolean} hideBanners - Current state of banner visibility
     */
    resetRibbonClasses(hideBanners) {
        const civFlagContainers = document.querySelectorAll(".diplo-ribbon-outer");
        
        // Use DOMUtils for batch updates
        DOMUtils.batchUpdate(() => {
            for (const container of civFlagContainers) {
                DOMUtils.toggleClasses(container, {
                    'hover-all': false,
                    'forced-show': false,
                    'hidden-banners-mode': hideBanners
                });
            }
        });
    }

    /**
     * Method called when hovering over a diplomatic ribbon
     * @param {HTMLElement} target - The element being hovered
     */
    displayRibbonDetails(target) {
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB") || 
            InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG")) {
            return;
        }
        
        const targetID = target.getAttribute("data-player-id");
        if (targetID == null) {
            console.error("panel-diplo-ribbon: Attempting to hover a leader portrait without a 'data-player-id' attribute!");
            return;
        }
        
        const targetIDInt = Number.parseInt(targetID);
        if (isNaN(targetIDInt) || targetIDInt == PlayerIds.NO_PLAYER) {
            console.error("panel-diplo-ribbon: invalid playerID parsed from data-player-id attribute (" + targetID + ") during hover callback.");
            return;
        }

        // Check if this is the local player portrait and we have the setting enabled
        if (targetIDInt == GameContext.localPlayerID && enhancedDiploBannersSettings?.ShowAllYieldsOnLocalHover) {
            this.showAllYields(enhancedDiploBannersSettings?.HideBanners);
        }
        
        // Handle audio
        if (targetIDInt != GameContext.localPlayerID) {
            Audio.playSound("data-audio-focus", "audio-panel-diplo-ribbon");
            return;
        }
        
        if (!target.parentElement?.parentElement) {
            console.error("panel-diplo-ribbon: No valid parent element while attempting to hover a portrait!");
            return;
        }
        
        Audio.playSound("data-audio-focus", "audio-panel-diplo-ribbon");
    }
    
    /**
     * Show all yields for all ribbons
     * @param {boolean} hideBanners - Whether banners are hidden
     */
    showAllYields(hideBanners) {
        const civFlagContainers = document.querySelectorAll(".diplo-ribbon-outer");
        
        // Use DOMUtils for batch updates
        DOMUtils.batchUpdate(() => {
            for (const container of civFlagContainers) {
                container.classList.add("hover-all");
                
                // Add forced-show class to ensure proper display in hidden banners mode
                if (hideBanners) {
                    container.classList.add("forced-show");
                }
                
                // Configure extended yields if needed
                this.yieldManager.configureExtendedYields(
                    container, 
                    enhancedDiploBannersSettings?.AlwaysShowExtendedYields === true
                );
            }
        });
    }

    /**
     * Method called when mouse leaves a diplomatic ribbon
     * @param {HTMLElement} target - The element being un-hovered
     */
    hideRibbonDetails(target) {
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB") || 
            InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG")) {
            return;
        }
        
        const targetID = target.getAttribute("data-player-id");
        if (targetID == null) {
            console.error("panel-diplo-ribbon: Attempting to un-hover a leader portrait without a 'data-player-id' attribute!");
            return;
        }
        
        const targetIDInt = Number.parseInt(targetID);
        if (isNaN(targetIDInt) || targetIDInt == PlayerIds.NO_PLAYER) {
            console.error("panel-diplo-ribbon: invalid playerID parsed from data-player-id attribute (" + targetID + ") during mouseleave callback.");
            return;
        }
        
        // If this was the local player, remove the hover state from all ribbons
        if (targetIDInt == GameContext.localPlayerID) {
            this.hideAllYields();
        }
    }
    
    /**
     * Hide all yields for all ribbons
     */
    hideAllYields() {
        const civFlagContainers = document.querySelectorAll(".diplo-ribbon-outer");
        
        // Use DOMUtils for batch updates
        DOMUtils.batchUpdate(() => {
            for (const container of civFlagContainers) {
                container.classList.remove("hover-all");
                container.classList.remove("forced-show");
            }
        });
    }
    
    /**
     * Custom initialization method
     * Modifies ribbon positioning and animation based on interface mode
     */
    onInitialize() {
        // Call original initialization method
        this.originalOnInitialize.apply(this.component);
        
        try {
            // Adjust toggle nav help container if needed
            this.adjustToggleNavHelp();
            
            // Modify ribbon animation based on interface mode
            this.configureRibbonAnimation();
        } catch (error) {
            console.error(`DiploRibbonEnhancer: Initialization error - ${error.message}`);
        }
    }
    
    /**
     * Adjust toggle navigation help container
     * @private
     */
    adjustToggleNavHelp() {
        const toggleNavHelpBackground = this.component.toggleNavHelpContainer?.querySelector('.img-questext');
        const toggleNavHelp = this.component.toggleNavHelpContainer?.querySelector('fxs-nav-help');
        
        if (toggleNavHelpBackground) {
            toggleNavHelpBackground.classList.remove('h-8');
            toggleNavHelpBackground.classList.add('h-9');
        }
        
        if (toggleNavHelp) {
            toggleNavHelp.classList.remove('top-3');
            toggleNavHelp.classList.add('top-4');
        }
    }
    
    /**
     * Configure ribbon animation based on current interface mode
     * @private
     */
    configureRibbonAnimation() {
        const diplomacyModes = [
            "INTERFACEMODE_DIPLOMACY_DIALOG", 
            "INTERFACEMODE_DIPLOMACY_HUB", 
            "INTERFACEMODE_CALL_TO_ARMS"
        ];
        
        if (diplomacyModes.some(mode => InterfaceMode.isInInterfaceMode(mode))) {
            this.component.animateInType = this.component.animateOutType = 3;
        } else {
            // Move ribbon further right
            this.component.Root.style.right = "1.5rem";
            this.component.animateInType = this.component.animateOutType = 4;
        }
    }
    
    /**
     * Custom method to populate and modify diplomatic ribbon flags
     */
    populateFlags() {
        // Call original populate flags method
        this.originalPopulateFlags.apply(this.component);
        
        try {
            // Ensure diplo ribbons exist
            if (!this.component.diploRibbons?.length) return;
            
            // Get player data based on interface mode
            const targetArray = this.getTargetPlayerArray();
            
            // Process each ribbon using requestAnimationFrame for performance
            DOMUtils.batchUpdate(() => {
                this.processRibbons(this.component.diploRibbons, targetArray);
            });
        } catch (error) {
            console.error(`DiploRibbonEnhancer: Populate flags error - ${error.message}`);
        }
    }
    
    /**
     * Process all diplomatic ribbons in a batch
     * @param {NodeList} ribbons - The diplomatic ribbons
     * @param {Array} targetArray - Player data array
     */
    processRibbons(ribbons, targetArray) {
        const hideBanners = enhancedDiploBannersSettings?.HideBanners === true;
        const showCivSymbol = enhancedDiploBannersSettings?.ShowCivSymbol !== false;
        
        ribbons.forEach((diploRibbon, index) => {
            if (!diploRibbon) return;
            
            // Check if banner state has changed before adding/removing class
            const isHiddenBanner = diploRibbon.classList.contains('hidden-banners-mode');
            if (isHiddenBanner !== hideBanners) {
                diploRibbon.classList.toggle('hidden-banners-mode', hideBanners);
            }
            
            // Only modify background if we have player data
            if (targetArray?.[index]) {
                this.backgroundManager.modifyRibbonBackground(diploRibbon, index, targetArray);
                
                // Only add emblem if it doesn't exist or needs update
                const existingEmblem = diploRibbon.querySelector('.civ-emblem');
                if (!existingEmblem) {
                    this.portraitManager.addCivEmblem(diploRibbon, index, targetArray);
                }
            }

            // Only add portrait frame if it doesn't exist
            if (!diploRibbon.querySelector('.circular-portrait-container')) {
                this.portraitManager.addCircularPortraitFrame(diploRibbon);
            }
            
            // Only update civ symbol if needed
            if (!hideBanners && showCivSymbol) {
                const symbol = diploRibbon.querySelector('.diplo-ribbon__symbol');
                if (symbol && (
                    symbol.style.display !== 'block' || 
                    symbol.style.transform !== 'scale(0.6)' || 
                    symbol.style.marginTop !== '2.3rem'
                )) {
                    symbol.style.display = 'block';
                    symbol.style.transform = 'scale(0.6)';
                    symbol.style.marginTop = '2.3rem';
                }
            }
            
            // Remove hover classes only if they exist
            if (diploRibbon.classList.contains('hover-all') || 
                diploRibbon.classList.contains('forced-show')) {
                diploRibbon.classList.remove('hover-all', 'forced-show');
            }
        });
    }
    
    /**
     * Determine the correct player data array based on current interface mode
     * @returns {Array} Player data array
     * @private
     */
    getTargetPlayerArray() {
        const diplomacyModes = [
            "INTERFACEMODE_DIPLOMACY_DIALOG", 
            "INTERFACEMODE_CALL_TO_ARMS", 
            "INTERFACEMODE_DIPLOMACY_PROJECT_REACTION"
        ];
        
        return diplomacyModes.some(mode => InterfaceMode.isInInterfaceMode(mode))
            ? DiploRibbonData.diploStatementPlayerData
            : DiploRibbonData.playerData;
    }

    // Lifecycle hook stubs
    beforeAttach() {}
    afterAttach() {}
    beforeDetach() {}
    
    // Clean up when component is detached
    afterDetach() {
        if (this.settingsUnsubscribe) {
            this.settingsUnsubscribe();
        }
        this.styleManager.cleanup();
        this.settingsManager.cleanup();
    }
}

// Register the enhancer with the Controls system
Controls.decorate('panel-diplo-ribbon', (component) => new DiploRibbonEnhancer(component));
