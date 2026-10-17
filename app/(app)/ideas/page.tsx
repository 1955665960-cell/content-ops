'use client'
export const instant = false
import { useState } from 'react'

export default function IdeasPage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('小红书')
  const [ideas, setIdeas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function generate() {
    if (!topic.trim()) return
    setLoading(true); setErr('')
    const res = await fetch('/api/ai/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, platform }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.error) return setErr(data.error)
    setIdeas(data.ideas || [])
  }

  function useIdea(title: string) {
    window.location.href = `/create?topic=${encodeURIComponent(title)}`
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">选题灵感</h1>
      <div className="bg-white border rounded-xl p-5 mb-6">
        <div className="flex gap-3 mb-3">
          <input className="flex-1 border rounded-lg px-3 py-2" placeholder="你的领域，例如：大学生副业" value={topic} onChange={(e) => setTopic(e.target.value)} />
          <select className="border rounded-lg px-3 py-2" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {['小红书', '公众号', '知乎', '抖音', 'B站', '微博'].map((p) => <option key={p}>{p}</option>)}
          </select>
          <button onClick={generate} disabled={loading} className="bg-black text-white px-4 rounded-lg disabled:opacity-50">{loading ? '生成中...' : '生成选题'}</button>
        </div>
        {err && <p className="text-sm text-red-500">{err}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {ideas.map((i) => (
          <div key={i.id} className="bg-white border rounded-xl p-4">
            <div className="font-semibold mb-1">{i.title}</div>
            <div className="text-sm text-slate-500 mb-2">{i.angle}</div>
            <div className="flex flex-wrap gap-1 mb-3">
              {(i.tags || []).map((t: string) => <span key={t} className="text-xs bg-slate-100 px-2 py-0.5 rounded">#{t}</span>)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">爆款指数 {i.score}</span>
              <button onClick={() => useIdea(i.title)} className="text-sm border px-3 py-1 rounded-lg">采用并创作</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}