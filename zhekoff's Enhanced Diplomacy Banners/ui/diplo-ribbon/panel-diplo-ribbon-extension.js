/**
 * @file enhanced-diplo-ribbon-enhancer.js
 * @description Enhanced Diplomacy Ribbon mod for Civilization VII
 */

import { InterfaceMode } from '/core/ui/interface-modes/interface-modes.js';
import DiploRibbonData from '/base-standard/ui/diplo-ribbon/model-diplo-ribbon.js';

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
    }
    
    /**
     * Inject custom CSS styles for the diplomatic ribbon
     * @private
     */
    addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Make relationship elements interactive */
            .relationship-icon, 
            .diplo-ribbon__relation-container,
            .diplo-ribbon__war-support-count {
                pointer-events: auto !important;
                z-index: 20 !important;
                position: relative !important;
            }

            /* Ensure the relationship container stays at the proper position */
            .diplo-ribbon-outer:hover .diplo-ribbon__relation-container,
            .diplo-ribbon-outer:hover .relationship-icon {
                transition-duration: 0.3s;
                transition-delay: 0s;
            }

            /* Position relationship icon at bottom border */
            .relationship-icon {
                margin-top: 7.5rem;
                transition: margin-top 0.3s ease-in-out;
            }
            
            .relationship-icon:hover {
             }

            .diplo-ribbon-outer:hover .diplo-ribbon__relation-container {
                margin-top: 6.5rem;
            }

            .diplo-ribbon__war-support-count {
                margin-top: 1.1rem !important;
                border-radius: 0.75rem;
                box-shadow: 0 0 1.3888888889rem rgba(26, 24, 24, 0.9);
                position: relative;
                top: -0.5rem;
                transition: inherit;
                z-index: 1;
            }
            
            /* Portrait styling */
            .diplo-ribbon__portrait {
                --diplo-ribbon-scale: 0.8;
                z-index: 3;
            }

            .diplo-ribbon__portrait.turn-active ~ .diplo-ribbon__relation-container,
            .diplo-ribbon__portrait.turn-active ~ .relationship-icon,
            .diplo-ribbon__portrait.turn-active .relationship-icon,
            .diplo-ribbon__portrait.turn-active .diplo-ribbon__war-support-count {
                top: 0.5555555556rem !important;
            }

            // To-do: Add hover effect for portrait
            .diplo-ribbon__portrait:hover {
                --diplo-ribbon-scale: 0.8;
            }

            /* Gradient top border with player color */
            .diplo-background::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 0.5rem;
                background-color: var(--player-color-primary);
                border-top-left-radius: 0.75rem;
                border-top-right-radius: 0.75rem;
                opacity: 0.5;
                z-index: 1;
            }

            /* Always show yields */
            .diplo-ribbon-outer.show-on-hover .diplo-ribbon__yields,
            .diplo-ribbon-outer.show-on-hover .diplo-ribbon__bottom-spacer,
            .diplo-ribbon-outer.show-on-hover .diplo-ribbon__bg-container {
                display: flex !important;
            }

            /* Hide unnecessary elements */
            .diplo-ribbon__front-banner,
            .diplo-ribbon__front-banner-shadow,
            .diplo-ribbon__front-banner-overlay,
            .diplo-ribbon__symbol {
                display: none !important;
            }

            /* Yields position */
            .diplo-ribbon__yields {
                margin-top: -2rem !important;
                transition: all 0.3s ease-in-out;
            }

            /* Aggressive bottom spacer removal */
            .diplo-ribbon__bottom-spacer,
            div[class*="bottom-spacer"] {
                display: none !important;
                height: 0 !important;
                max-height: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
                overflow: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }

            /* Background styling */
            .diplo-ribbon__bg,
            .diplo-background {
                background-color: rgba(26, 24, 24, 0.9);
                border: 0.1111111111rem solid #8C7F66;
                box-shadow: 0 0 1.3888888889rem rgba(26, 24, 24, 0.9);
                border-radius: 0.75rem;
                transition: height 0.3s ease-in-out;
                overflow: hidden;
            }

            /* War state styling */
            .diplo-background.player-at-war,
            .diplo-ribbon__bg.player-at-war {
                background-color: rgba(73, 4, 4, 0.78);
            }

            /* Yield item styling */
            .yield-item {
                font-size: 0.8rem !important;
                font-weight: bold;
            }

            /* Space between banners */
            .diplo-ribbon-outer {
                margin: 0.1111111111rem;
            }

            /* Remove separator by default */
            .diplo-ribbon__yields > *:nth-child(5) {
                border-top: 0 !important;
                margin-top: 0 !important;
                padding-top: 0 !important;
                transition: all 0.3s ease-in-out !important;
            }

            .diplo-ribbon__yields > * {
                margin: 0 !important;
                padding: 0 !important;
            }

            /* Hide extended yields by default */
            .diplo-ribbon__yields > *:nth-child(6),
            .diplo-ribbon__yields > *:nth-child(7),
            .diplo-ribbon__yields > *:nth-child(8),
            .diplo-ribbon__yields > *:nth-child(9) {
                display: block !important;
                opacity: 0 !important;
                max-height: 0 !important;
                pointer-events: none !important;
                visibility: hidden !important;
                overflow: hidden !important;
                margin: 0 !important;
                padding: 0 !important;
                transform: translateY(-20px) !important;
                transition-property: none !important;
            }

            /* Show extended yields on hover with animation */
            .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(6),
            .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(7),
            .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(8),
            .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(9) {
                display: flex !important;
                opacity: 1 !important;
                max-height: 2rem !important;
                pointer-events: auto !important;
                visibility: visible !important;
                overflow: visible !important;
                transform: translateY(0) !important;
                transition-property: opacity, transform !important;
                transition-duration: 0.3s !important;
                transition-timing-function: ease-in-out !important;
            }

            /* Stagger the animations for a nicer effect */
            .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(6) {
                transition-delay: 0s !important;
            }

            .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(7) {
                transition-delay: 0s !important;
            }
            
            .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(8) {
                transition-delay: 0.05s !important;
            }
            
            .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(9) {
                transition-delay: 0.1s !important;
            }

            /* Add separator on hover after the 5th yield element */
            .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(6) {
                border-top: 0.0555555556rem solid #8C7F66 !important;
                margin-top: 0.5rem !important;
                padding-top: 0.5rem !important;
            }
        `;
        document.head.appendChild(style);
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
            
            // Mark relation elements to prevent scaling
            this.markRelationElements();
            
            // Get player data based on interface mode
            const targetArray = this.getTargetPlayerArray();
            
            // Process each ribbon
            this.component.diploRibbons.forEach((diploRibbon, index) => {
                if (!diploRibbon) return;
                
                // Modify background elements
                this.modifyRibbonBackground(diploRibbon, index, targetArray);
                
                // Add civilization emblems
                this.addCivEmblem(diploRibbon, index, targetArray);
            });
        } catch (error) {
            console.error(`DiploRibbonEnhancer: Populate flags error - ${error.message}`);
        }
    }
    
    /**
     * Mark relation elements to prevent unwanted scaling
     * @private
     */
    markRelationElements() {
        const relationElements = this.component.Root.querySelectorAll('.relationship-icon, .diplo-ribbon__relation-container');
        relationElements.forEach(el => {
            el.classList.add('relation-element-no-scale');
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
    
    // Lifecycle hook stubs (for potential future use)
    beforeAttach() {}
    afterAttach() {}
    beforeDetach() {}
    afterDetach() {}
}

// Register the enhancer with the Controls system
Controls.decorate('panel-diplo-ribbon', (component) => new DiploRibbonEnhancer(component));