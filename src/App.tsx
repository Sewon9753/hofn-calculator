import { useEffect } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { AppShell } from '@/components/layout/AppShell'
import { useStore } from '@/store/index'
import { useFxAutoSync } from '@/hooks/useFxAutoSync'

function App() {
  const isDarkMode = useStore((s) => s.isDarkMode)
  useFxAutoSync()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  return (
    <>
      <AppShell />
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
