/**
 * @file leader-expressions.js
 * @description Extension for dynamic leader expressions
 */

import DiploRibbonData from '/base-standard/ui/diplo-ribbon/model-diplo-ribbon.js';
import { enhancedDiploBannersSettings } from 'fs://game/enhanced-diplomacy-banners/ui/settings/settings.js';

// Store the original method
const originalCreatePlayerData = DiploRibbonData.createPlayerData;

// Extend the createPlayerData method
DiploRibbonData.createPlayerData = function(player, playerDiplomacy, isKnownPlayer, relationshipData) {
    // Call the original method first
    const dataObj = originalCreatePlayerData.call(this, player, playerDiplomacy, isKnownPlayer, relationshipData);
    const disableExpressions = enhancedDiploBannersSettings && enhancedDiploBannersSettings.DisableLeaderExpressions === true;

    if (disableExpressions) {
        dataObj.portraitContext = "LEADER_HAPPY";
    }

    return dataObj;
};

engine.whenReady.then(() => {
    DiploRibbonData.queueUpdate();
});
