import type { StateCreator } from 'zustand'

export interface TaxRates {
  nationalPension: number
  healthInsurance: number
  longTermCare: number
  employmentInsurance: number
}

export const DEFAULT_TAX_RATES: TaxRates = {
  nationalPension: 0.045,
  healthInsurance: 0.03545,
  longTermCare: 0.1295,
  employmentInsurance: 0.009,
}

// KRW per 1 unit of each foreign currency
export interface FxRates {
  USD: number
  JPY: number
  EUR: number
  CNY: number
  GBP: number
  VND: number
}

export const DEFAULT_FX_RATES: FxRates = {
  USD: 1380,
  JPY: 9.2,
  EUR: 1520,
  CNY: 190,
  GBP: 1790,
  VND: 0.054,
}

export interface SettingsSlice {
  taxRates: TaxRates
  fxRates: FxRates
  setTaxRates: (rates: Partial<TaxRates>) => void
  setFxRates: (rates: Partial<FxRates>) => void
  resetTaxRates: () => void
  resetFxRates: () => void
}

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
  taxRates: DEFAULT_TAX_RATES,
  fxRates: DEFAULT_FX_RATES,
  setTaxRates: (rates) =>
    set((state) => ({ taxRates: { ...state.taxRates, ...rates } })),
  setFxRates: (rates) =>
    set((state) => ({ fxRates: { ...state.fxRates, ...rates } })),
  resetTaxRates: () => set({ taxRates: DEFAULT_TAX_RATES }),
  resetFxRates: () => set({ fxRates: DEFAULT_FX_RATES }),
})
