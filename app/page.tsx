'use client'
import { useState } from 'react'

export default function Home() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('小红书')
  const [ideas, setIdeas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function generate() {
    if (!topic.trim()) return
    setLoading(true); setErr(''); setIdeas([])
    try {
      const API_URL = '/api/ai/test'
      
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit', // 👈 拒绝任何旧Cookie
        body: JSON.stringify({ topic, platform }),
      })
      
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setIdeas(data.ideas || [])
    } catch (error: any) {
      setErr('网络请求失败，请稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-60 bg-white border-r flex flex-col min-h-screen">
        <div className="p-5 border-b">
          <div className="font-bold text-slate-800">内容运营助手</div>
          <div className="text-xs text-slate-500 mt-1">demo@test.com</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-black text-white">
            <span>工作台 (AI 演示)</span>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">AI 选题灵感</h1>
        
        <div className="bg-white border rounded-xl p-5 mb-8 shadow-sm">
          <div className="flex gap-3">
            <input
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="输入你的领域，例如：大学生副业"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generate()}
            />
            <select
              className="border rounded-lg px-4 py-2 bg-white"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {['小红书', '公众号', '知乎', '抖音', 'B站', '微博'].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <button
              onClick={generate}
              disabled={loading}
              className="bg-black text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-slate-800 transition-colors"
            >
              {loading ? 'AI 正在思考...' : '生成选题'}
            </button>
          </div>
          {err && <p className="text-sm text-red-500 mt-3">{err}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {ideas.map((i) => (
            <div key={i.title} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="font-semibold text-lg mb-2 text-slate-800">{i.title}</div>
              <div className="text-sm text-slate-500 mb-3">{i.angle}</div>
              <div className="flex flex-wrap gap-2">
                {(i.tags || []).map((t: string) => (
                  <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}