// yield-manager.js
export class YieldManager {
    constructor(component) {
        this.component = component;
    }
    
    /**
     * Toggle extended yields visibility
     * @param {HTMLElement} diploRibbon - The ribbon element
     * @param {boolean} alwaysShowExtended - Whether to always show extended yields
     */
    configureExtendedYields(diploRibbon, alwaysShowExtended) {
        if (!diploRibbon) return;
        
        const yieldsContainer = diploRibbon.querySelector('.diplo-ribbon__yields');
        if (!yieldsContainer) return;
        
        // Get all yield items
        const yieldItems = yieldsContainer.children;
        if (yieldItems.length <= 5) return; // No extended yields
        
        // Configure basic yields (always visible)
        for (let i = 0; i < 5 && i < yieldItems.length; i++) {
            yieldItems[i].style.display = 'flex';
            yieldItems[i].style.opacity = '1';
            yieldItems[i].style.maxHeight = '2rem';
        }
        
        // Configure extended yields
        for (let i = 5; i < yieldItems.length; i++) {
            if (alwaysShowExtended) {
                yieldItems[i].style.display = 'flex';
                yieldItems[i].style.opacity = '1';
                yieldItems[i].style.maxHeight = '2rem';
                
                // Add separator to first extended item
                // if (i === 6) {
                //     yieldItems[i].style.borderTop = '0.0555555556rem solid #8C7F66';
                //     yieldItems[i].style.marginTop = '0.5rem';
                //     yieldItems[i].style.paddingTop = '0.5rem';
                // }
            } else {
                // Hide by default, shown on hover via CSS
                yieldItems[i].style.display = 'block';
                yieldItems[i].style.opacity = '0';
                yieldItems[i].style.maxHeight = '0';
            }
        }
    }
    
    /**
     * Format yield value with proper sign
     * @param {number} value - The yield value
     * @returns {string} Formatted yield value with sign
     */
    formatYieldValue(value) {
        return (value >= 0 ? "+" : "") + value.toFixed(1);
    }
    
    /**
     * Highlight yield values that are close to or exceeding thresholds
     * @param {HTMLElement} yieldElement - The yield display element
     * @param {number} currentValue - Current yield value
     * @param {number} maxValue - Maximum threshold
     */
    highlightYieldValue(yieldElement, currentValue, maxValue) {
        if (!yieldElement) return;
        
        // Remove existing highlighting classes
        yieldElement.classList.remove('yield-warning', 'yield-critical');
        
        // No highlighting needed if no threshold or value is well below threshold
        if (!maxValue || maxValue === Infinity || currentValue < maxValue * 0.8) return;
        
        // Add warning class if value is approaching threshold
        if (currentValue >= maxValue * 0.8 && currentValue < maxValue) {
            yieldElement.classList.add('yield-warning');
        }
        // Add critical class if value exceeds threshold
        else if (currentValue >= maxValue) {
            yieldElement.classList.add('yield-critical');
        }
    }
}
