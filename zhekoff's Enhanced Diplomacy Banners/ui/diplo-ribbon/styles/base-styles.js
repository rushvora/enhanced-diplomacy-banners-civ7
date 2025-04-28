/**
 * @file base-styles.js
 * @description Core styles for the Enhanced Diplomacy Banners mod
 */

// Main styles for the diplomatic ribbon
export const MAIN_STYLES = `
    /* Team banners (multiplayer) */
    .diplo-ribbon .diplo-ribbon__team-overlay {
        background-image: url("fs://game/mp_hud_banner_teamcolor.png");
        background-size: 100% 100%;
        margin-top: -7rem;
        width: 3.1666666667rem;
        height: 7.3333333333rem;
        z-index: 5 !important;
        transform: scale(0.9) !important;
    }
    
    .diplo-ribbon .diplo-ribbon__team-text {
        margin-top: -2.7rem !important;
        z-index: 10 !important;  /* Higher z-index than the overlay */
        font-weight: bold !important;
        font-size: 0.9rem !important;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.7) !important;
        color: white !important;
    }

    /* Scope all styles to the diplomatic ribbon component */
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

    /* Position envoy count on the portrait as well */
    .diplo-ribbon .diplo-ribbon__sanction-envoy-count {
        z-index: 50 !important;
        border: 0.1111111111rem solid #b6afa2;
        border-radius: 50% !important;
        bottom: 2.4rem !important;
        left: 1.4rem;
        width: 1.25rem !important;
        height: 1.25rem !important;
        justify-content: center !important;
        align-items: center !important;
        box-shadow: 0 0 0.2rem rgba(0,0,0,0.5) !important;
        margin: 0 !important; /* Reset margins */
        padding: 0 !important; /* Reset padding */
        transform: none !important; /* Remove any transforms */
        color: #FFFFFF;
        background-color: #616266;
        width: 2.3333333333rem;
    }

    /* Attribute button */
    .diplo-ribbon .diplo-ribbon__attribute-button {
        z-index: 50 !important;
    }
        
    /* Styling the relationship icon */
    .diplo-ribbon .relationship-icon {
        transform: scale(0.8);
        margin-top: -0.9rem;
        margin-right: 2.6rem;
        z-index: 20;
        filter: 
            drop-shadow(0.1111111111rem 0 0 #b6afa2) 
            drop-shadow(0 0.1111111111rem 0 #b6afa2) 
            drop-shadow(-0.1111111111rem 0 0 #b6afa2) 
            drop-shadow(0 -0.1111111111rem 0 #b6afa2)
    }

    /* War support styling with circle design */
    .diplo-ribbon .diplo-ribbon__war-support-count {
        position: absolute !important;
        justify-content: center !important;
        align-items: center !important;
        width: 1.35rem !important;
        height: 1.35rem !important;
        border-radius: 50% !important; /* Make it circular */
        color: #FFFFFF !important;
        background-color: #616266 !important; /* Neutral gray by default */
        border: 0.1111111111rem solid #b6afa2;
        font-weight: bold !important;
        font-size: 0.7rem !important;
        right: 1.4rem !important; /* Position on right side */
        top: 2.75rem !important;
        z-index: 20 !important;
        box-shadow: 0 0 0.2rem rgba(0,0,0,0.5) !important;
        margin: 0 !important; /* Reset margins */
        padding: 0 !important; /* Reset padding */
        transform: none !important; /* Remove any transforms */
        font-weight: bold !important;
    }

    /* Positive war support (green circle) */
    .diplo-ribbon .diplo-ribbon__war-support-count.positive {
        background-color: #579544 !important;
        box-shadow: 0 0 0.2rem rgba(87, 149, 68, 0.5) !important;
    }

    /* Negative war support (red circle) */
    .diplo-ribbon .diplo-ribbon__war-support-count.negative {
        background-color:rgb(180, 54, 83) !important;
        box-shadow: 0 0 0.2rem rgba(148, 67, 86, 0.5) !important;
    }

    /* Hide original hexagon elements ONLY in diplo ribbon */
    .diplo-ribbon .diplo-ribbon__portrait-hex-bg,
    .diplo-ribbon .diplo-ribbon__portrait-hex-bg-frame,
    .diplo-ribbon .diplo-ribbon__portrait-hex-bg-shadow {
        display: none !important;
    }
    
    /* Create circular portrait container */
    .diplo-ribbon .circular-portrait-container {
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
    .diplo-ribbon .circular-portrait-bg {
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
    .diplo-ribbon .diplo-ribbon__portrait:hover .circular-portrait-bg {
        border-color:#c7ae80;
    }
    
    /* Ensure portrait stays on top */
    .diplo-ribbon .diplo-ribbon__portrait-image {
        z-index: 3;
        position: relative;
    }
    
    /* Portrait styling - ONLY for diplo ribbon */
    .diplo-ribbon .diplo-ribbon__portrait {
        --diplo-ribbon-scale: 0.9;
        z-index: 3;
    }

    .diplo-ribbon .diplo-ribbon__portrait:hover {
        --diplo-ribbon-scale: 1;
    }

    /* Always show yields */
    .diplo-ribbon .diplo-ribbon-outer.show-on-hover .diplo-ribbon__yields,
    .diplo-ribbon .diplo-ribbon-outer.show-on-hover .diplo-ribbon__bottom-spacer,
    .diplo-ribbon .diplo-ribbon-outer.show-on-hover .diplo-ribbon__bg-container {
        display: flex !important;
    }

    /* Hide unnecessary elements */
    .diplo-ribbon .diplo-ribbon__front-banner,
    .diplo-ribbon .diplo-ribbon__front-banner-shadow,
    .diplo-ribbon .diplo-ribbon__front-banner-overlay {
        display: none !important;
    }

    /* Aggressive bottom spacer removal - only in diplo ribbon */
    .diplo-ribbon .diplo-ribbon__bottom-spacer,
    .diplo-ribbon div[class*="bottom-spacer"] {
        display: none !important;
        height: 0 !important;
        max-height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
    }

    /* Background styling - Default style will be applied in panel-diplo-ribbon-extension.js */
    .diplo-ribbon .diplo-ribbon__bg,
    .diplo-ribbon .diplo-background {
        border: 0.1111111111rem solid #8C7F66;
        box-shadow: 0 0 1.3888888889rem rgba(26, 24, 24, 0.9);
        border-radius: 0.75rem;
        transition: height 0.3s ease-in-out;
        overflow: hidden;
    }

    /* Yield item styling */
    .diplo-ribbon .yield-item {
        font-size: 0.8rem !important;
        font-weight: bold;
    }

    /* Space between banners */
    .diplo-ribbon .diplo-ribbon-outer {
        margin: 0.1111111111rem;
    }

    /* Remove separator by default */
    .diplo-ribbon .diplo-ribbon__yields > *:nth-child(5) {
        border-top: 0 !important;
        margin-top: 0 !important;
        padding-top: 0 !important;
        transition: all 0.3s ease-in-out !important;
    }

    .diplo-ribbon .diplo-ribbon__yields > * {
        margin: 0 !important;
        padding: 0 !important;
    }
`;
