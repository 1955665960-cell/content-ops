import { redirect } from 'next/navigation'
import { connection } from 'next/server' // 👈 加这个
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await connection() // 👈 加这一行，表示这里需要运行时动态执行
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar email={user.email || ''} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}