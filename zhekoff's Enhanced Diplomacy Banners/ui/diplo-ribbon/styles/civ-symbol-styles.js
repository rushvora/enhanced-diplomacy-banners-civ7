/**
 * @file civ-symbol-styles.js
 * @description Styles for civilization symbol display options
 */

// Style templates for when civilization symbols should be shown
export const SHOW_CIV_SYMBOL_STYLES = `
    .diplo-ribbon .diplo-ribbon__symbol {
        transform: scale(0.6) !important;
        margin-top: 2.3rem;
        display: block !important;
    }
    
    .diplo-ribbon .diplo-background::before {
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
        display: block !important;
    }
    
    .diplo-ribbon .diplo-ribbon__yields {
        margin-top: -0.1rem !important;
    }
`;

// Style templates for when civilization symbols should be hidden
export const HIDE_CIV_SYMBOL_STYLES = `
    .diplo-ribbon .diplo-ribbon__symbol {
        display: none !important;
    }
    
    .diplo-ribbon .diplo-background::before {
        display: none !important;
    }
    
    .diplo-ribbon .diplo-ribbon__yields {
        margin-top: -1.7rem !important;
    }
`;
