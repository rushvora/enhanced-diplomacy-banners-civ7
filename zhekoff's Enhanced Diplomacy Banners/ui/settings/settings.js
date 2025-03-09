/**
 * Please, always use ModSettingsManager to save and read settings in your mod.
 * Right now if you try to use **multiple** keys in localStorage, it will break reading
 * from localStorage for **every mod**. This is a workaround to avoid this issue, while
 * keeping a namespace to give each mod its own settings.
 */
const ModSettingsManager = {
    save(key, data) {
        if (localStorage.length > 1) {
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
}

// Relationship Icon Settings
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
        ModSettingsManager.save("Zhekoff_RelationshipIcons", this._data);
    }

    get StyleSetting() {
        return this._data.StyleSetting;
    }

    set StyleSetting(value) {
        this._data.StyleSetting = value;
        this.save();
    }
}
