/**
 * @file first-meet-fix.js
 * @description Simple fix that works with extra-yields.js to ensure yield statistics 
 * remain visible during first meet events without adding additional yields
 */

import DiploRibbonData, { RibbonDisplayType } from '/base-standard/ui/diplo-ribbon/model-diplo-ribbon.js';

const originalShouldShowYieldType = DiploRibbonData.shouldShowYieldType;

// Force shouldShowYieldType to always return true 
// This is critical for first meet events
DiploRibbonData.shouldShowYieldType = function(displayType) {
    // Only force true for Yields display type
    if (displayType === RibbonDisplayType.Yields) {
        return true;
    }
    
    // Call original for other types
    return originalShouldShowYieldType.call(this, displayType);
};
