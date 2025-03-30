// portrait-manager.js
export class PortraitManager {
    constructor(component) {
        this.component = component;
    }
    
    /**
     * Adds a circular frame around the leader portrait
     * @param {HTMLElement} diploRibbon - The diplomatic ribbon element
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
    
    /**
     * Add civilization emblem to the ribbon
     * @param {HTMLElement} diploRibbon - Diplomatic ribbon element
     * @param {number} index - Index of the ribbon
     * @param {Array} targetArray - Player data array
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
}
