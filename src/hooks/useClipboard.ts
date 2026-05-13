import { useState } from 'react'
import { toast } from 'sonner'

export function useClipboard() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copy = async (text: string, key = 'default') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      toast.success('클립보드에 복사되었습니다')
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      toast.error('복사 실패')
    }
  }

  const isCopied = (key = 'default') => copiedKey === key

  return { copy, isCopied }
}
