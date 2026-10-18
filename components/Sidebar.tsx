'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lightbulb, LayoutDashboard } from 'lucide-react'

const items = [
  { href: '/', label: '工作台', icon: LayoutDashboard },
  { href: '/ideas', label: '选题灵感', icon: Lightbulb },
]

export default function Sidebar({ email }: { email: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-white border-r flex flex-col min-h-screen">
      <div className="p-5 border-b">
        <div className="font-bold text-slate-800">内容运营助手</div>
        <div className="text-xs text-slate-500 mt-1 truncate">{email}</div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((it) => {
          const Icon = it.icon
          const active = pathname === it.href
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                active ? 'bg-black text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={16} /> {it.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}