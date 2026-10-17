import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: ideas }, { data: contents }, { data: analytics }] = await Promise.all([
    supabase.from('ideas').select('id').eq('user_id', user!.id),
    supabase.from('contents').select('id, title, platform, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('analytics').select('views, likes, favorites, followers_gained, revenue'),
  ])

  const sum = (key: string) =>
    (analytics || []).reduce((a: number, b: any) => a + (Number(b[key]) || 0), 0)

  const stats = [
    { label: '选题总数', value: ideas?.length || 0 },
    { label: '内容总数', value: contents?.length || 0 },
    { label: '累计阅读', value: sum('views') },
    { label: '累计点赞', value: sum('likes') },
    { label: '涨粉', value: sum('followers_gained') },
    { label: '累计收入', value: `¥${sum('revenue')}` },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">工作台</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border">
            <div className="text-sm text-slate-500">{s.label}</div>
            <div className="text-2xl font-bold mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-8">
        <Link href="/ideas" className="bg-black text-white px-4 py-2 rounded-lg text-sm">生成选题</Link>
        <Link href="/create" className="border px-4 py-2 rounded-lg text-sm bg-white">创作内容</Link>
        <Link href="/calendar" className="border px-4 py-2 rounded-lg text-sm bg-white">查看日历</Link>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold mb-3">最近内容</h2>
        <div className="space-y-2">
          {contents?.length ? contents.map((c) => (
            <div key={c.id} className="flex justify-between items-center py-2 border-b last:border-0">
              <div className="truncate">{c.title}</div>
              <div className="text-xs text-slate-500">{c.platform} · {c.status}</div>
            </div>
          )) : <div className="text-sm text-slate-500">还没有内容，去创作一篇吧。</div>}
        </div>
      </div>
    </div>
  )
}