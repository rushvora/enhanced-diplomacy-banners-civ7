/**
 * @file settings-init.js
 * @description Initializes settings UI components for Enhanced Diplomacy Ribbon
 */

import { Options, OptionType } from '/core/ui/options/model-options.js';
import { CategoryType } from '/core/ui/options/options-helpers.js';
import { Zhekoff_RelationshipIcons } from './settings.js';
import DiploRibbonData, { UpdateDiploRibbonEvent } from '/base-standard/ui/diplo-ribbon/model-diplo-ribbon.js';

// We add a dependency on the Options module to ensure default options are loaded before we add our own
import '/core/ui/options/options.js';

// Icon Style selector initialization
const onRelationshipIconStyleInit = (optionInfo) => {
    const currentSelection = Zhekoff_RelationshipIcons.StyleSetting;
    if (!currentSelection) {
        optionInfo.selectedItemIndex = 0;
    } else {
        optionInfo.selectedItemIndex = (currentSelection - 1);
    }
};

// Icon Style update handler
const onRelationshipIconStyleUpdate = (optionInfo, value) => {
    const selectedOption = (optionInfo.dropdownItems?.[value]).setting;
    Zhekoff_RelationshipIcons.StyleSetting = selectedOption;
    window.dispatchEvent(new UpdateDiploRibbonEvent());
};

// Available icon style options
const iconStyleOptions = [
    { setting: 1, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ICON_STYLE_CLASSIC" },
    { setting: 2, label: "LOC_MOD_ZHEKOFF_DIPLO_RIBBON_ICON_STYLE_EMOJI" }
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
});

// Force an update when settings are initialized
engine.whenReady.then(() => {
    window.dispatchEvent(new UpdateDiploRibbonEvent());
});
