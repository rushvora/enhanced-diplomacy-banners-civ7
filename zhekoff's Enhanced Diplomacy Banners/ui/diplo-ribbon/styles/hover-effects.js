/**
 * @file hover-effects.js
 * @description Hover effect styles for the diplomatic ribbon
 */

// Styles for hover effects on all ribbons
export const HOVER_ALL_STYLES = `
    /* Always show yields when hover-all class is present */
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields,
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__bottom-spacer,
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__bg-container {
        display: flex !important;
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    /* When banners are hidden and hover-all is active, hide the front banner elements */
    .diplo-ribbon .hidden-banners-mode.hover-all .diplo-ribbon__front-banner,
    .diplo-ribbon .hidden-banners-mode.hover-all .diplo-ribbon__front-banner-shadow,
    .diplo-ribbon .hidden-banners-mode.hover-all .diplo-ribbon__front-banner-overlay {
        display: none !important;
    }
    
    /* Show basic yields for all banners */
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(1),
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(2),
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(3),
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(4),
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(5) {
        display: flex !important;
        opacity: 1 !important;
        max-height: 2rem !important;
        pointer-events: auto !important;
        visibility: visible !important;
        overflow: visible !important;
    }
    
    /* Add animation for extended yields */
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(6),
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(7),
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(8),
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(9),
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(10),
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(11) {
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
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(6) {
        transition-delay: 0s !important;
    }

    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(7) {
        transition-delay: 0.05s !important;
    }
    
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(8) {
        transition-delay: 0.1s !important;
    }
    
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(9) {
        transition-delay: 0.15s !important;
    }

    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(10) {
        transition-delay: 0.2s !important;
    }

    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(11) {
        transition-delay: 0.2s !important;
    }
    
    /* For hidden banners mode, when hover-all class is present */
    .diplo-ribbon .hidden-banners-mode.hover-all .diplo-ribbon__symbol {
        display: none !important;
    }

    /* Add separator after the 5th yield element */
    .diplo-ribbon .diplo-ribbon-outer.hover-all .diplo-ribbon__yields > *:nth-child(6) {
        border-top: 0.0555555556rem solid #8C7F66 !important;
        margin-top: 0.5rem !important;
        padding-top: 0.5rem !important;
    }
    
    /* Critical fixes for hidden banners mode when hovering */
    .diplo-ribbon .hidden-banners-mode.hover-all .diplo-ribbon__front-banner,
    .diplo-ribbon .hidden-banners-mode.hover-all .diplo-ribbon__front-banner-shadow,
    .diplo-ribbon .hidden-banners-mode.hover-all .diplo-ribbon__front-banner-overlay {
        display: none !important;
    }
    
    .diplo-ribbon .hidden-banners-mode.hover-all .diplo-ribbon__bg-container,
    .diplo-ribbon .hidden-banners-mode.hover-all .diplo-background,
    .diplo-ribbon .hidden-banners-mode.hover-all .diplo-ribbon__bg,
    .diplo-ribbon .hidden-banners-mode.hover-all .diplo-ribbon__yields {
        display: flex !important;
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    /* Fix for when hovering over non-local player banners when hidden banners is enabled */
    .diplo-ribbon .diplo-ribbon-outer:not(.hover-all).hidden-banners-mode:hover .diplo-ribbon__bg-container,
    .diplo-ribbon .diplo-ribbon-outer:not(.hover-all).hidden-banners-mode:hover .diplo-background,
    .diplo-ribbon .diplo-ribbon-outer:not(.hover-all).hidden-banners-mode:hover .diplo-ribbon__bg,
    .diplo-ribbon .diplo-ribbon-outer:not(.hover-all).hidden-banners-mode:hover .diplo-ribbon__yields {
        z-index: 20 !important;
    }

    /* Special class to ensure proper display in hidden banners mode */
    .diplo-ribbon .diplo-ribbon-outer.forced-show .diplo-ribbon__bg-container,
    .diplo-ribbon .diplo-ribbon-outer.forced-show .diplo-background,
    .diplo-ribbon .diplo-ribbon-outer.forced-show .diplo-ribbon__yields {
        display: flex !important;
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    /* Hide the front banner elements when forced-show is active */
    .diplo-ribbon .diplo-ribbon-outer.forced-show .diplo-ribbon__front-banner,
    .diplo-ribbon .diplo-ribbon-outer.forced-show .diplo-ribbon__front-banner-shadow,
    .diplo-ribbon .diplo-ribbon-outer.forced-show .diplo-ribbon__front-banner-overlay {
        display: none !important;
    }
    
    /* Ensure background is properly styled */
    .diplo-ribbon .diplo-ribbon-outer.forced-show .diplo-ribbon__bg,
    .diplo-ribbon .diplo-ribbon-outer.forced-show .diplo-background {
        height: auto !important;
        min-height: 12rem !important;
    }
    
    /* Specific fix for when both hover-all and forced-show are active */
    .diplo-ribbon .diplo-ribbon-outer.hover-all.forced-show .diplo-ribbon__yields > *:nth-child(6) {
        border-top: 0.0555555556rem solid #8C7F66 !important;
        margin-top: 0.5rem !important;
        padding-top: 0.5rem !important;
    }
`;
