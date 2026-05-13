import { useState } from 'react'
import { useHistory } from './useHistory'

export function useCalculator<TInput, TResult>(
  calcFn: (input: TInput) => TResult,
  type: string,
  makeLabel: (input: TInput, result: TResult) => string,
) {
  const { add } = useHistory()
  const [result, setResult] = useState<TResult | null>(null)

  const calculate = async (input: TInput) => {
    const res = calcFn(input)
    setResult(res)
    await add({
      calculatorType: type,
      label: makeLabel(input, res),
      inputs: input as Record<string, unknown>,
      result: res as Record<string, unknown>,
    })
  }

  return { result, calculate }
}
