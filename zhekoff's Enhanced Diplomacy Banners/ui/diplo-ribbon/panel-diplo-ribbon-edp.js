const style = document.createElement('style');
style.textContent = `
/* Always show ribbons */
.diplo-ribbon-outer.show-on-hover .diplo-ribbon__yields,
.diplo-ribbon-outer.show-on-hover .diplo-ribbon__bottom-spacer,
.diplo-ribbon-outer.show-on-hover .diplo-ribbon__bg-container {
    display: flex !important;
}

/* Hide only the banners under the portraits */
.diplo-ribbon__front-banner,
.diplo-ribbon__front-banner-shadow,
.diplo-ribbon__front-banner-overlay {
    display: none !important;
}

.diplo-ribbon__portrait:hover{
    --diplo-ribbon-scale: 1 !important;
}

/* Hide the symbol from the banners */
.diplo-ribbon__symbol {
    display: none !important;
}

/* Adjust the yields to move up where the banner was */
.diplo-ribbon__yields {
    margin-top: -1.5rem !important;
}

.diplo-ribbon__bottom-spacer {
    display: none !important;
}

/* Convert 2px to 0.1111111111rem for consistency */
.diplo-ribbon-outer {
    margin: 0.1111111111rem;
}

.diplo-background {
    background-color: rgba(26, 24, 24, 0.9);
    border: 0.1111111111rem solid #8C7F66;
    box-shadow: 0 0 1.3888888889rem rgba(26, 24, 24, 0.9);
    border-radius: 0.75rem;
}

/* Reduce padding on yield items */
.yield-item {
    font-size: 0.8rem !important;
    font-weight: bold;
}

.yield-value {
    margin-left: 0.3rem;
}

.player-at-war {
    background-color: rgba(73, 4, 4, 0.78);
}
    
.relationship-icon {
    margin-top: 11.4rem;
}

.diplo-ribbon__war-support-count {
    margin-top: 0.5rem !important;
    border-radius: 0.75rem;
    box-shadow: 0 0 1.3888888889rem rgba(26, 24, 24, 0.9);
}

/* Divider between yields */
.diplo-ribbon__yields > :nth-child(6) {
    border-top: 0.0555555556rem solid #8C7F66;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
}
`;
document.head.appendChild(style);
