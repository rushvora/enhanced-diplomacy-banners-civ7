/**
 * @file features/extra-yields.js
 * @description Enhanced yield display with optimized performance
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
RibbonYieldType.TradeRoutes = "tradeRoutes";

// Simple cache implementation
class SimpleCache {
    constructor(lifetime = 2000) {
        this.cache = new Map();
        this.lifetime = lifetime;
    }
    
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;
        
        // Check if entry is expired
        if (Date.now() - entry.timestamp > this.lifetime) {
            this.cache.delete(key);
            return null;
        }
        
        return entry.value;
    }
    
    set(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }
    
    clear() {
        this.cache.clear();
    }
}

// Create caches with 2 second lifetime
const militaryPowerCache = new SimpleCache();
const yieldDataCache = new SimpleCache();
const tradeRouteCache = new SimpleCache();

// Calculate military power with caching
function calculateMilitaryPower(playerLibrary) {
    // Return 0 if no player library
    if (!playerLibrary) return 0;
    
    // Create a cache key based on player ID and units count
    const playerId = playerLibrary.PlayerID;
    const unitsCollection = playerLibrary.Units;
    const unitsCount = unitsCollection?.getUnits()?.length || 0;
    const cacheKey = `military_${playerId}_${unitsCount}`;
    
    // Check cache first
    const cachedPower = militaryPowerCache.get(cacheKey);
    if (cachedPower !== null) {
        return cachedPower;
    }
    
    // Calculate military power
    let militaryPower = 0;
    try {
        // Check if Units collection is available
        if (unitsCollection && typeof unitsCollection.getUnits === 'function') {
            const units = unitsCollection.getUnits();
            
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
                militaryPower += Math.round(4 ** (strength / 17));
            }
        }
    } catch (error) {
        console.error("Error calculating military power:", error);
    }
    
    // Store in cache
    militaryPowerCache.set(cacheKey, militaryPower);
    
    return militaryPower;
}

// Calculate trade route information with caching
function calculateTradeRoutes(playerLibrary) {
    // Return default values if no player library
    if (!playerLibrary) return { current: 0, max: 0, displayText: "99/99" };
    
    const playerId = playerLibrary.PlayerID;
    const localPlayer = Players.get(GameContext.localPlayerID);
    if (!localPlayer) return { current: 0, max: 0, displayText: "99/99" };
    const cacheKey = `traderoutes_${playerId}`;
    
    // Check cache first
    const cachedRoutes = tradeRouteCache.get(cacheKey);
    if (cachedRoutes !== null) {
        return cachedRoutes;
    }
    
    let currentTradeRoutes = 0;
    let maxTradeRoutes = 0;
    
    try {
        currentTradeRoutes = localPlayer.Trade?.countPlayerTradeRoutesTo(playerLibrary.id) ?? 0;
        maxTradeRoutes = localPlayer.Trade?.getTradeCapacityFromPlayer(playerLibrary.id) ?? 0;
    } catch (error) {
        console.error("Error calculating trade routes:", error);
    }
    
    const result = {
        current: currentTradeRoutes,
        max: maxTradeRoutes,
        displayText: `${currentTradeRoutes}/${maxTradeRoutes}`
    };
    
    // Store in cache
    tradeRouteCache.set(cacheKey, result);
    
    return result;
}

engine.whenReady.then(() => {
    try {
        if (DiploRibbonData) {
            // Always show yields
            DiploRibbonData.alwaysShowYields = RibbonStatsToggleStatus.RibbonStatsShowing;
            
            // Override method to always include Yields display type
            DiploRibbonData.getRibbonDisplayTypesFromUserOptions = function() {
                this._ribbonDisplayTypes = [RibbonDisplayType.Yields];
            };
            
            // Add military power calculation method to DiploRibbonData
            DiploRibbonData.calculateMilitaryPower = calculateMilitaryPower;
            
            // Add trade route calculation method to DiploRibbonData
            DiploRibbonData.calculateTradeRoutes = calculateTradeRoutes;
            
            // Enhanced yield data generation with caching
            DiploRibbonData.createPlayerYieldsData = function(playerLibrary, isLocal) {
                // Early exit if yields shouldn't be shown
                if (!this.shouldShowYieldType(RibbonDisplayType.Yields)) {
                    return [];
                }
                
                // Create a cache key based on player ID
                const playerId = playerLibrary.PlayerID;
                
                // Include timestamp in key to detect stale data
                const stats = playerLibrary.Stats;
                const treasury = playerLibrary.Treasury;
                
                // Create a fingerprint of key stats to detect changes
                const yieldFingerprint = [
                    stats?.getNetYield(YieldTypes.YIELD_GOLD) || 0,
                    stats?.getNetYield(YieldTypes.YIELD_CULTURE) || 0,
                    stats?.getNetYield(YieldTypes.YIELD_SCIENCE) || 0,
                    stats?.getNetYield(YieldTypes.YIELD_HAPPINESS) || 0,
                    stats?.getNetYield(YieldTypes.YIELD_DIPLOMACY) || 0,
                    stats?.numSettlements || 0,
                    treasury?.goldBalance || 0
                ].join('_');
                
                const cacheKey = `yields_${playerId}_${yieldFingerprint}`;
                
                // Check cache first
                const cachedData = yieldDataCache.get(cacheKey);
                if (cachedData) {
                    return cachedData;
                }
                
                // Safely extract yield values with fallback to 0
                const safeGetNetYield = (yieldType) => 
                    playerLibrary.Stats?.getNetYield(yieldType) ?? 0;
                
                // Calculate military power
                const militaryPower = this.calculateMilitaryPower(playerLibrary);

                // Calculate trade routes
                const tradeRoutes = this.calculateTradeRoutes(playerLibrary);
                
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
                    },
                    {
                        type: RibbonYieldType.TradeRoutes,
                        label: Locale.compose("LOC_YIELD_TRADE_ROUTES"),
                        value: tradeRoutes.displayText,
                        img: this.getImg('YIELD_TRADES', isLocal),
                        details: "",
                        rawValue: tradeRoutes.current,
                        warningThreshold: tradeRoutes.max
                    }
                ];
            
                // Store in cache
                yieldDataCache.set(cacheKey, yieldData);
                
                return yieldData;
            };
            
            // Clear caches when game turn changes
            engine.on('PlayerTurnActivated', () => {
                militaryPowerCache.clear();
                yieldDataCache.clear();
                tradeRouteCache.clear();
                console.log("Enhanced Diplomacy Banners: Cache cleared for new turn");
            });
            
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
