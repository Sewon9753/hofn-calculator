import { useEffect } from 'react'
import { useStore } from '@/store/index'
import type { FxRates } from '@/store/slices/settingsSlice'

const FX_KEYS: (keyof FxRates)[] = ['USD', 'JPY', 'EUR', 'CNY', 'GBP', 'VND']

// Silently fetches live exchange rates on app mount.
// Uses open.er-api.com (free, no API key). Falls back to stored rates if offline.
export function useFxAutoSync() {
  const setFxRates = useStore((s) => s.setFxRates)

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/KRW')
      .then((r) => r.json())
      .then((data) => {
        if (data.result !== 'success') return
        const r = data.rates as Record<string, number>
        const updated: Partial<FxRates> = {}
        for (const key of FX_KEYS) {
          if (r[key]) updated[key] = +(1 / r[key]).toFixed(key === 'VND' ? 6 : 2)
        }
        setFxRates(updated)
      })
      .catch(() => {
        // offline or API unavailable — keep stored rates
      })
  }, [])
}
