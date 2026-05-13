import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Router } from '@/pages/Router'

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Router />
        </main>
      </div>
    </div>
  )
}
