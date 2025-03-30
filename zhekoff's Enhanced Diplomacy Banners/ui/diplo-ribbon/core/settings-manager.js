/**
 * @file settings-manager.js
 * @description Manager for tracking and responding to settings changes with batch updates
 */

import { enhancedDiploBannersSettings } from 'fs://game/enhanced-diplomacy-banners/ui/settings/settings.js';
import DiploRibbonData from '/base-standard/ui/diplo-ribbon/model-diplo-ribbon.js';

export class SettingsManager {
    constructor() {
        this.listeners = [];
        this.lastKnownSettings = this.cloneSettings(enhancedDiploBannersSettings);
        
        // For batch updates
        this.pendingUpdates = new Set();
        this.updateScheduled = false;
        this.updateDelay = 50; // milliseconds to batch updates
        
        // Listen for settings changes
        this.onSettingsChanged = this.onSettingsChanged.bind(this);
        window.addEventListener('update-diplo-ribbon', this.onSettingsChanged);
    }
    
    /**
     * Add a listener for settings changes
     * @param {Function} listener - Callback function(changedSettings)
     * @returns {Function} Function to remove the listener
     */
    addListener(listener) {
        this.listeners.push(listener);
        
        // Return function to remove this listener
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    
    /**
     * Handle settings change event
     */
    onSettingsChanged() {
        // Get current settings
        const currentSettings = enhancedDiploBannersSettings;
        
        // Find which settings have changed
        const changedSettings = this.getChangedSettings(this.lastKnownSettings, currentSettings);
        
        // Update last known settings
        this.lastKnownSettings = this.cloneSettings(currentSettings);
        
        // Queue updates for batch processing
        Object.keys(changedSettings).forEach(setting => {
            this.pendingUpdates.add(setting);
        });
        
        // Schedule batch update
        this.scheduleUpdate();
        
        // Notify listeners immediately with changed settings
        if (Object.keys(changedSettings).length > 0) {
            this.listeners.forEach(listener => {
                try {
                    listener(changedSettings);
                } catch (error) {
                    console.error('Error in settings change listener:', error);
                }
            });
        }
    }
    
    /**
     * Schedule a batched update
     */
    scheduleUpdate() {
        if (this.updateScheduled) return;
        
        this.updateScheduled = true;
        setTimeout(() => {
            // Apply all pending updates at once
            if (this.pendingUpdates.size > 0) {
                console.log(`Enhanced Diplomacy Banners: Batched ${this.pendingUpdates.size} setting updates`);
                
                // Only update if settings relevant to the diplomacy ribbon have changed
                const dipRibbonSettings = [
                    'CompactMode', 'ShowCivSymbol', 'HideBanners', 
                    'AlwaysShowExtendedYields', 'BackgroundStyle'
                ];
                
                const needsDiploUpdate = Array.from(this.pendingUpdates).some(setting => 
                    dipRibbonSettings.includes(setting)
                );
                
                // Refresh the UI once for all changes
                if (needsDiploUpdate && DiploRibbonData) {
                    DiploRibbonData.queueUpdate();
                }
                
                this.pendingUpdates.clear();
            }
            this.updateScheduled = false;
        }, this.updateDelay);
    }
    
    /**
     * Get changed settings between old and new settings
     * @param {Object} oldSettings - Previous settings
     * @param {Object} newSettings - Current settings
     * @returns {Object} Map of changed setting keys to new values
     */
    getChangedSettings(oldSettings, newSettings) {
        const changedSettings = {};
        
        // Compare _data properties
        if (oldSettings._data && newSettings._data) {
            Object.keys(newSettings._data).forEach(key => {
                if (oldSettings._data[key] !== newSettings._data[key]) {
                    changedSettings[key] = newSettings._data[key];
                }
            });
        } else {
            // Fallback if _data not available
            Object.keys(newSettings).forEach(key => {
                // Skip functions and private properties
                if (typeof newSettings[key] === 'function' || key.startsWith('_')) {
                    return;
                }
                
                if (oldSettings[key] !== newSettings[key]) {
                    changedSettings[key] = newSettings[key];
                }
            });
        }
        
        return changedSettings;
    }
    
    /**
     * Create a deep clone of settings
     * @param {Object} settings - Settings object to clone
     * @returns {Object} Cloned settings
     */
    cloneSettings(settings) {
        // Simple clone that handles basic settings structure
        const clone = {};
        
        if (settings._data) {
            clone._data = { ...settings._data };
        }
        
        // Clone direct properties (getters/setters will still reference originals)
        Object.keys(settings).forEach(key => {
            if (typeof settings[key] !== 'function' && !key.startsWith('_')) {
                clone[key] = settings[key];
            }
        });
        
        return clone;
    }
    
    /**
     * Get the current value of a setting
     * @param {string} settingName - Name of the setting
     * @returns {any} Current value of the setting
     */
    getSetting(settingName) {
        return enhancedDiploBannersSettings[settingName];
    }
    
    /**
     * Clean up event listeners
     */
    cleanup() {
        window.removeEventListener('update-diplo-ribbon', this.onSettingsChanged);
        this.listeners = [];
        this.pendingUpdates.clear();
    }
}
