'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lightbulb, PenLine, Calendar, BarChart3, LayoutDashboard, LogOut } from 'lucide-react'

const items = [
  { href: '/dashboard', label: '工作台', icon: LayoutDashboard },
  { href: '/ideas', label: '选题灵感', icon: Lightbulb },
  { href: '/create', label: '内容创作', icon: PenLine },
  { href: '/calendar', label: '内容日历', icon: Calendar },
  { href: '/analytics', label: '数据复盘', icon: BarChart3 },
]

export default function Sidebar({ email }: { email: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-60 bg-white border-r flex flex-col min-h-screen">
      <div className="p-5 border-b">
        <div className="font-bold">内容运营助手</div>
        <div className="text-xs text-slate-500 mt-1 truncate">{email}</div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((it) => {
          const Icon = it.icon
          const active = pathname.startsWith(it.href)
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                active ? 'bg-black text-white' : 'hover:bg-slate-100'
              }`}
            >
              <Icon size={16} /> {it.label}
            </Link>
          )
        })}
      </nav>
      <button
        onClick={logout}
        className="m-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-slate-100"
      >
        <LogOut size={16} /> 退出登录
      </button>
    </aside>
  )
}