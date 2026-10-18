import Sidebar from '@/components/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar email="demo@test.com" />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}