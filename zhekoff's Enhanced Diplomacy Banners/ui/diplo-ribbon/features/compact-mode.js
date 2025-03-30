/**
 * @file ui/diplo-ribbon/compact-mode.js
 * @description Provides scaling options for the Enhanced Diplomacy Banners mod
 */

// Scale factors for different UI elements
export const SCALE_FACTORS = {
    NORMAL: 1.0,
    COMPACT: 0.92,
    ULTRA_COMPACT: 0.88
};

// Main scaling styles for different scaling options
export const COMPACT_MODE_STYLES = {
    // Normal size - no scaling
    NORMAL: `
        /* No transformation applied */
    `,
    
    // Compact mode - 92% size
    COMPACT: `
        /* Scale down the entire ribbon (each banner) - 92% size */
        .diplo-ribbon .diplo-ribbon-outer {
            transform: scale(0.92);
            transform-origin: top center;
            margin: 0 -0.1rem !important;
        }

        /* Adjust yield items font size - slightly reduced */
        .diplo-ribbon .yield-item {
            font-size: 0.78rem !important;
        }

        /* Adjust portrait size */
        .diplo-ribbon .diplo-ribbon__portrait {
            --diplo-ribbon-scale: 0.92;
        }

        .diplo-ribbon .diplo-ribbon__portrait:hover {
            --diplo-ribbon-scale: 0.98;
        }

        /* Adjust relationship icon */
        .diplo-ribbon .relationship-icon {
            transform: scale(0.75);
            margin-top: -0.85rem;
        }

        /* Adjust circular portrait background */
        .diplo-ribbon .circular-portrait-bg {
            width: 70%;
            height: 70%;
        }
        
        /* When civ symbol is hidden, remove top margin space */
        .diplo-ribbon .diplo-ribbon__symbol.hidden + .diplo-ribbon__yields,
        .diplo-ribbon .diplo-ribbon__symbol[style*="display: none"] + .diplo-ribbon__yields {
            margin-top: -1.7rem !important;
        }
    `,
    
    // Ultra compact mode - 88% size
    ULTRA_COMPACT: `
        /* Scale down the entire ribbon (each banner) */
        .diplo-ribbon .diplo-ribbon-outer {
            transform: scale(0.88);
            transform-origin: top center;
            margin: 0 -0.25rem !important;
        }
        
        /* Adjust yield items font size */
        .diplo-ribbon .yield-item {
            font-size: 0.73rem !important;
        }
        
        /* Adjust portrait size */
        .diplo-ribbon .diplo-ribbon__portrait {
            --diplo-ribbon-scale: 0.88;
        }
        
        .diplo-ribbon .diplo-ribbon__portrait:hover {
            --diplo-ribbon-scale: 0.96;
        }
        
        /* Adjust relationship icon */
        .diplo-ribbon .relationship-icon {
            transform: scale(0.65);
            margin-top: -0.8rem;
        }
        
        /* Adjust circular portrait background */
        .diplo-ribbon .circular-portrait-bg {
            width: 68%;
            height: 68%;
        }
        
        /* When civ symbol is hidden, remove top margin space */
        .diplo-ribbon .diplo-ribbon__symbol.hidden + .diplo-ribbon__yields,
        .diplo-ribbon .diplo-ribbon__symbol[style*="display: none"] + .diplo-ribbon__yields {
            margin-top: -1.7rem !important;
        }
    `
};
