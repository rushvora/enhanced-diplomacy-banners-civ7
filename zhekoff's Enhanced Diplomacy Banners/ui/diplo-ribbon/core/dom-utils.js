// dom-utils.js
export class DOMUtils {
    /**
     * Create an element with attributes and classes
     * @param {string} tagName - HTML tag name
     * @param {Object} attributes - Attributes to set
     * @param {string|string[]} classes - CSS classes to add
     * @returns {HTMLElement} The created element
     */
    static createElement(tagName, attributes = {}, classes = []) {
        const element = document.createElement(tagName);
        
        // Add attributes
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        
        // Add classes
        if (Array.isArray(classes)) {
            element.classList.add(...classes);
        } else if (typeof classes === 'string') {
            element.classList.add(classes);
        }
        
        return element;
    }
    
    /**
     * Find or create an element
     * @param {HTMLElement} parent - Parent element
     * @param {string} selector - CSS selector to find element
     * @param {string} tagName - Tag name for new element if not found
     * @param {Object} attributes - Attributes for new element
     * @param {string|string[]} classes - Classes for new element
     * @returns {HTMLElement} Found or created element
     */
    static findOrCreate(parent, selector, tagName, attributes = {}, classes = []) {
        let element = parent.querySelector(selector);
        
        if (!element) {
            element = this.createElement(tagName, attributes, classes);
            parent.appendChild(element);
        }
        
        return element;
    }
    
    /**
     * Set multiple styles on an element
     * @param {HTMLElement} element - Target element
     * @param {Object} styles - Styles to apply
     */
    static setStyles(element, styles) {
        Object.entries(styles).forEach(([property, value]) => {
            element.style[property] = value;
        });
    }
    
    /**
     * Batch DOM operations with requestAnimationFrame
     * @param {Function} callback - Function to execute
     */
    static batchUpdate(callback) {
        requestAnimationFrame(() => {
            const fragment = document.createDocumentFragment();
            callback(fragment);
        });
    }
    
    /**
     * Toggle multiple classes based on conditions
     * @param {HTMLElement} element - Target element
     * @param {Object} classMap - Map of class names to boolean conditions
     */
    static toggleClasses(element, classMap) {
        Object.entries(classMap).forEach(([className, condition]) => {
            element.classList.toggle(className, condition);
        });
    }
}
