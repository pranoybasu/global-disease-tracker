/**
 * Global Application State Store
 *
 * This file implements the global state management using Zustand, a lightweight
 * state management library. The store uses two middleware layers:
 *
 * 1. **Persist Middleware**: Saves state to localStorage for persistence across sessions
 * 2. **DevTools Middleware**: Integrates with Redux DevTools for debugging in development
 *
 * Architecture Benefits:
 * - No boilerplate compared to Redux
 * - Type-safe with TypeScript
 * - Selective re-renders via selector hooks
 * - Automatic persistence without manual serialization
 * - Time-travel debugging in dev mode
 *
 * State Structure:
 * - Disease selection (which disease is currently displayed)
 * - Map settings (visualization controls like normalization, marker size)
 * - UI state (control panel collapsed state, mobile view detection)
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Disease } from '../types';

/**
 * Map display settings
 * Controls how disease data is visualized on the map
 */
export interface MapSettings {
  showCases: boolean;
  showDeaths: boolean;
  showRecovered: boolean;
  markerSize: number;
  normalizeByPopulation: boolean;
}

/**
 * UI state for control panel
 */
export interface UIState {
  isControlPanelCollapsed: boolean;
  isMobileView: boolean;
}

/**
 * Global application state
 */
export interface AppState {
  // Disease selection
  selectedDisease: Disease;
  setSelectedDisease: (disease: Disease) => void;

  // Map settings
  mapSettings: MapSettings;
  setMapSettings: (settings: Partial<MapSettings>) => void;
  toggleCases: () => void;
  toggleDeaths: () => void;
  toggleRecovered: () => void;
  toggleNormalization: () => void;
  setMarkerSize: (size: number) => void;

  // UI state
  uiState: UIState;
  setUIState: (state: Partial<UIState>) => void;
  toggleControlPanel: () => void;
  setMobileView: (isMobile: boolean) => void;

  // Reset functions
  resetMapSettings: () => void;
  resetAll: () => void;
}

/**
 * Default map settings
 */
const defaultMapSettings: MapSettings = {
  showCases: true,
  showDeaths: false,
  showRecovered: false,
  markerSize: 5,
  normalizeByPopulation: false,
};

/**
 * Default UI state
 */
const defaultUIState: UIState = {
  isControlPanelCollapsed: false,
  isMobileView: false,
};

/**
 * Global app store using Zustand with middleware composition
 *
 * Middleware Stack (applied inside-out):
 * 1. Base store creator (innermost)
 * 2. Persist middleware - saves to localStorage
 * 3. DevTools middleware - enables Redux DevTools integration
 *
 * Features:
 * - **Disease selection state**: Tracks which disease dashboard to display
 * - **Map visualization settings**: Controls data display (normalization, markers, etc.)
 * - **UI control state**: Manages responsive UI (panel collapse, mobile detection)
 * - **Persisted to localStorage**: User preferences survive page refreshes
 * - **Redux DevTools integration**: Time-travel debugging in development mode
 *
 * State Update Pattern:
 * All state updates use the `set` function with three parameters:
 * 1. State updater (function or object)
 * 2. Replace flag (false = merge, true = replace)
 * 3. Action name (for DevTools tracking)
 */
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial disease selection
        selectedDisease: 'covid19',

        // Disease selection actions
        /**
         * Updates the currently selected disease
         * Triggers data refetch and color scheme changes throughout the app
         */
        setSelectedDisease: (disease) =>
          set(
            { selectedDisease: disease },
            false, // Merge with existing state
            'setSelectedDisease' // Action name for DevTools
          ),

        // Map settings state
        mapSettings: defaultMapSettings,

        // Map settings actions
        setMapSettings: (settings) =>
          set(
            (state) => ({
              mapSettings: { ...state.mapSettings, ...settings },
            }),
            false,
            'setMapSettings'
          ),

        toggleCases: () =>
          set(
            (state) => ({
              mapSettings: {
                ...state.mapSettings,
                showCases: !state.mapSettings.showCases,
              },
            }),
            false,
            'toggleCases'
          ),

        toggleDeaths: () =>
          set(
            (state) => ({
              mapSettings: {
                ...state.mapSettings,
                showDeaths: !state.mapSettings.showDeaths,
              },
            }),
            false,
            'toggleDeaths'
          ),

        toggleRecovered: () =>
          set(
            (state) => ({
              mapSettings: {
                ...state.mapSettings,
                showRecovered: !state.mapSettings.showRecovered,
              },
            }),
            false,
            'toggleRecovered'
          ),

        toggleNormalization: () =>
          set(
            (state) => ({
              mapSettings: {
                ...state.mapSettings,
                normalizeByPopulation: !state.mapSettings.normalizeByPopulation,
              },
            }),
            false,
            'toggleNormalization'
          ),

        setMarkerSize: (size) =>
          set(
            (state) => ({
              mapSettings: {
                ...state.mapSettings,
                markerSize: size,
              },
            }),
            false,
            'setMarkerSize'
          ),

        // UI state
        uiState: defaultUIState,

        // UI state actions
        setUIState: (state) =>
          set(
            (prevState) => ({
              uiState: { ...prevState.uiState, ...state },
            }),
            false,
            'setUIState'
          ),

        toggleControlPanel: () =>
          set(
            (state) => ({
              uiState: {
                ...state.uiState,
                isControlPanelCollapsed: !state.uiState.isControlPanelCollapsed,
              },
            }),
            false,
            'toggleControlPanel'
          ),

        setMobileView: (isMobile) =>
          set(
            (state) => ({
              uiState: {
                ...state.uiState,
                isMobileView: isMobile,
              },
            }),
            false,
            'setMobileView'
          ),

        // Reset functions
        resetMapSettings: () =>
          set(
            { mapSettings: defaultMapSettings },
            false,
            'resetMapSettings'
          ),

        resetAll: () =>
          set(
            {
              selectedDisease: 'covid19',
              mapSettings: defaultMapSettings,
              uiState: defaultUIState,
            },
            false,
            'resetAll'
          ),
      }),
      {
        // Persistence configuration
        name: 'disease-tracker-storage', // localStorage key
        
        /**
         * Partialize: Selectively persist parts of state
         *
         * We persist:
         * - selectedDisease: User's disease selection
         * - mapSettings: User's visualization preferences
         *
         * We DON'T persist:
         * - uiState: Mobile view detection should be runtime-based
         * - Functions: Action creators aren't serializable
         *
         * This prevents issues with:
         * - Stale mobile detection on different devices
         * - localStorage quota limits
         * - Serialization errors
         */
        partialize: (state) => ({
          selectedDisease: state.selectedDisease,
          mapSettings: state.mapSettings,
          // Don't persist UI state (mobile view detection should be runtime)
        }),
      }
    ),
    {
      // DevTools configuration
      name: 'Disease Tracker Store', // DevTools panel name
      enabled: import.meta.env.DEV, // Only enable in development
    }
  )
);

/**
 * Selector hooks for optimized re-renders
 */

export const useSelectedDisease = () =>
  useAppStore((state) => state.selectedDisease);

export const useSetSelectedDisease = () =>
  useAppStore((state) => state.setSelectedDisease);

export const useMapSettings = () =>
  useAppStore((state) => state.mapSettings);

export const useUIState = () =>
  useAppStore((state) => state.uiState);

export const useIsControlPanelCollapsed = () =>
  useAppStore((state) => state.uiState.isControlPanelCollapsed);

export const useIsMobileView = () =>
  useAppStore((state) => state.uiState.isMobileView);