import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useUiStore, useSettingsStore } from '@/store/index'
import { DEFAULT_TAX_RATES, DEFAULT_FX_RATES, type FxRates } from '@/store/slices/settingsSlice'
import { toast } from 'sonner'

const FX_LABELS: Record<keyof FxRates, string> = {
  USD: '미국 달러 (USD)',
  JPY: '일본 엔화 (JPY)',
  EUR: '유로 (EUR)',
  CNY: '중국 위안 (CNY)',
  GBP: '영국 파운드 (GBP)',
  VND: '베트남 동 (VND)',
}

const FX_KEYS = ['USD', 'JPY', 'EUR', 'CNY', 'GBP', 'VND'] as const

export function SettingsPage() {
  const { isDarkMode, toggleDarkMode } = useUiStore()
  const { taxRates, fxRates, setTaxRates, setFxRates, resetTaxRates, resetFxRates } = useSettingsStore()

  const [rates, setRates] = useState({ ...taxRates })
  const [fx, setFx] = useState<Record<keyof FxRates, string>>({
    USD: String(fxRates.USD),
    JPY: String(fxRates.JPY),
    EUR: String(fxRates.EUR),
    CNY: String(fxRates.CNY),
    GBP: String(fxRates.GBP),
    VND: String(fxRates.VND),
  })
  const [fetching, setFetching] = useState(false)

  const handleSaveRates = () => {
    setTaxRates(rates)
    toast.success('세율이 저장되었습니다.')
  }

  const handleSaveFx = () => {
    setFxRates({
      USD: Number(fx.USD) || DEFAULT_FX_RATES.USD,
      JPY: Number(fx.JPY) || DEFAULT_FX_RATES.JPY,
      EUR: Number(fx.EUR) || DEFAULT_FX_RATES.EUR,
      CNY: Number(fx.CNY) || DEFAULT_FX_RATES.CNY,
      GBP: Number(fx.GBP) || DEFAULT_FX_RATES.GBP,
      VND: Number(fx.VND) || DEFAULT_FX_RATES.VND,
    })
    toast.success('환율이 저장되었습니다.')
  }

  // Fetches live rates from open.er-api.com (free, no API key required)
  // Base: KRW — response gives how many of each currency per 1 KRW
  // We invert to get KRW per 1 foreign currency unit
  const handleFetchLive = async () => {
    setFetching(true)
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/KRW')
      if (!res.ok) throw new Error('응답 오류')
      const data = await res.json()
      if (data.result !== 'success') throw new Error('API 오류')
      const r = data.rates as Record<string, number>
      const updated: Partial<Record<keyof FxRates, string>> = {}
      for (const key of FX_KEYS) {
        if (r[key]) updated[key] = String(+(1 / r[key]).toFixed(key === 'VND' ? 6 : 2))
      }
      setFx((prev) => ({ ...prev, ...updated }))
      toast.success(`실시간 환율 로드 완료 (기준: ${data.time_last_update_utc?.slice(0, 16) ?? ''}`)
    } catch {
      toast.error('환율 로드 실패. 인터넷 연결을 확인하세요.')
    } finally {
      setFetching(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">설정</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">화면</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label>다크 모드</Label>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">환율 설정 (KRW 기준)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">1 외화 = ? 원 으로 입력하세요.</p>
          {FX_KEYS.map((key) => (
            <div key={key}>
              <Label>1 {FX_LABELS[key]}</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  className="font-mono"
                  value={fx[key]}
                  onChange={(e) => setFx((prev) => ({ ...prev, [key]: e.target.value }))}
                />
                <span className="text-sm text-muted-foreground shrink-0">원</span>
              </div>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex items-center gap-1.5"
              onClick={handleFetchLive}
              disabled={fetching}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${fetching ? 'animate-spin' : ''}`} />
              실시간 업데이트
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                resetFxRates()
                setFx({
                  USD: String(DEFAULT_FX_RATES.USD),
                  JPY: String(DEFAULT_FX_RATES.JPY),
                  EUR: String(DEFAULT_FX_RATES.EUR),
                  CNY: String(DEFAULT_FX_RATES.CNY),
                  GBP: String(DEFAULT_FX_RATES.GBP),
                  VND: String(DEFAULT_FX_RATES.VND),
                })
              }}
            >
              기본값
            </Button>
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveFx}>
              저장
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">4대보험 요율 커스텀 (2026 기본값)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'nationalPension', label: '국민연금 요율 (%)' },
            { key: 'healthInsurance', label: '건강보험 요율 (%)' },
            { key: 'longTermCare', label: '장기요양보험 (건강보험료 대비 %)' },
            { key: 'employmentInsurance', label: '고용보험 요율 (%)' },
          ].map(({ key, label }) => (
            <div key={key}>
              <Label>{label}</Label>
              <Input
                className="mt-1 font-mono"
                value={String(rates[key as keyof typeof rates] * 100)}
                onChange={(e) => setRates((prev) => ({ ...prev, [key]: Number(e.target.value) / 100 }))}
              />
            </div>
          ))}
          <Separator />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setRates({ ...DEFAULT_TAX_RATES }); resetTaxRates() }}>
              기본값 복원
            </Button>
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveRates}>
              저장
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <p className="text-xs text-amber-600">
            ⚠ 브라우저의 사이트 데이터(IndexedDB)를 삭제하면 D-Day와 계산 기록이 영구 소실됩니다.
            주기적으로 기록 페이지에서 엑셀 백업을 권장합니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
