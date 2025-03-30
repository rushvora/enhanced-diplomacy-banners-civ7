// style-manager.js
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
} from '../styles/index.js';

import {
    COMPACT_MODE_STYLES,
    SCALE_FACTORS
} from '../features/compact-mode.js';

export class StyleManager {
    constructor() {
        this.styles = {};
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;
        
        // Create main styles once
        this.addStyle('main', MAIN_STYLES);
        this.addStyle('hover-all', HOVER_ALL_STYLES);
        
        // Create placeholder elements for togglable styles
        this.addStyle('civ-symbol', '');
        this.addStyle('extended-yields', '');
        this.addStyle('background', '');
        this.addStyle('banner-yields', '');
        this.addStyle('compact-mode', '');
        
        this.initialized = true;
    }
    
    addStyle(id, css) {
        // Remove existing if present
        this.removeStyle(id);
        
        // Create new style element
        const style = document.createElement('style');
        style.id = `diplo-ribbon-${id}-style`;
        style.textContent = css;
        document.head.appendChild(style);
        
        // Store reference
        this.styles[id] = style;
        
        return style;
    }
    
    removeStyle(id) {
        const existingStyle = document.getElementById(`diplo-ribbon-${id}-style`);
        if (existingStyle) {
            existingStyle.remove();
        }
        
        if (this.styles[id]) {
            delete this.styles[id];
        }
    }
    
    updateCivSymbolStyle(showCivSymbol, hideBanners) {
        const css = hideBanners 
            ? this.generateHiddenBannersCivSymbolStyle(showCivSymbol)
            : (showCivSymbol ? SHOW_CIV_SYMBOL_STYLES : HIDE_CIV_SYMBOL_STYLES);
            
        this.updateStyle('civ-symbol', css);
    }
    
    updateExtendedYieldsStyle(alwaysShowExtended, useUserSetting) {
        const shouldShow = useUserSetting ? alwaysShowExtended : false;
        const css = shouldShow 
            ? ALWAYS_SHOW_EXTENDED_YIELDS_STYLES 
            : SHOW_EXTENDED_YIELDS_ON_HOVER_STYLES;
            
        this.updateStyle('extended-yields', css);
    }
    
    updateBackgroundStyle(styleIndex) {
        let styleCSS = '';
        
        // Select the appropriate background style
        switch (styleIndex) {
            case 1: styleCSS = BACKGROUND_STYLES.DEFAULT; break;
            case 2: styleCSS = BACKGROUND_STYLES.ORIGINAL; break;
            case 3: styleCSS = BACKGROUND_STYLES.GOLDEN; break;
            case 4: styleCSS = BACKGROUND_STYLES.FOREST; break;
            case 5: styleCSS = BACKGROUND_STYLES.PHANTOM; break;
            default: styleCSS = BACKGROUND_STYLES.DEFAULT; break;
        }
        
        // Create the CSS rule
        const css = `
            .diplo-ribbon .diplo-ribbon__bg,
            .diplo-ribbon .diplo-background {
                ${styleCSS}
            }
        `;
        
        this.updateStyle('background', css);
    }
    
    updateBannerYieldsStyle(hideBanners) {
        const css = hideBanners
            ? HIDE_BANNERS_STYLES
            : SHOW_BANNERS_STYLES;
            
        this.updateStyle('banner-yields', css);
    }
    
    updateCompactMode(scaleFactor = SCALE_FACTORS.NORMAL) {
        let css = '';
        
        // Apply the appropriate style based on the scale factor
        if (scaleFactor === SCALE_FACTORS.NORMAL) {
            css = COMPACT_MODE_STYLES.NORMAL;
        } else if (scaleFactor === SCALE_FACTORS.COMPACT) {
            css = COMPACT_MODE_STYLES.COMPACT;
        } else if (scaleFactor === SCALE_FACTORS.ULTRA_COMPACT) {
            css = COMPACT_MODE_STYLES.ULTRA_COMPACT;
        } else {
            // Default to normal if an invalid scale factor is provided
            css = COMPACT_MODE_STYLES.NORMAL;
        }
        
        this.updateStyle('compact-mode', css);
    }
    
    updateStyle(id, css) {
        if (this.styles[id]) {
            this.styles[id].textContent = css;
        } else {
            this.addStyle(id, css);
        }
    }
    
    applyAllStyles(settings) {
        this.initialize();
        
        // Apply styles based on settings
        const hideBanners = settings?.HideBanners === true;
        const showCivSymbol = settings?.ShowCivSymbol !== false;
        const alwaysShowExtended = settings?.AlwaysShowExtendedYields === true;
        const backgroundStyle = settings?.BackgroundStyle || 1;
        const compactMode = settings?.CompactMode || 0;
        
        // Update all style components
        this.updateBannerYieldsStyle(hideBanners);
        this.updateCivSymbolStyle(showCivSymbol, hideBanners);
        this.updateExtendedYieldsStyle(alwaysShowExtended, !hideBanners);
        this.updateBackgroundStyle(backgroundStyle);
        
        // Get scale factor and apply compact mode
        const scaleFactor = this.getScaleFactorFromSettings(compactMode);
        this.updateCompactMode(scaleFactor);
    }
    
    getScaleFactorFromSettings(compactMode) {
        if (compactMode === 1) {
            return SCALE_FACTORS.COMPACT; // 92%
        } else if (compactMode === 2) {
            return SCALE_FACTORS.ULTRA_COMPACT; // 85%
        }
        return SCALE_FACTORS.NORMAL; // 100%
    }
    
    generateHiddenBannersCivSymbolStyle(showCivSymbol) {
        // Create the special hidden banners civ symbol style
        return `
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
    }
    
    // Clean up all styles
    cleanup() {
        Object.keys(this.styles).forEach(id => {
            this.removeStyle(id);
        });
        this.initialized = false;
    }
}
