/**
 * @file extended-yields.js
 * @description Styles for extended yields display options
 */

// Style templates for when extended yields should always be shown
export const ALWAYS_SHOW_EXTENDED_YIELDS_STYLES = `
    /* Always show extended yields */
    .diplo-ribbon .diplo-ribbon__yields > *:nth-child(6),
    .diplo-ribbon .diplo-ribbon__yields > *:nth-child(7),
    .diplo-ribbon .diplo-ribbon__yields > *:nth-child(8),
    .diplo-ribbon .diplo-ribbon__yields > *:nth-child(9),
    .diplo-ribbon .diplo-ribbon__yields > *:nth-child(10),
    .diplo-ribbon .diplo-ribbon__yields > *:nth-child(11) {
        display: flex !important;
        opacity: 1 !important;
        max-height: 2rem !important;
        pointer-events: auto !important;
        visibility: visible !important;
        overflow: visible !important;
        transform: translateY(0) !important;
    }
    
    /* Add separator after the 5th yield element */
    .diplo-ribbon .diplo-ribbon__yields > *:nth-child(6) {
        border-top: 0.0555555556rem solid #8C7F66 !important;
        margin-top: 0.5rem !important;
        padding-top: 0.5rem !important;
    }
    
    /* Make background taller to accommodate extra items */
    .diplo-ribbon .diplo-ribbon__bg,
    .diplo-ribbon .diplo-background {
        height: auto !important;
        min-height: 12rem !important;
    }
`;

// Style templates for when extended yields should be shown on hover
export const SHOW_EXTENDED_YIELDS_ON_HOVER_STYLES = `
    /* Hide extended yields by default */
    .diplo-ribbon .diplo-ribbon__yields > *:nth-child(6),
    .diplo-ribbon .diplo-ribbon__yields > *:nth-child(7),
    .diplo-ribbon .diplo-ribbon__yields > *:nth-child(8),
    .diplo-ribbon .diplo-ribbon__yields > *:nth-child(9),
    .diplo-ribbon .diplo-ribbon__yields > *:nth-child(10),
    .diplo-ribbon .diplo-ribbon__yields > *:nth-child(11) {
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
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(6),
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(7),
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(8),
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(9),
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(10),
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(11) {
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
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(6) {
        transition-delay: 0s !important;
    }

    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(7) {
        transition-delay: 0s !important;
    }
    
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(8) {
        transition-delay: 0.05s !important;
    }
    
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(9) {
        transition-delay: 0.1s !important;
    }

    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(10) {
        transition-delay: 0.15s !important;
    }

    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(11) {
        transition-delay: 0.2s !important;
    }

    /* Add separator on hover after the 5th yield element */
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__yields > *:nth-child(6) {
        border-top: 0.0555555556rem solid #8C7F66 !important;
        margin-top: 0.5rem !important;
        padding-top: 0.5rem !important;
    }
`;
