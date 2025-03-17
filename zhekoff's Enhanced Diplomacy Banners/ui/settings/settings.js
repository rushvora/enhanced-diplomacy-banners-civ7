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
export const enhancedDiploBannersSettings = new class {
    _data = {
        StyleSetting: 1, // Default to Classic style
        ShowCivSymbol: true, // Default to showing civilization symbols
        AlwaysShowExtendedYields: false, // Default to hiding extended yields until hover
        BackgroundStyle: 1, // Default to the default dark background
        HideBanners: false, // Default to NOT hidden
        DisableLeaderExpressions: false // New setting, default to showing leader expressions
    };

    constructor() {
        const modSettings = ModSettingsManager.read("enhancedDiploBannersSettings");
        if (modSettings) {
            this._data = modSettings;
        }
    }

    save() {
        ModSettingsManager.save("enhancedDiploBannersSettings", this._data);
    }

    get StyleSetting() {
        return this._data.StyleSetting;
    }

    set StyleSetting(value) {
        this._data.StyleSetting = value;
        this.save();
    }

    get ShowCivSymbol() {
        return this._data.ShowCivSymbol;
    }

    set ShowCivSymbol(value) {
        this._data.ShowCivSymbol = value;
        this.save();
    }

    get AlwaysShowExtendedYields() {
        return this._data.AlwaysShowExtendedYields;
    }

    set AlwaysShowExtendedYields(value) {
        this._data.AlwaysShowExtendedYields = value;
        this.save();
    }
    
    get BackgroundStyle() {
        return this._data.BackgroundStyle;
    }
    
    set BackgroundStyle(value) {
        this._data.BackgroundStyle = value;
        this.save();
    }

    get HideBanners() {
        return this._data.HideBanners;
    }

    set HideBanners(value) {
        this._data.HideBanners = value;
        this.save();
    }

    get DisableLeaderExpressions() {
        return this._data.DisableLeaderExpressions;
    }

    set DisableLeaderExpressions(value) {
        this._data.DisableLeaderExpressions = value;
        this.save();
    }
}
