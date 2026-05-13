import type { ReactNode } from 'react'

interface Props {
  title: string
  input: ReactNode
  result: ReactNode
}

export function CalculatorShell({ title, input, result }: Props) {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">{input}</div>
        <div className="md:col-span-2">{result}</div>
      </div>
    </div>
  )
}
