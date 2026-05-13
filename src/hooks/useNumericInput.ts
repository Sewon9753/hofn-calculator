import { useState } from 'react'
import type { ChangeEvent } from 'react'

export function useNumericInput(initialValue: number | string) {
  const [digits, setDigits] = useState(() => String(initialValue).replace(/[^0-9]/g, ''))

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const d = e.target.value.replace(/[^0-9]/g, '')
    setDigits(d)
  }

  return {
    value: digits ? Number(digits).toLocaleString('ko-KR') : '',
    onChange,
    numericValue: Number(digits) || 0,
  }
}
