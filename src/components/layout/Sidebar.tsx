import { Calculator, CalendarDays, Clock, Home, Settings } from 'lucide-react'
import { useUiStore } from '@/store/index'
import type { PageType } from '@/store/slices/uiSlice'
import { cn } from '@/lib/utils'

const NAV_ITEMS: { page: PageType; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: '홈', icon: <Home className="h-5 w-5" /> },
  { page: 'calculator', label: '계산기', icon: <Calculator className="h-5 w-5" /> },
  { page: 'dday', label: 'D-Day', icon: <CalendarDays className="h-5 w-5" /> },
  { page: 'history', label: '기록', icon: <Clock className="h-5 w-5" /> },
  { page: 'settings', label: '설정', icon: <Settings className="h-5 w-5" /> },
]

export function Sidebar() {
  const { currentPage, setPage, setCalculator } = useUiStore()

  const handleNav = (page: PageType) => {
    if (page === 'calculator') {
      setCalculator(null)
    } else {
      setPage(page)
    }
  }

  return (
    <aside className="hidden md:flex flex-col w-16 lg:w-52 min-h-screen bg-card border-r border-border shrink-0">
      <div className="flex items-center gap-2 px-4 h-16 border-b border-border">
        <span className="text-xl font-bold text-emerald-600">호픈</span>
        <span className="hidden lg:block text-sm text-muted-foreground">올인원 계산기</span>
      </div>
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {NAV_ITEMS.map(({ page, label, icon }) => (
          <button
            key={page}
            onClick={() => handleNav(page)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              currentPage === page
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {icon}
            <span className="hidden lg:block">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
