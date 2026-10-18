import Link from 'next/link'
import { Lightbulb, PenLine, Calendar, BarChart3, LayoutDashboard } from 'lucide-react'

export default function Home() {
  const stats = [
    { label: '选题总数', value: '128' },
    { label: '内容总数', value: '45' },
    { label: '累计阅读', value: '8,420' },
    { label: '累计点赞', value: '1,230' },
    { label: '涨粉', value: '560' },
    { label: '累计收入', value: '¥ 320.50' },
  ]

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* 左侧侧边栏 */}
      <aside className="w-60 bg-white border-r flex flex-col min-h-screen">
        <div className="p-5 border-b">
          <div className="font-bold text-slate-800">内容运营助手</div>
          <div className="text-xs text-slate-500 mt-1">demo@test.com (演示版)</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-black text-white cursor-pointer">
            <LayoutDashboard size={16} /> 工作台
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 cursor-not-allowed">
            <Lightbulb size={16} /> 选题灵感
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 cursor-not-allowed">
            <PenLine size={16} /> 内容创作
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 cursor-not-allowed">
            <Calendar size={16} /> 内容日历
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 cursor-not-allowed">
            <BarChart3 size={16} /> 数据复盘
          </div>
        </nav>
      </aside>

      {/* 右侧主内容区 */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">工作台 (演示)</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border">
              <div className="text-sm text-slate-500">{s.label}</div>
              <div className="text-2xl font-bold mt-1 text-slate-800">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold mb-3 text-slate-800">最近内容</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b last:border-0">
              <div className="truncate text-slate-700">大学生副业避雷：这5种兼职千万别碰</div>
              <div className="text-xs text-slate-500">小红书 · 草稿</div>
            </div>
            <div className="flex justify-between items-center py-2 border-b last:border-0">
              <div className="truncate text-slate-700">宿舍就能做的5个副业，我靠第三个月入3000+</div>
              <div className="text-xs text-slate-500">小红书 · 已发布</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}