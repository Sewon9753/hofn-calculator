export function formatKRW(value: number): string {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Math.round(value))
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: decimals }).format(value)
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(isoDate))
}
