/**
 * @file panel-diplo-ribbon-extension.js
 * @description Enhanced Diplomacy Ribbon mod for Civilization VII
 */

import { InterfaceMode } from '/core/ui/interface-modes/interface-modes.js';
import DiploRibbonData from '/base-standard/ui/diplo-ribbon/model-diplo-ribbon.js';
import { Audio } from '/core/ui/audio-base/audio-support.js';
import { enhancedDiploBannersSettings } from 'fs://game/enhanced-diplomacy-banners/ui/settings/settings.js';
import { 
    MAIN_STYLES,
    SHOW_CIV_SYMBOL_STYLES,
    HIDE_CIV_SYMBOL_STYLES,
    ALWAYS_SHOW_EXTENDED_YIELDS_STYLES,
    SHOW_EXTENDED_YIELDS_ON_HOVER_STYLES,
    BACKGROUND_STYLES,
    SHOW_BANNERS_STYLES,
    HIDE_BANNERS_STYLES,
    HOVER_ALL_STYLES
} from './constants.js';
import {
    COMPACT_MODE_STYLES,
    SCALE_FACTORS
} from './compact-mode.js';

export class DiploRibbonEnhancer {
    constructor(component) {
        this.component = component;
        
        // Store original methods to allow restoration if needed
        this.originalOnInitialize = component.onInitialize;
        this.originalPopulateFlags = component.populateFlags;
        
        // Bind and override component methods
        component.onInitialize = this.onInitialize.bind(this);
        component.populateFlags = this.populateFlags.bind(this);
        component.displayRibbonDetails = this.displayRibbonDetails.bind(this);
        component.hideRibbonDetails = this.hideRibbonDetails.bind(this);

        // Track initial banner visibility state
        this.initialBannersHidden = enhancedDiploBannersSettings?.HideBanners === true;

        // Add custom styles
        this.addCustomStyles();

        // Listen for settings changes
        this.settingsChangedListener = () => {
            // Check if banner visibility has changed since initialization
            const bannersHiddenNow = enhancedDiploBannersSettings?.HideBanners === true;
            const visibilityChanged = this.initialBannersHidden !== bannersHiddenNow;
            
            // Update the CSS styles to reflect current settings
            this.applyAllStyles();
            
            // Important: Force refresh hover-all status by removing all hover-all classes 
            // when settings change, especially when toggling hidden banners
            const civFlagContainers = document.querySelectorAll(".diplo-ribbon-outer");
            for (const civFlagContainer of civFlagContainers) {
                civFlagContainer.classList.remove("hover-all");
                civFlagContainer.classList.remove("forced-show");
                
                // If banner visibility has changed, force a full repopulation
                if (visibilityChanged) {
                    civFlagContainer.classList.toggle('hidden-banners-mode', bannersHiddenNow);
                }
            }
            
            // If banner visibility changed, force repopulate to ensure symbols are correctly shown
            if (visibilityChanged) {
                this.component.populateFlags();
            }
        };

        // Listen for settings changes
        window.addEventListener('update-diplo-ribbon', this.settingsChangedListener);
    }

    /**
     * Method called when hovering over a diplomatic ribbon
     * @param {HTMLElement} target - The element being hovered
     */
    displayRibbonDetails(target) {
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG")) {
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
            // Show all yields by adding "hover-all" class to all diplo ribbons
            const civFlagContainers = document.querySelectorAll(".diplo-ribbon-outer");
            for (const civFlagContainer of civFlagContainers) {
                civFlagContainer.classList.add("hover-all");
                
                // Add this class to ensure proper display in hidden banners mode
                if (enhancedDiploBannersSettings?.HideBanners) {
                    civFlagContainer.classList.add("forced-show");
                }
            }
        }
        
        // Keep existing code for the Audio handling
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
     * Method called when mouse leaves a diplomatic ribbon
     * @param {HTMLElement} target - The element being un-hovered
     */
    hideRibbonDetails(target) {
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG")) {
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
            // Remove hover effect from all banners
            const civFlagContainers = document.querySelectorAll(".diplo-ribbon-outer");
            for (const civFlagContainer of civFlagContainers) {
                civFlagContainer.classList.remove("hover-all");
                civFlagContainer.classList.remove("forced-show");
            }
        }
    }

    /**
     * Inject custom CSS styles for the diplomatic ribbon
     */
    addCustomStyles() {
        try {
            // First create the main styles
            const mainStyle = document.createElement('style');
            mainStyle.id = 'diplo-ribbon-main-style';
            mainStyle.textContent = MAIN_STYLES;
            document.head.appendChild(mainStyle);
            
            // Add the hover-all styles with improved hidden banners support
            const hoverAllStyle = document.createElement('style');
            hoverAllStyle.id = 'diplo-ribbon-hover-all-style';
            hoverAllStyle.textContent = HOVER_ALL_STYLES;
            document.head.appendChild(hoverAllStyle);
            
            // Apply all settings-specific styles
            this.applyAllStyles();
        } catch (error) {
            console.error("Error adding custom styles:", error);
        }
    }

    /**
     * Apply all style settings in the correct order with dependency handling
     */
    applyAllStyles() {
        // Clean up existing styles first
        this.removeExistingStyles();
        
        // First check if banners should be hidden
        const hideBanners = enhancedDiploBannersSettings && enhancedDiploBannersSettings.HideBanners === true;
        
        // Apply the banner visibility styles first
        this.updateBannerYieldsVisibility(hideBanners);
        
        // Get the civ symbol preference
        const showCivSymbol = enhancedDiploBannersSettings && enhancedDiploBannersSettings.ShowCivSymbol !== false;
        
        if (hideBanners) {
            // Special handling for civ symbols when banners are hidden
            this.addCivBannerWhenHidden(showCivSymbol);
            // Force extended yields to not be shown when banners are hidden
            this.updateExtendedYieldsVisibility(false);
        } else {
            // Apply standard civ symbol style based on user setting
            this.addCivBanner(showCivSymbol);
            this.updateExtendedYieldsVisibility(true);
        }
        
        // Background style is always applied regardless of other settings
        this.updateBackgroundStyle();

        // Apply compact mode scaling based on user setting
        const scaleFactor = this.getScaleFactorFromSettings();
        this.updateCompactMode(scaleFactor);
    }
    
    /**
     * Remove existing styles to avoid conflicts
     */
    removeExistingStyles() {
        const styleIds = [
            'civ-symbol-style',
            'civ-symbol-hidden-banners-style',
            'extended-yields-style',
            'banner-yields-style',
            'background-style',
            'compact-mode-style'
        ];
        
        styleIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });
    }

    /**
     * Update compact mode scaling
     * @param {number} scaleFactor - Scale factor to apply (1.0 = normal, less than 1.0 = smaller)
     */
    updateCompactMode(scaleFactor = SCALE_FACTORS.NORMAL) {
        try {
            const compactModeStyle = document.createElement('style');
            compactModeStyle.id = 'compact-mode-style';
            
            // Apply the appropriate style based on the scale factor
            if (scaleFactor === SCALE_FACTORS.NORMAL) {
                compactModeStyle.textContent = COMPACT_MODE_STYLES.NORMAL;
            } else if (scaleFactor === SCALE_FACTORS.COMPACT) {
                compactModeStyle.textContent = COMPACT_MODE_STYLES.COMPACT;
            } else if (scaleFactor === SCALE_FACTORS.ULTRA_COMPACT) {
                compactModeStyle.textContent = COMPACT_MODE_STYLES.ULTRA_COMPACT;
            } else {
                // Default to normal if an invalid scale factor is provided
                compactModeStyle.textContent = COMPACT_MODE_STYLES.NORMAL;
            }
            
            document.head.appendChild(compactModeStyle);
        } catch (error) {
            console.error("Error updating compact mode:", error);
        }
    }

    /**
     * Gets the scale factor based on the compact mode setting
     * @returns {number} Scale factor (1.0 = normal, 0.92 = compact, 0.85 = ultra-compact)
     * @private
     */
    getScaleFactorFromSettings() {
        const compactModeSetting = enhancedDiploBannersSettings?.CompactMode ?? 0;
        if (compactModeSetting === 1) {
            return SCALE_FACTORS.COMPACT; // 92%
        } else if (compactModeSetting === 2) {
            return SCALE_FACTORS.ULTRA_COMPACT; // 85%
        }
        return SCALE_FACTORS.NORMAL; // 100%
    }

    /**
     * Add Civ banner
     * @param {boolean} showCivSymbol - Whether to show civ symbols
     */
    addCivBanner(showCivSymbol = true) {
        try {
            const symbolStyle = document.createElement('style');
            symbolStyle.id = 'civ-symbol-style';
            
            // Apply the appropriate style
            symbolStyle.textContent = showCivSymbol 
                ? SHOW_CIV_SYMBOL_STYLES 
                : HIDE_CIV_SYMBOL_STYLES;
            
            document.head.appendChild(symbolStyle);
        } catch (error) {
            console.error("Error adding custom styles:", error);
        }
    }
    
    /**
     * Add special styles for civ symbol when banners are hidden
     * This ensures the symbol is visible on the front banner but handled correctly when expanded
     * @param {boolean} showCivSymbol - Whether to show civ symbols based on user preference
     */
    addCivBannerWhenHidden(showCivSymbol = true) {
        try {
            const symbolStyle = document.createElement('style');
            symbolStyle.id = 'civ-symbol-hidden-banners-style';
            
            // Create styles that handle symbol visibility appropriately
            symbolStyle.textContent = `
                /* Always show the civ symbol on the front banner */
                .diplo-ribbon .diplo-ribbon__symbol {
                    display: block !important;
                    transform: scale(1) !important;
                    margin-top: 3.2rem !important;
                    z-index: 10 !important;
                }
                
                /* Handle the civ symbol when hovering/expanded */
                .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__symbol {
                    display: ${showCivSymbol ? 'block' : 'none'} !important;
                    ${showCivSymbol ? 'transform: scale(0.6) !important; margin-top: 2.3rem !important;' : ''}
                }
                
                /* Handle the civ symbol when hover-all class is present */
                .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__symbol {
                    display: ${showCivSymbol ? 'block' : 'none'} !important;
                    ${showCivSymbol ? 'transform: scale(0.6) !important; margin-top: 2.3rem !important;' : ''}
                }
                
                /* Make sure hover-all doesn't hide symbols if they should be shown */
                .diplo-ribbon .diplo-ribbon-outer.hover-all.forced-show .diplo-ribbon__symbol {
                    display: ${showCivSymbol ? 'block' : 'none'} !important;
                    ${showCivSymbol ? 'transform: scale(0.6) !important; margin-top: 2.3rem !important;' : ''}
                }
                
                /* Control the color bar above yields */
                .diplo-ribbon .diplo-background::before {
                    display: none !important;
                }
                
                .diplo-ribbon .diplo-ribbon-outer:hover .diplo-background::before,
                .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-background::before,
                .diplo-ribbon .diplo-ribbon-outer.hover-all.forced-show .diplo-background::before {
                    display: ${showCivSymbol ? 'block' : 'none'} !important;
                }
                
                /* Adjust yields position */
                .diplo-ribbon .diplo-ribbon__yields {
                    margin-top: ${showCivSymbol ? '-0.1rem' : '-1.7rem'} !important;
                }
            `;
            
            document.head.appendChild(symbolStyle);
        } catch (error) {
            console.error("Error adding hidden banners civ symbol styles:", error);
        }
    }

    /**
     * Update extended yields visibility based on settings
     * @param {boolean} useUserSetting - If false, don't show extended yields
     */
    updateExtendedYieldsVisibility(useUserSetting = true) {
        try {
            const extendedYieldsStyle = document.createElement('style');
            extendedYieldsStyle.id = 'extended-yields-style';
            
            // Determine which style to use
            let shouldAlwaysShowExtended = useUserSetting
                ? (enhancedDiploBannersSettings && enhancedDiploBannersSettings.AlwaysShowExtendedYields === true)
                : false;
            
            // Apply the appropriate style
            extendedYieldsStyle.textContent = shouldAlwaysShowExtended
                ? ALWAYS_SHOW_EXTENDED_YIELDS_STYLES
                : SHOW_EXTENDED_YIELDS_ON_HOVER_STYLES;
            
            document.head.appendChild(extendedYieldsStyle);
        } catch (error) {
            console.error("Error updating extended yields visibility:", error);
        }
    }

    /**
     * Update the background style based on the user's setting
     */
    updateBackgroundStyle() {
        try {
            const backgroundStyle = document.createElement('style');
            backgroundStyle.id = 'background-style';

            // Get the selected background style
            const styleIndex = enhancedDiploBannersSettings.BackgroundStyle || 1;
            let styleCSS = '';
            
            // Select the appropriate background style
            switch (styleIndex) {
                case 1:
                    styleCSS = BACKGROUND_STYLES.DEFAULT;
                    break;
                case 2:
                    styleCSS = BACKGROUND_STYLES.ORIGINAL;
                    break;
                case 3:
                    styleCSS = BACKGROUND_STYLES.GOLDEN;
                    break;
                case 4:
                    styleCSS = BACKGROUND_STYLES.FOREST;
                    break;
                case 5:
                    styleCSS = BACKGROUND_STYLES.PHANTOM;
                    break;
                default:
                    styleCSS = BACKGROUND_STYLES.DEFAULT;
                    break;
            }
            
            // Create the CSS rule
            backgroundStyle.textContent = `
                .diplo-ribbon .diplo-ribbon__bg,
                .diplo-ribbon .diplo-background {
                    ${styleCSS}
                }
            `;
            
            document.head.appendChild(backgroundStyle);
        } catch (error) {
            console.error("Error updating background style:", error);
        }
    }

    /**
     * Update banner yields visibility based on settings
     * @param {boolean} hideBanners - If true, hide banners
     */
    updateBannerYieldsVisibility(hideBanners = false) {
        try {
            const bannerYieldsStyle = document.createElement('style');
            bannerYieldsStyle.id = 'banner-yields-style';
            
            // Apply the appropriate style based on the setting
            bannerYieldsStyle.textContent = hideBanners
                ? HIDE_BANNERS_STYLES
                : SHOW_BANNERS_STYLES;
            
            document.head.appendChild(bannerYieldsStyle);
        } catch (error) {
            console.error("Error updating banner yields visibility:", error);
        }
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
            
            // Process each ribbon
            this.component.diploRibbons.forEach((diploRibbon, index) => {
                if (!diploRibbon) return;
                
                // Modify background elements
                this.modifyRibbonBackground(diploRibbon, index, targetArray);
                
                // Add civilization emblems
                this.addCivEmblem(diploRibbon, index, targetArray);

                // Add circular portrait frame
                this.addCircularPortraitFrame(diploRibbon);
                
                // Add class for hide banners mode if needed
                if (enhancedDiploBannersSettings && enhancedDiploBannersSettings.HideBanners === true) {
                    diploRibbon.classList.add('hidden-banners-mode');
                } else {
                    diploRibbon.classList.remove('hidden-banners-mode');
                }
                
                // Ensure the civ symbol is properly displayed when banners aren't hidden
                // and the setting is enabled
                if (!enhancedDiploBannersSettings?.HideBanners 
                    && enhancedDiploBannersSettings?.ShowCivSymbol !== false) {
                    const symbol = diploRibbon.querySelector('.diplo-ribbon__symbol');
                    if (symbol) {
                        symbol.style.display = 'block';
                        symbol.style.transform = 'scale(0.6)';
                        symbol.style.marginTop = '2.3rem';
                    }
                }
                
                // Remove any hover-all and forced-show classes to ensure clean state
                diploRibbon.classList.remove('hover-all');
                diploRibbon.classList.remove('forced-show');
            });
        } catch (error) {
            console.error(`DiploRibbonEnhancer: Populate flags error - ${error.message}`);
        }
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
    
    /**
     * Modify ribbon background based on player state
     * @param {HTMLElement} diploRibbon - Diplomatic ribbon element
     * @param {number} index - Index of the ribbon
     * @param {Array} targetArray - Player data array
     * @private
     */
    modifyRibbonBackground(diploRibbon, index, targetArray) {
        const bgElements = diploRibbon.querySelectorAll('.diplo-ribbon__bg');
        if (!bgElements?.length || !targetArray?.[index]) return;
        
        const player = targetArray[index];
        
        bgElements.forEach(bgElement => {
            // Replace class and toggle war state
            bgElement.classList.remove('diplo-ribbon__bg');
            bgElement.classList.add('diplo-background');
            bgElement.classList.toggle("player-at-war", player.isAtWar);
        });
    }
    
    /**
     * Add civilization emblem to the ribbon
     * @param {HTMLElement} diploRibbon - Diplomatic ribbon element
     * @param {number} index - Index of the ribbon
     * @param {Array} targetArray - Player data array
     * @private
     */
    addCivEmblem(diploRibbon, index, targetArray) {
        if (!targetArray?.[index]) return;
        
        const player = targetArray[index];
        const portrait = diploRibbon.querySelector('.diplo-ribbon__portrait');
        if (!portrait) return;
        
        // Remove any existing emblem to prevent duplicates
        const existingEmblem = portrait.querySelector('.civ-emblem');
        if (existingEmblem) {
            existingEmblem.remove();
        }
        
        // Create the colored emblem
        const emblem = document.createElement('div');
        emblem.classList.add('civ-emblem');
        
        // Find the original symbol to get its background image
        const originalSymbol = diploRibbon.querySelector('.diplo-ribbon__symbol');
        
        // Create the inner symbol element
        const symbolElement = document.createElement('div');
        symbolElement.classList.add('civ-emblem-symbol');
        
        // Try to get the civ symbol from different sources
        if (originalSymbol) {
            // Get inline style if it exists
            const symbolStyle = originalSymbol.getAttribute('style');
            if (symbolStyle && symbolStyle.includes('background-image')) {
                const bgImageMatch = symbolStyle.match(/background-image:\s*url\(['"]?([^'"()]+)['"]?\)/);
                if (bgImageMatch && bgImageMatch[1]) {
                    symbolElement.style.backgroundImage = `url('${bgImageMatch[1]}')`;
                }
            }
        }
        
        // If we couldn't get it from the style, try the player data
        if (!symbolElement.style.backgroundImage && player.civSymbol) {
            symbolElement.style.backgroundImage = `url('${player.civSymbol}')`;
        }
        
        // Add the symbol to the emblem
        emblem.appendChild(symbolElement);
        
        // Add the emblem to the portrait
        portrait.appendChild(emblem);
    }
    
    /**
     * Adds a circular frame around the leader portrait instead of the hexagon
     * @param {HTMLElement} diploRibbon - Diplomatic ribbon element
     * @private
     */
    addCircularPortraitFrame(diploRibbon) {
        const portrait = diploRibbon.querySelector('.diplo-ribbon__portrait');
        if (!portrait) return;
        
        // Remove any existing circular elements to prevent duplicates
        const existingCircleContainer = portrait.querySelector('.circular-portrait-container');
        if (existingCircleContainer) {
            existingCircleContainer.remove();
        }
        
        // Create the container
        const circleContainer = document.createElement('div');
        circleContainer.classList.add('circular-portrait-container');
        
        // Create the background circle
        const circleBg = document.createElement('div');
        circleBg.classList.add('circular-portrait-bg');
        circleContainer.appendChild(circleBg);
        
        // Create the glow effect
        const circleGlow = document.createElement('div');
        circleGlow.classList.add('circular-portrait-glow');
        circleContainer.appendChild(circleGlow);
        
        // Add to portrait
        portrait.appendChild(circleContainer);
    }

    // Lifecycle hook stubs (for potential future use)
    beforeAttach() {}
    afterAttach() {}
    beforeDetach() {}
    
    // Clean up when component is detached
    afterDetach() {
        window.removeEventListener('update-diplo-ribbon', this.settingsChangedListener);
    }
}

// Register the enhancer with the Controls system
Controls.decorate('panel-diplo-ribbon', (component) => new DiploRibbonEnhancer(component));
