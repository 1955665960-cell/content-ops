'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'

export default function AnalyticsPage() {
  const [list, setList] = useState<any[]>([])
  const [form, setForm] = useState({
    platform: '小红书',
    views: 0, likes: 0, favorites: 0, followers_gained: 0, revenue: 0,
  })

  async function load() {
    const res = await fetch('/api/analytics')
    const data = await res.json()
    setList(data.analytics || [])
  }
  useEffect(() => { load() }, [])

  async function submit() {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ ...form, views: 0, likes: 0, favorites: 0, followers_gained: 0, revenue: 0 })
    load()
  }

  const sum = (key: string) => list.reduce((a, b) => a + (Number(b[key]) || 0), 0)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">数据复盘</h1>

      {/* 汇总卡片 */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          ['阅读', 'views'], ['点赞', 'likes'], ['收藏', 'favorites'],
          ['涨粉', 'followers_gained'], ['收入', 'revenue'],
        ].map(([label, key]) => (
          <div key={key} className="bg-white border rounded-xl p-4">
            <div className="text-xs text-slate-500">{label}</div>
            <div className="text-xl font-bold">{key === 'revenue' ? `¥${sum(key)}` : sum(key)}</div>
          </div>
        ))}
      </div>

      {/* 录入表单 */}
      <div className="bg-white border rounded-xl p-5 mb-6">
        <h2 className="font-semibold mb-3">手动录入数据</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* 平台选择 */}
          <div>
            <label className="block text-xs text-slate-500 mb-1">平台</label>
            <select 
              className="w-full border rounded-lg px-3 py-2" 
              value={form.platform} 
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
            >
              {['小红书', '公众号', '知乎', '抖音', 'B站', '微博'].map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* 逐个生成带标签的输入框 */}
          <div>
            <label className="block text-xs text-slate-500 mb-1">阅读量 (views)</label>
            <input type="number" min="0" className="w-full border rounded-lg px-3 py-2" value={form.views} onChange={(e) => setForm({ ...form, views: Number(e.target.value) })} />
          </div>
          
          <div>
            <label className="block text-xs text-slate-500 mb-1">点赞数 (likes)</label>
            <input type="number" min="0" className="w-full border rounded-lg px-3 py-2" value={form.likes} onChange={(e) => setForm({ ...form, likes: Number(e.target.value) })} />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">收藏数 (favorites)</label>
            <input type="number" min="0" className="w-full border rounded-lg px-3 py-2" value={form.favorites} onChange={(e) => setForm({ ...form, favorites: Number(e.target.value) })} />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">涨粉数 (followers)</label>
            <input type="number" min="0" className="w-full border rounded-lg px-3 py-2" value={form.followers_gained} onChange={(e) => setForm({ ...form, followers_gained: Number(e.target.value) })} />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">收入金额 (¥)</label>
            <input type="number" min="0" step="0.01" className="w-full border rounded-lg px-3 py-2" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: Number(e.target.value) })} />
          </div>
        </div>
        <button onClick={submit} className="mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800">保存记录</button>
      </div>

      {/* 历史记录表格 */}
      <div className="bg-white border rounded-xl p-5">
        <h2 className="font-semibold mb-3">历史记录</h2>
        <table className="w-full text-sm text-left">
          <thead className="text-slate-500 border-b">
            <tr>
              <th className="py-2">日期</th><th>平台</th><th>阅读</th><th>点赞</th><th>收藏</th><th>涨粉</th><th>收入</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="py-2">{r.recorded_at}</td>
                <td>{r.platform}</td>
                <td>{r.views}</td><td>{r.likes}</td><td>{r.favorites}</td>
                <td>{r.followers_gained}</td><td>¥{r.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <div className="text-sm text-slate-500 py-4 text-center">还没有记录，去上面录入一条吧。</div>}
      </div>
    </div>
  )
}