import { Options, OptionType } from '/core/ui/options/model-options.js';
import { CategoryData, CategoryType } from '/core/ui/options/options-helpers.js';
import { enhancedDiploBannersSettings } from 'fs://game/enhanced-diplomacy-banners/ui/settings/settings.js';
import { UpdateDiploRibbonEvent } from '/base-standard/ui/diplo-ribbon/model-diplo-ribbon.js';

// We add a dependency on the Options module to ensure default options are loaded before we add our own
import '/core/ui/options/options.js';

CategoryType["Mods"] = "mods";
CategoryData[CategoryType.Mods] = {
    title: "LOC_UI_CONTENT_MGR_SUBTITLE",
    description: "LOC_UI_CONTENT_MGR_SUBTITLE_DESCRIPTION",
};

// Register options with the game's options system
Options.addInitCallback(() => {
    // Icon Style selector initialization
    const onRelationshipIconStyleInit = (optionInfo) => {
        const currentSelection = enhancedDiploBannersSettings.StyleSetting;
        if (!currentSelection) {
            optionInfo.selectedItemIndex = 0;
        } else {
            optionInfo.selectedItemIndex = (currentSelection - 1);
        }
    };

    // Icon Style update handler
    const onRelationshipIconStyleUpdate = (optionInfo, value) => {
        const selectedOption = (optionInfo.dropdownItems?.[value]).setting;
        enhancedDiploBannersSettings.StyleSetting = selectedOption;
        window.dispatchEvent(new UpdateDiploRibbonEvent());
    };

    // Available icon style options
    const iconStyleOptions = [
        { setting: 1, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ICON_STYLE_CLASSIC" },
        { setting: 2, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ICON_STYLE_EMOJI" },
        { setting: 3, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ICON_STYLE_EU" },
    ];

    Options.addOption({ 
        category: CategoryType.Mods,
        group: 'ZHEKOFF_ENHANCED_DIPLO_BANNERS',
        type: OptionType.Dropdown,
        id: "zhekoff-diplo-icon-style",
        initListener: onRelationshipIconStyleInit,
        updateListener: onRelationshipIconStyleUpdate,
        label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ICON_STYLE_NAME",
        description: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ICON_STYLE_DESCRIPTION",
        dropdownItems: iconStyleOptions
    });
    
    // Background Style selector initialization
    const onBackgroundStyleInit = (optionInfo) => {
        const currentSelection = enhancedDiploBannersSettings.BackgroundStyle;
        if (!currentSelection) {
            optionInfo.selectedItemIndex = 0;
        } else {
            optionInfo.selectedItemIndex = (currentSelection - 1);
        }
    };

    // Background Style update handler
    const onBackgroundStyleUpdate = (optionInfo, value) => {
        const selectedOption = (optionInfo.dropdownItems?.[value]).setting;
        enhancedDiploBannersSettings.BackgroundStyle = selectedOption;
        window.dispatchEvent(new UpdateDiploRibbonEvent());
    };

    // Available background style options
    const backgroundStyleOptions = [
        { setting: 1, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_BACKGROUND_STYLE_DEFAULT" },
        { setting: 2, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_BACKGROUND_STYLE_ORIGINAL" },
        { setting: 3, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_BACKGROUND_STYLE_GOLDEN_HOUR" },
        { setting: 4, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_BACKGROUND_STYLE_FOREST_DEPTHS" },
        { setting: 5, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_BACKGROUND_STYLE_ROYAL_TWILIGHT" }
    ];

    Options.addOption({ 
        category: CategoryType.Mods,
        group: 'ZHEKOFF_ENHANCED_DIPLO_BANNERS',
        type: OptionType.Dropdown,
        id: "zhekoff-diplo-background-style",
        initListener: onBackgroundStyleInit,
        updateListener: onBackgroundStyleUpdate,
        label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_BACKGROUND_STYLE_NAME",
        description: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_BACKGROUND_STYLE_DESCRIPTION",
        dropdownItems: backgroundStyleOptions
    });

    // Compact Mode dropdown initialization
    const onCompactModeInit = (optionInfo) => {
        const currentSelection = enhancedDiploBannersSettings.CompactMode;
        optionInfo.selectedItemIndex = currentSelection;
    };

    // Compact Mode dropdown update handler
    const onCompactModeUpdate = (optionInfo, value) => {
        const selectedOption = (optionInfo.dropdownItems?.[value]).setting;
        enhancedDiploBannersSettings.CompactMode = selectedOption;
        window.dispatchEvent(new UpdateDiploRibbonEvent());
    };

    // Available compact mode options
    const compactModeOptions = [
        { setting: 0, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_COMPACT_MODE_NORMAL" },
        { setting: 1, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_COMPACT_MODE_COMPACT" },
        { setting: 2, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_COMPACT_MODE_ULTRA_COMPACT" }
    ];

    Options.addOption({ 
        category: CategoryType.Mods,
        group: 'ZHEKOFF_ENHANCED_DIPLO_BANNERS',
        type: OptionType.Dropdown,
        id: "zhekoff-diplo-compact-mode",
        initListener: onCompactModeInit,
        updateListener: onCompactModeUpdate,
        label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_COMPACT_MODE_NAME",
        description: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_COMPACT_MODE_DESCRIPTION",
        dropdownItems: compactModeOptions
    });

    // Show All Yields on Local Player Hover checkbox initialization
    const onShowAllYieldsOnLocalHoverInit = (optionInfo) => {
        optionInfo.currentValue = enhancedDiploBannersSettings.ShowAllYieldsOnLocalHover;
    };

    // Show All Yields on Local Player Hover checkbox update handler
    const onShowAllYieldsOnLocalHoverUpdate = (optionInfo, value) => {
        enhancedDiploBannersSettings.ShowAllYieldsOnLocalHover = value;
        window.dispatchEvent(new UpdateDiploRibbonEvent());
    };

    Options.addOption({ 
        category: CategoryType.Mods,
        group: 'ZHEKOFF_ENHANCED_DIPLO_BANNERS',
        type: OptionType.Checkbox,
        id: "zhekoff-diplo-show-all-yields-on-local-hover",
        initListener: onShowAllYieldsOnLocalHoverInit,
        updateListener: onShowAllYieldsOnLocalHoverUpdate,
        label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_SHOW_ALL_YIELDS_ON_LOCAL_HOVER_NAME",
        description: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_SHOW_ALL_YIELDS_ON_LOCAL_HOVER_DESCRIPTION"
    });

    // Show Civilization Symbol checkbox initialization
    const onShowCivSymbolInit = (optionInfo) => {
        optionInfo.currentValue = enhancedDiploBannersSettings.ShowCivSymbol;
    };

    // Show Civilization Symbol checkbox update handler
    const onShowCivSymbolUpdate = (optionInfo, value) => {
        enhancedDiploBannersSettings.ShowCivSymbol = value;
        window.dispatchEvent(new UpdateDiploRibbonEvent());
    };

    Options.addOption({ 
        category: CategoryType.Mods,
        group: 'ZHEKOFF_ENHANCED_DIPLO_BANNERS',
        type: OptionType.Checkbox,
        id: "zhekoff-diplo-show-civ-symbol",
        initListener: onShowCivSymbolInit,
        updateListener: onShowCivSymbolUpdate,
        label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_SHOW_CIV_SYMBOL_NAME",
        description: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_SHOW_CIV_SYMBOL_DESCRIPTION"
    });
    
    // Always Show Extended Yields checkbox initialization
    const onAlwaysShowExtendedYieldsInit = (optionInfo) => {
        optionInfo.currentValue = enhancedDiploBannersSettings.AlwaysShowExtendedYields;
    };

    // Always Show Extended Yields checkbox update handler
    const onAlwaysShowExtendedYieldsUpdate = (optionInfo, value) => {
        enhancedDiploBannersSettings.AlwaysShowExtendedYields = value;
        window.dispatchEvent(new UpdateDiploRibbonEvent());
    };

    Options.addOption({ 
        category: CategoryType.Mods,
        group: 'ZHEKOFF_ENHANCED_DIPLO_BANNERS',
        type: OptionType.Checkbox,
        id: "zhekoff-diplo-always-show-extended-yields",
        initListener: onAlwaysShowExtendedYieldsInit,
        updateListener: onAlwaysShowExtendedYieldsUpdate,
        label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ALWAYS_SHOW_EXTENDED_YIELDS_NAME",
        description: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ALWAYS_SHOW_EXTENDED_YIELDS_DESCRIPTION"
    });

    // Disable Leaders Expressions checkbox initialization
    const onDisableLeadersExpressionsInit = (optionInfo) => {
        optionInfo.currentValue = enhancedDiploBannersSettings.DisableLeaderExpressions;
    };

    // Disable Leaders Expressions checkbox update handler
    const onDisableLeadersExpressionsUpdate = (optionInfo, value) => {
        enhancedDiploBannersSettings.DisableLeaderExpressions = value;
        window.dispatchEvent(new UpdateDiploRibbonEvent());
    };

    Options.addOption({ 
        category: CategoryType.Mods,
        group: 'ZHEKOFF_ENHANCED_DIPLO_BANNERS',
        type: OptionType.Checkbox,
        id: "zhekoff-diplo-disable-leaders-expressions",
        initListener: onDisableLeadersExpressionsInit,
        updateListener: onDisableLeadersExpressionsUpdate,
        label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_DISABLE_LEADER_EXPRESSIONS_NAME",
        description: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_DISABLE_LEADER_EXPRESSIONS_DESCRIPTION"
    });

    // Hide Banners checkbox initialization
    const onHideBannersInit = (optionInfo) => {
        optionInfo.currentValue = enhancedDiploBannersSettings.HideBanners;
    };

    // Hide Banners checkbox update handler
    const onHideBannersUpdate = (optionInfo, value) => {
        enhancedDiploBannersSettings.HideBanners = value;
        window.dispatchEvent(new UpdateDiploRibbonEvent());
    };

    Options.addOption({ 
        category: CategoryType.Mods,
        group: 'ZHEKOFF_ENHANCED_DIPLO_BANNERS',
        type: OptionType.Checkbox,
        id: "zhekoff-diplo-hide-banners",
        initListener: onHideBannersInit,
        updateListener: onHideBannersUpdate,
        label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_HIDE_BANNERS_NAME",
        description: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_HIDE_BANNERS_DESCRIPTION"
    });
});
