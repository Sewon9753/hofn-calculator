import { Calculator, CalendarDays, Clock, Home, Menu, Settings } from 'lucide-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/store/index'
import type { PageType } from '@/store/slices/uiSlice'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const NAV_ITEMS: { page: PageType; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: '홈', icon: <Home className="h-5 w-5" /> },
  { page: 'calculator', label: '계산기', icon: <Calculator className="h-5 w-5" /> },
  { page: 'dday', label: 'D-Day', icon: <CalendarDays className="h-5 w-5" /> },
  { page: 'history', label: '기록', icon: <Clock className="h-5 w-5" /> },
  { page: 'settings', label: '설정', icon: <Settings className="h-5 w-5" /> },
]

export function MobileNav() {
  const { currentPage, setPage, setCalculator } = useUiStore()
  const [open, setOpen] = useState(false)

  const handleNav = (page: PageType) => {
    if (page === 'calculator') setCalculator(null)
    else setPage(page)
    setOpen(false)
  }

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex items-center gap-2 px-4 h-16 border-b border-border">
            <span className="text-xl font-bold text-emerald-600">호픈</span>
            <span className="text-sm text-muted-foreground">올인원 계산기</span>
          </div>
          <nav className="flex flex-col gap-1 p-2">
            {NAV_ITEMS.map(({ page, label, icon }) => (
              <button
                key={page}
                onClick={() => handleNav(page)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left',
                  currentPage === page
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {icon}
                {label}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
