import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/store/index'
import { MobileNav } from './MobileNav'

export function Header() {
  const { isDarkMode, toggleDarkMode } = useUiStore()

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
      <MobileNav />
      <div className="flex-1" />
      <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </header>
  )
}
