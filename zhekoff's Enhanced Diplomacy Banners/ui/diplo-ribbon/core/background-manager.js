// background-manager.js
export class BackgroundManager {
    constructor() {}
    
    /**
     * Modify ribbon background based on player state
     * @param {HTMLElement} diploRibbon - Diplomatic ribbon element
     * @param {number} index - Index of the ribbon
     * @param {Array} targetArray - Player data array
     */
    modifyRibbonBackground(diploRibbon, index, targetArray) {
        const bgElements = diploRibbon.querySelectorAll('.diplo-ribbon__bg');
        if (!bgElements?.length || !targetArray?.[index]) return;
        
        const player = targetArray[index];
        
        bgElements.forEach(bgElement => {
            // Replace class and toggle war state
            bgElement.classList.remove('diplo-ribbon__bg');
            bgElement.classList.add('diplo-background');
            bgElement.classList.toggle("player-at-war", player.isAtWar);
        });
    }
}
