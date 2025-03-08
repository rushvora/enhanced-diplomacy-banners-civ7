/**
 * @file settings.js
 * @description Settings management for Enhanced Diplomacy Ribbon mod
 */

/**
 * ModSettingsManager - Handles persistent storage of mod settings
 * Based on implementation by Leonardfactory & Leugi
 */
const ModSettingsManager = {
    save(key, data) {
        if (localStorage.length > 1) {
            console.warn("[ModSettingsManager] erasing previous storage..", localStorage.length);
            localStorage.clear();
        }  
        const modSettings = JSON.parse(localStorage.getItem("modSettings") || '{}');
        modSettings[key] = data;
        localStorage.setItem("modSettings", JSON.stringify(modSettings));
    },
    read(key) {
        const modSettings = localStorage.getItem("modSettings");
        try {
            if (modSettings) {
                const data = JSON.parse(modSettings || '{}')[key];
                if (data) {
                    return data;
                }
            }
            return null;
        }
        catch (e) {
            console.error(`[ModSettingsManager][${key}] Error loading settings`, e);
        }
        return null;
    }
};

/**
 * Relationship Icon Settings
 * Controls which icon style is used for diplomatic relationships
 */
export const Zhekoff_RelationshipIcons = new class {
    _data = {
        StyleSetting: 1 // Default to Classic style
    };

    constructor() {
        const modSettings = ModSettingsManager.read("Zhekoff_RelationshipIcons");
        if (modSettings) {
            this._data = modSettings;
        }
    }

    save() {
        console.log("[Zhekoff_RelationshipIcons] saving..", JSON.stringify(this._data));
        ModSettingsManager.save("Zhekoff_RelationshipIcons", this._data);
    }

    get StyleSetting() {
        return this._data.StyleSetting;
    }

    set StyleSetting(value) {
        this._data.StyleSetting = value;
        this.save();
    }
};

// Export the settings manager for use in other files
export default {
    Zhekoff_RelationshipIcons
};
