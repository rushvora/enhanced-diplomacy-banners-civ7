/**
 * @file banner-visibility.js
 * @description Styles for controlling banner visibility
 */

// Style for showing banners
export const SHOW_BANNERS_STYLES = `
    /* Always show banner background and yields */
    .diplo-ribbon .diplo-ribbon__bg-container,
    .diplo-ribbon .diplo-background,
    .diplo-ribbon .diplo-ribbon__yields {
        display: flex !important;
        opacity: 1 !important;
        visibility: visible !important;
    }

    /* Regular portrait spacing */
    .diplo-ribbon .diplo-ribbon-outer {
        width: auto !important;
        padding: 0 !important;
    }
`;

// Style for hiding banners by default
export const HIDE_BANNERS_STYLES = `
    /* Hide banner background and yields by default */
    .diplo-ribbon .diplo-ribbon__bg-container,
    .diplo-ribbon .diplo-background,
    .diplo-ribbon .diplo-ribbon__yields {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out !important;
    }

    /* Make the symbol visible and larger on the front banner */
    .diplo-ribbon .diplo-ribbon__symbol {
        display: block !important;
        transform: scale(1.1) !important;
        margin-top: 2.8rem;
        z-index: 10 !important;
    }

    /* Show and style the front banner elements */
    .diplo-ribbon .diplo-ribbon__front-banner,
    .diplo-ribbon .diplo-ribbon__front-banner-shadow,
    .diplo-ribbon .diplo-ribbon__front-banner-overlay {
        display: block !important;
    }

    /* Show background and yields, and hide banners on hover */
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__bg-container,
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-background,
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__yields {
        display: flex !important;
        opacity: 1 !important;
        visibility: visible !important;
    }

    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__front-banner,
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__front-banner-shadow,
    .diplo-ribbon .diplo-ribbon-outer:hover .diplo-ribbon__front-banner-overlay {
        display: none !important;
    }
`;
