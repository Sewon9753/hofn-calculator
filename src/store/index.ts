import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { createUiSlice, type UiSlice } from './slices/uiSlice'
import { createSettingsSlice, type SettingsSlice } from './slices/settingsSlice'

type BoundStore = UiSlice & SettingsSlice

export const useStore = create<BoundStore>()(
  persist(
    (...a) => ({
      ...createUiSlice(...a),
      ...createSettingsSlice(...a),
    }),
    {
      name: 'hofn-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        taxRates: state.taxRates,
        fxRates: state.fxRates,
      }),
    },
  ),
)

export const useUiStore = () =>
  useStore(
    useShallow((s) => ({
      currentPage: s.currentPage,
      activeCalculator: s.activeCalculator,
      isDarkMode: s.isDarkMode,
      setPage: s.setPage,
      setCalculator: s.setCalculator,
      toggleDarkMode: s.toggleDarkMode,
    })),
  )

export const useSettingsStore = () =>
  useStore(
    useShallow((s) => ({
      taxRates: s.taxRates,
      fxRates: s.fxRates,
      setTaxRates: s.setTaxRates,
      setFxRates: s.setFxRates,
      resetTaxRates: s.resetTaxRates,
      resetFxRates: s.resetFxRates,
    })),
  )
