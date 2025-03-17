/**
 * @file panel-diplo-ribbon-extension.js
 * @description Enhanced Diplomacy Ribbon mod for Civilization VII
 */

import { InterfaceMode } from '/core/ui/interface-modes/interface-modes.js';
import DiploRibbonData from '/base-standard/ui/diplo-ribbon/model-diplo-ribbon.js';
import { enhancedDiploBannersSettings } from 'fs://game/enhanced-diplomacy-banners/ui/settings/settings.js';
import { 
    MAIN_STYLES,
    SHOW_CIV_SYMBOL_STYLES,
    HIDE_CIV_SYMBOL_STYLES,
    ALWAYS_SHOW_EXTENDED_YIELDS_STYLES,
    SHOW_EXTENDED_YIELDS_ON_HOVER_STYLES,
    BACKGROUND_STYLES,
    SHOW_BANNERS_STYLES,
    HIDE_BANNERS_STYLES
} from './constants.js';

export class DiploRibbonEnhancer {
    constructor(component) {
        this.component = component;
        
        // Store original methods to allow restoration if needed
        this.originalOnInitialize = component.onInitialize;
        this.originalPopulateFlags = component.populateFlags;
        
        // Bind and override component methods
        component.onInitialize = this.onInitialize.bind(this);
        component.populateFlags = this.populateFlags.bind(this);

        // Add custom styles
        this.addCustomStyles();

        // Listen for settings changes
        this.settingsChangedListener = () => {
            // Update the CSS styles to reflect current settings
            this.applyAllStyles();
        };

        // Listen for settings changes
        window.addEventListener('update-diplo-ribbon', this.settingsChangedListener);
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
        
        if (hideBanners) {
            // For the civ banner/symbol, we need special handling when banners are hidden
            // We need to show the civ symbol on the banner but hide it in the expanded view
            this.addCivBannerWhenHidden();
            // Force extended yields to not be shown
            this.updateExtendedYieldsVisibility(false);
        } else {
            // Apply all settings normally using the actual user settings
            this.addCivBanner();
            this.updateExtendedYieldsVisibility();
        }
        
        // Background style is always applied regardless of other settings
        this.updateBackgroundStyle();
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
            'background-style'
        ];
        
        styleIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });
    }

    /**
     * Add Civ banner
     * @param {boolean} [useUserSetting=true] - If false, force hide civ symbols
     */
    addCivBanner(useUserSetting = true) {
        try {
            const symbolStyle = document.createElement('style');
            symbolStyle.id = 'civ-symbol-style';
            
            // Determine which style to use
            let shouldShowSymbol = useUserSetting 
                ? (enhancedDiploBannersSettings && enhancedDiploBannersSettings.ShowCivSymbol !== false)
                : false;
            
            // Apply the appropriate style
            symbolStyle.textContent = shouldShowSymbol 
                ? SHOW_CIV_SYMBOL_STYLES 
                : HIDE_CIV_SYMBOL_STYLES;
            
            document.head.appendChild(symbolStyle);
        } catch (error) {
            console.error("Error adding custom styles:", error);
        }
    }
    
    /**
     * Add special styles for civ symbol when banners are hidden
     * This ensures the symbol is visible on the front banner but hidden when expanded
     */
    addCivBannerWhenHidden() {
        try {
            const symbolStyle = document.createElement('style');
            symbolStyle.id = 'civ-symbol-hidden-banners-style';
            
            // Get user preference for showing the symbol
            // To-Do: fix hovering if Civ Emblem is enabled while banners are hidden
            // const userPrefersCivSymbol = enhancedDiploBannersSettings && enhancedDiploBannersSettings.ShowCivSymbol !== false;
            const userPrefersCivSymbol = false;

            // Create styles that show the symbol on the front banner but hide it in expanded view
            symbolStyle.textContent = `
                /* Always show the civ symbol on the front banner */
                .diplo-ribbon .diplo-ribbon__symbol {
                    display: block !important;
                    transform: scale(1) !important;
                    margin-top: 3.2rem !important;
                    z-index: 10 !important;
                }
                
                /* Hide the civ symbol when hovering/expanded */
                .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__symbol {
                    display: ${userPrefersCivSymbol ? 'block' : 'none'} !important;
                    ${userPrefersCivSymbol ? 'transform: scale(0.6) !important; margin-top: 2.3rem !important;' : ''}
                }
                
                /* Control the color bar above yields */
                .diplo-ribbon .diplo-background::before {
                    display: none !important;
                }
                
                .diplo-ribbon .diplo-ribbon-outer:hover .diplo-background::before {
                    display: ${userPrefersCivSymbol ? 'block' : 'none'} !important;
                }
                
                /* Adjust yields position */
                .diplo-ribbon .diplo-ribbon__yields {
                    margin-top: ${userPrefersCivSymbol ? '-0.1rem' : '-1.7rem'} !important;
                }
            `;
            
            document.head.appendChild(symbolStyle);
        } catch (error) {
            console.error("Error adding hidden banners civ symbol styles:", error);
        }
    }

    /**
     * Update extended yields visibility based on settings
     * @param {boolean} [useUserSetting=true] - If false, don't show extended yields
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
    afterDetach() {}
}

// Register the enhancer with the Controls system
Controls.decorate('panel-diplo-ribbon', (component) => new DiploRibbonEnhancer(component));
