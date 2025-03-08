/**
 * @file relationship-icons.js
 * @description Replaces default relationship icons with custom icons based on selected style
 */

import { Zhekoff_RelationshipIcons } from '../settings/settings.js';

// Icon paths organized by style
const RELATIONSHIP_ICON_SETS = {
    // Style 1: Classic
    1: {
        "PLAYER_RELATIONSHIP_ALLIANCE": "fs://game/enhanced-diplomacy-banners/icons/classic/alliance.png",
        "PLAYER_RELATIONSHIP_FRIENDLY": "fs://game/enhanced-diplomacy-banners/icons/classic/friendly.png",
        "PLAYER_RELATIONSHIP_HELPFUL": "fs://game/enhanced-diplomacy-banners/icons/classic/helpful.png",
        "PLAYER_RELATIONSHIP_HOSTILE": "fs://game/enhanced-diplomacy-banners/icons/classic/hostile.png",
        "PLAYER_RELATIONSHIP_NEUTRAL": "fs://game/enhanced-diplomacy-banners/icons/classic/neutral.png",
        "PLAYER_RELATIONSHIP_UNFRIENDLY": "fs://game/enhanced-diplomacy-banners/icons/classic/unfriendly.png",
        "PLAYER_RELATIONSHIP_AT_WAR": "fs://game/enhanced-diplomacy-banners/icons/classic/war.png"
    },
    // Style 2: Emoji
    2: {
        "PLAYER_RELATIONSHIP_ALLIANCE": "fs://game/enhanced-diplomacy-banners/icons/emoji/alliance.png",
        "PLAYER_RELATIONSHIP_FRIENDLY": "fs://game/enhanced-diplomacy-banners/icons/emoji/friendly.png",
        "PLAYER_RELATIONSHIP_HELPFUL": "fs://game/enhanced-diplomacy-banners/icons/emoji/helpful.png",
        "PLAYER_RELATIONSHIP_HOSTILE": "fs://game/enhanced-diplomacy-banners/icons/emoji/hostile.png",
        "PLAYER_RELATIONSHIP_NEUTRAL": "fs://game/enhanced-diplomacy-banners/icons/emoji/neutral.png",
        "PLAYER_RELATIONSHIP_UNFRIENDLY": "fs://game/enhanced-diplomacy-banners/icons/emoji/unfriendly.png",
        "PLAYER_RELATIONSHIP_AT_WAR": "fs://game/enhanced-diplomacy-banners/icons/emoji/war.png"
    }
};

class RelationshipIconReplacer {
    constructor() {
        this.originalGetIcon = UI.getIcon;
        this.setupIconReplacement();
        
        // Listen for settings changes
        this.settingsChangedListener = this.onSettingsChanged.bind(this);
        window.addEventListener('update-diplo-ribbon', this.settingsChangedListener);
    }

    setupIconReplacement() {
        // Use an arrow function to preserve the correct 'this' context
        UI.getIcon = (iconName, context) => {
            // Only handle relationship icons
            if (context === "PLAYER_RELATIONSHIP") {
                try {
                    // Get current icon style from settings
                    const iconStyle = Zhekoff_RelationshipIcons.StyleSetting;
                    
                    // Get the appropriate icon set based on style
                    const iconSet = RELATIONSHIP_ICON_SETS[iconStyle];
                    
                    // Return the custom icon if available
                    if (iconSet && iconSet[iconName]) {
                        return iconSet[iconName];
                    }
                } catch (error) {
                    console.error("Error loading custom relationship icons:", error);
                }
            }
            
            // Use .call to ensure the original method is called with its original context
            return this.originalGetIcon.call(UI, iconName, context);
        };

        console.log("UI.getIcon successfully patched for relationship icons");
    }

    /**
     * Handle settings changes
     */
    onSettingsChanged() {
        // We don't need to do anything here, as the getIcon method
        // already checks the settings on each call
        console.log("Relationship icons updated due to settings change");
    }

    /**
     * Restore the original getIcon method if needed
     */
    cleanUp() {
        if (this.originalGetIcon) {
            UI.getIcon = this.originalGetIcon;
        }
        
        // Clean up event listener
        window.removeEventListener('update-diplo-ribbon', this.settingsChangedListener);
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
