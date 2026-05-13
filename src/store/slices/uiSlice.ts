import type { StateCreator } from 'zustand'

export type PageType = 'dashboard' | 'calculator' | 'dday' | 'history' | 'settings'

export interface UiSlice {
  currentPage: PageType
  activeCalculator: string | null
  isDarkMode: boolean
  setPage: (page: PageType) => void
  setCalculator: (calc: string | null) => void
  toggleDarkMode: () => void
}

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (set) => ({
  currentPage: 'dashboard',
  activeCalculator: null,
  isDarkMode: false,
  setPage: (page) => set({ currentPage: page, activeCalculator: null }),
  setCalculator: (calc) => set({ currentPage: 'calculator', activeCalculator: calc }),
  toggleDarkMode: () =>
    set((state) => {
      const next = !state.isDarkMode
      document.documentElement.classList.toggle('dark', next)
      return { isDarkMode: next }
    }),
})
