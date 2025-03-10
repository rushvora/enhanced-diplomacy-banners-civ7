import { Options, OptionType } from '/core/ui/options/model-options.js';
import { CategoryType } from '/core/ui/options/options-helpers.js';
import { enhancedDiploBannersSettings } from 'fs://game/enhanced-diplomacy-banners/ui/settings/settings.js';
import DiploRibbonData, { UpdateDiploRibbonEvent } from '/base-standard/ui/diplo-ribbon/model-diplo-ribbon.js';

// We add a dependency on the Options module to ensure default options are loaded before we add our own
import '/core/ui/options/options.js';

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
    { setting: 2, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ICON_STYLE_EMOJI" }
];

// Show Civilization Symbol toggle initialization
const onShowCivSymbolInit = (optionInfo) => {
    const currentSetting = enhancedDiploBannersSettings.ShowCivSymbol;
    optionInfo.selectedItemIndex = currentSetting ? 0 : 1; // 0 for Yes, 1 for No
};

// Show Civilization Symbol update handler
const onShowCivSymbolUpdate = (optionInfo, value) => {
    const selectedOption = (optionInfo.dropdownItems?.[value]).setting;
    enhancedDiploBannersSettings.ShowCivSymbol = selectedOption;
    window.dispatchEvent(new UpdateDiploRibbonEvent());
};

// Available show civ symbol options
const showCivSymbolOptions = [
    { setting: true, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_SHOW_CIV_SYMBOL_YES" },
    { setting: false, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_SHOW_CIV_SYMBOL_NO" }
];

// Always Show Extended Yields toggle initialization
const onAlwaysShowExtendedYieldsInit = (optionInfo) => {
    const currentSetting = enhancedDiploBannersSettings.AlwaysShowExtendedYields;
    optionInfo.selectedItemIndex = currentSetting ? 0 : 1; // 0 for Yes, 1 for No
};

// Always Show Extended Yields update handler
const onAlwaysShowExtendedYieldsUpdate = (optionInfo, value) => {
    const selectedOption = (optionInfo.dropdownItems?.[value]).setting;
    enhancedDiploBannersSettings.AlwaysShowExtendedYields = selectedOption;
    window.dispatchEvent(new UpdateDiploRibbonEvent());
};

// Available always show extended yields options
const alwaysShowExtendedYieldsOptions = [
    { setting: true, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ALWAYS_SHOW_EXTENDED_YIELDS_YES" },
    { setting: false, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ALWAYS_SHOW_EXTENDED_YIELDS_NO" }
];

// Register options with the game's options system
Options.addInitCallback(() => {
    Options.addOption({ 
        category: CategoryType.System,
        group: 'ZHEKOFF_ENHANCED_DIPLO_BANNERS',
        type: OptionType.Dropdown,
        id: "zhekoff-diplo-icon-style",
        initListener: onRelationshipIconStyleInit,
        updateListener: onRelationshipIconStyleUpdate,
        label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ICON_STYLE_NAME",
        description: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ICON_STYLE_DESCRIPTION",
        dropdownItems: iconStyleOptions
    });
    
    Options.addOption({ 
        category: CategoryType.System,
        group: 'ZHEKOFF_ENHANCED_DIPLO_BANNERS',
        type: OptionType.Dropdown,
        id: "zhekoff-diplo-show-civ-symbol",
        initListener: onShowCivSymbolInit,
        updateListener: onShowCivSymbolUpdate,
        label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_SHOW_CIV_SYMBOL_NAME",
        description: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_SHOW_CIV_SYMBOL_DESCRIPTION",
        dropdownItems: showCivSymbolOptions
    });
    
    Options.addOption({ 
        category: CategoryType.System,
        group: 'ZHEKOFF_ENHANCED_DIPLO_BANNERS',
        type: OptionType.Dropdown,
        id: "zhekoff-diplo-always-show-extended-yields",
        initListener: onAlwaysShowExtendedYieldsInit,
        updateListener: onAlwaysShowExtendedYieldsUpdate,
        label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ALWAYS_SHOW_EXTENDED_YIELDS_NAME",
        description: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ALWAYS_SHOW_EXTENDED_YIELDS_DESCRIPTION",
        dropdownItems: alwaysShowExtendedYieldsOptions
    });
});
