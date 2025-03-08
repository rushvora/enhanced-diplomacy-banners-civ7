/**
 * @file panel-diplo-ribbon-extension.js
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
            /* Styling the relationship icon */
            .relationship-icon {
                transform: scale(0.6);
                margin-top: -0.7rem;
                margin-right: 2.4rem;
                z-index: 20;
                filter: 
                    drop-shadow(0.1111111111rem 0 0 #b6afa2) 
                    drop-shadow(0 0.1111111111rem 0 #b6afa2) 
                    drop-shadow(-0.1111111111rem 0 0 #b6afa2) 
                    drop-shadow(0 -0.1111111111rem 0 #b6afa2)
            }

            /* War support styling with circle design */
            .diplo-ribbon__war-support-count {
                position: absolute !important;
                justify-content: center !important;
                align-items: center !important;
                width: 1.5rem !important;
                height: 1.5rem !important;
                border-radius: 50% !important; /* Make it circular */
                color: #FFFFFF !important;
                background-color: #616266 !important; /* Neutral gray by default */
                border: 0.05rem solid #b6afa2;
                font-weight: bold !important;
                font-size: 0.7rem !important;
                right: 1rem !important; /* Position on right side */
                top: 2.8rem !important;
                z-index: 20 !important;
                box-shadow: 0 0 0.2rem rgba(0,0,0,0.5) !important;
                margin: 0 !important; /* Reset margins */
                padding: 0 !important; /* Reset padding */
                transform: none !important; /* Remove any transforms */
                font-weight: bold !important;
            }

            /* Positive war support (green circle) */
            .diplo-ribbon__war-support-count.positive {
                background-color: #579544 !important;
                box-shadow: 0 0 0.2rem rgba(87, 149, 68, 0.5) !important;
            }

            /* Negative war support (red circle) */
            .diplo-ribbon__war-support-count.negative {
                background-color:rgb(180, 54, 83) !important;
                box-shadow: 0 0 0.2rem rgba(148, 67, 86, 0.5) !important;
            }
    
            /* Hide original hexagon elements */
            .diplo-ribbon__portrait-hex-bg,
            .diplo-ribbon__portrait-hex-bg-frame,
            .diplo-ribbon__portrait-hex-bg-shadow {
                display: none !important;
            }
            
            /* Create circular portrait container */
            .circular-portrait-container {
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                pointer-events: none;
                z-index: 2;
            }
            
            /* Circular background */
            .circular-portrait-bg {
                position: absolute;
                width: 70%;
                height: 70%;
                border-radius: 50%;
                background: #000000;
                border: 0.1666666667rem solid #8C7F66;
                box-shadow: 0 0 0.5555555556rem rgba(0, 0, 0, 0.5), 
                            inset 0 0 0.2777777778rem rgba(255, 255, 255, 0.2);
            }
            
            /* Highlight on hover */
            .diplo-ribbon__portrait:hover .circular-portrait-bg {
                border-color:#c7ae80;
            }
            
            /* Ensure portrait stays on top */
            .diplo-ribbon__portrait-image {
                z-index: 3;
                position: relative;
            }
            
            /* Portrait styling */
            .diplo-ribbon__portrait {
                --diplo-ribbon-scale: 0.9;
                z-index: 3;
            }

            .diplo-ribbon__portrait:hover {
                --diplo-ribbon-scale: 1;
            }

            /* Symbol background with subtle shadow */
            .diplo-background::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 1.2rem;
                margin-top: 1.7rem;
                background-color: var(--player-color-primary);
                opacity: 0.9;
                z-index: 1;
                box-shadow: 0 0 0.1666666667rem var(--player-color-primary);
                border-radius: 0.1111111111rem;
            }

            /* Always show yields */
            .diplo-ribbon-outer.show-on-hover .diplo-ribbon__yields,
            .diplo-ribbon-outer.show-on-hover .diplo-ribbon__bottom-spacer,
            .diplo-ribbon-outer.show-on-hover .diplo-ribbon__bg-container {
                display: flex !important;
            }
            
            .diplo-ribbon__symbol {
                transform: scale(0.6) !important;
                margin-top: 2.3rem;
            }

            /* Hide unnecessary elements */
            .diplo-ribbon__front-banner,
            .diplo-ribbon__front-banner-shadow,
            .diplo-ribbon__front-banner-overlay {
                display: none !important;
            }

            /* Yields position */
            .diplo-ribbon__yields {
                margin-top: -0.1rem !important;
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
                background-color:rgb(26, 24, 24);
                border: 0.1111111111rem solid #8C7F66;
                box-shadow: 0 0 1.3888888889rem rgba(26, 24, 24, 0.9);
                border-radius: 0.75rem;
                transition: height 0.3s ease-in-out;
                overflow: hidden;
            }

            /* War state styling; disabled for now, will add this as an option in the future
            .diplo-background.player-at-war,
            .diplo-ribbon__bg.player-at-war {
                background-color: rgba(73, 4, 4, 0.78);
            }
            */

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
