/**
 * @file extra-yields.js
 * @description Extension for diplomatic ribbon to enhance yield display in Civ 7
 */

import DiploRibbonData, { 
    RibbonYieldType, 
    RibbonDisplayType, 
    RibbonStatsToggleStatus 
} from '/base-standard/ui/diplo-ribbon/model-diplo-ribbon.js';

// Extend RibbonYieldType enum with additional yield types
RibbonYieldType.TotalGold = "totalGold";
RibbonYieldType.TotalDiplomacy = "totalDiplomacy";
RibbonYieldType.TotalPopulation = "totalPopulation";
RibbonYieldType.MilitaryPower = "militaryPower";

engine.whenReady.then(() => {
    try {
        if (DiploRibbonData) {
            // Always show yields
            DiploRibbonData.alwaysShowYields = RibbonStatsToggleStatus.RibbonStatsShowing;
            
            // Override method to always include Yields display type
            DiploRibbonData.getRibbonDisplayTypesFromUserOptions = function() {
                this._ribbonDisplayTypes = [RibbonDisplayType.Yields];
            };
            
            // Enhanced yield data generation
            DiploRibbonData.createPlayerYieldsData = function(playerLibrary, isLocal) {
                // Early exit if yields shouldn't be shown
                if (!this.shouldShowYieldType(RibbonDisplayType.Yields)) {
                    return [];
                }

                // Safely extract yield values with fallback to 0
                const safeGetNetYield = (yieldType) => 
                    playerLibrary.Stats?.getNetYield(yieldType) ?? 0;
                
                // Calculate military power
                let militaryPower = 0;
                try {
                    // Check if Units collection is available
                    if (playerLibrary.Units && typeof playerLibrary.Units.getUnits === 'function') {
                        const units = playerLibrary.Units.getUnits();
                        
                        for (let i = 0; i < units.length; i++) {
                            const unit = units[i];
                            
                            // Skip units that can't attack
                            if (!unit.Combat || !unit.Combat.canAttack) {
                                continue;
                            }
                            
                            // Get the highest strength value (melee or ranged)
                            const meleeStrength = unit.Combat.getMeleeStrength ? 
                                unit.Combat.getMeleeStrength(false) : 0;
                            const rangedStrength = unit.Combat.rangedStrength || 0;
                            const strength = Math.max(meleeStrength, rangedStrength);
                            
                            // Use a non-linear formula to represent power
                            // Units with higher strength have exponentially more impact
                            militaryPower += Math.round(4 ** (strength / 17));
                        }
                    }
                } catch (error) {
                    console.error("Error calculating military power:", error);
                }

                const yieldGold = safeGetNetYield(YieldTypes.YIELD_GOLD);
                const yieldCulture = safeGetNetYield(YieldTypes.YIELD_CULTURE);
                const yieldScience = safeGetNetYield(YieldTypes.YIELD_SCIENCE);
                const yieldHappiness = safeGetNetYield(YieldTypes.YIELD_HAPPINESS);
                const yieldDiplomacy = safeGetNetYield(YieldTypes.YIELD_DIPLOMACY);
                
                // Extract settlement and population stats
                const yieldSettlements = playerLibrary.Stats?.numSettlements ?? 0;
                const settlementCap = playerLibrary.Stats?.settlementCap ?? 0;
                const totalPopulation = playerLibrary.Stats?.totalPopulation ?? 0;
            
                // Calculate total balances
                const totalGold = Math.round(playerLibrary.Treasury?.goldBalance ?? 0);
                const totalDiplomacy = Math.round(playerLibrary.DiplomacyTreasury?.diplomacyBalance ?? 0);
            
                // Helper function to format yield value
                const formatYieldValue = (value) => 
                    (value >= 0 ? "+" : "") + value.toFixed(1);
                
                const yieldData = [
                    {
                        type: RibbonYieldType.Gold,
                        label: Locale.compose("LOC_YIELD_GOLD"),
                        value: formatYieldValue(yieldGold),
                        img: this.getImg('YIELD_GOLD', isLocal),
                        details: "",
                        rawValue: yieldGold,
                        warningThreshold: Infinity
                    },
                    {
                        type: RibbonYieldType.Diplomacy,
                        label: Locale.compose("LOC_YIELD_DIPLOMACY"),
                        value: formatYieldValue(yieldDiplomacy),
                        img: this.getImg('YIELD_DIPLOMACY', isLocal),
                        details: "",
                        rawValue: yieldDiplomacy,
                        warningThreshold: Infinity
                    },
                    {
                        type: RibbonYieldType.Science,
                        label: Locale.compose("LOC_YIELD_SCIENCE"),
                        value: formatYieldValue(yieldScience),
                        img: this.getImg('YIELD_SCIENCE', isLocal),
                        details: "",
                        rawValue: yieldScience,
                        warningThreshold: Infinity
                    },
                    {
                        type: RibbonYieldType.Culture,
                        label: Locale.compose("LOC_YIELD_CULTURE"),
                        value: formatYieldValue(yieldCulture),
                        img: this.getImg('YIELD_CULTURE', isLocal),
                        details: "",
                        rawValue: yieldCulture,
                        warningThreshold: Infinity
                    },
                    {
                        type: RibbonYieldType.Happiness,
                        label: Locale.compose("LOC_YIELD_HAPPINESS"),
                        value: formatYieldValue(yieldHappiness),
                        img: this.getImg('YIELD_HAPPINESS', isLocal),
                        details: "",
                        rawValue: yieldHappiness,
                        warningThreshold: Infinity
                    },
                    {
                        type: RibbonYieldType.Settlements,
                        label: Locale.compose("LOC_YIELD_MAX_CITIES"),
                        value: `${yieldSettlements}/${settlementCap}`,
                        img: this.getImg('YIELD_CITIES', isLocal),
                        details: "",
                        rawValue: yieldSettlements,
                        warningThreshold: settlementCap
                    },
                    {
                        type: RibbonYieldType.TotalPopulation,
                        label: Locale.compose("LOC_YIELD_POPULATION_TOTAL"),
                        value: totalPopulation,
                        details: "",
                        img: this.getImg('YIELD_POPULATION', isLocal),
                        rawValue: totalPopulation,
                        warningThreshold: Infinity
                    },
                    {
                        type: RibbonYieldType.TotalGold,
                        label: Locale.compose("LOC_YIELD_GOLD_TOTAL"),
                        value: totalGold,
                        details: "",
                        img: this.getImg('YIELD_GOLD', isLocal),
                        rawValue: totalGold,
                        warningThreshold: Infinity
                    },
                    {
                        type: RibbonYieldType.TotalDiplomacy,
                        label: Locale.compose("LOC_YIELD_DIPLOMACY_TOTAL"),
                        value: totalDiplomacy,
                        details: "",
                        img: this.getImg('YIELD_DIPLOMACY', isLocal),
                        rawValue: totalDiplomacy,
                        warningThreshold: Infinity
                    },
                    {
                        type: RibbonYieldType.MilitaryPower,
                        label: Locale.compose("LOC_YIELD_MILITARY_POWER"),
                        value: militaryPower,
                        img: this.getImg('DIPLOMACY_DECLARE_FORMAL_WAR_ICON', isLocal),
                        details: "",
                        rawValue: militaryPower,
                        warningThreshold: Infinity
                    }
                ];
            
                return yieldData;
            };
            
            // Force a refresh to apply changes
            DiploRibbonData.queueUpdate();
        } else {
            throw new Error("DiploRibbonData instance not found");
        }
    } catch (error) {
        console.error("Diplomatic Ribbon Extension - Initialization failed:", error);
    }
});

// Ensure immediate update if engine is already ready
if (engine.isReady) {
    DiploRibbonData.queueUpdate();
}
