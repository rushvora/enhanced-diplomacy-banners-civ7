/**
 * @file relationship-icon-replacement.js
 * @description Replaces default relationship icons with custom icons in Civilization VII
 */

// Custom relationship icon paths
const CUSTOM_RELATIONSHIP_ICONS = {
    "PLAYER_RELATIONSHIP_ALLIANCE": "fs://game/enhanced-diplomacy-banners/icons/alliance.png",
    "PLAYER_RELATIONSHIP_FRIENDLY": "fs://game/enhanced-diplomacy-banners/icons/friendly.png",
    "PLAYER_RELATIONSHIP_HELPFUL": "fs://game/enhanced-diplomacy-banners/icons/helpful.png",
    "PLAYER_RELATIONSHIP_HOSTILE": "fs://game/enhanced-diplomacy-banners/icons/hostile.png",
    "PLAYER_RELATIONSHIP_NEUTRAL": "fs://game/enhanced-diplomacy-banners/icons/neutral.png",
    "PLAYER_RELATIONSHIP_UNFRIENDLY": "fs://game/enhanced-diplomacy-banners/icons/unfriendly.png",
    "PLAYER_RELATIONSHIP_AT_WAR": "fs://game/enhanced-diplomacy-banners/icons/war.png"
};

class RelationshipIconReplacer {
    constructor() {
        this.originalGetIcon = UI.getIcon;
        this.setupIconReplacement();
    }

    setupIconReplacement() {
        // Use an arrow function to preserve the correct 'this' context
        UI.getIcon = (iconName, context) => {
            // Handle relationship icons
            if (context === "PLAYER_RELATIONSHIP" && CUSTOM_RELATIONSHIP_ICONS[iconName]) {
                return CUSTOM_RELATIONSHIP_ICONS[iconName];
            }
            
            // Use .call to ensure the original method is called with its original context
            return this.originalGetIcon.call(UI, iconName, context);
        };

        console.log("UI.getIcon successfully patched for relationship icons");
    }

    /**
     * Restore the original getIcon method if needed
     */
    restoreOriginalMethod() {
        if (this.originalGetIcon) {
            UI.getIcon = this.originalGetIcon;
        }
    }
}

// Initialize the relationship icon replacer when the engine is ready
engine.whenReady.then(() => {
    try {
        // Store the replacer globally so it can be accessed or cleaned up if needed
        window.relationshipIconReplacer = new RelationshipIconReplacer();
        console.log("Relationship Icon Replacer: Initialized");
    } catch (error) {
        console.error("Relationship Icon Replacer: Initialization failed -", error);
    }
});

// Fallback in case engine is already ready
if (engine.isReady) {
    window.relationshipIconReplacer = new RelationshipIconReplacer();
}

export default RelationshipIconReplacer;
