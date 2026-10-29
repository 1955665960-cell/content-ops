'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('小红书')
  const [ideas, setIdeas] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  // 页面加载时，自动拉取一次历史记录
  useEffect(() => {
    fetchHistory()
  }, [])

  async function fetchHistory() {
    try {
      const res = await fetch('/api/ideas')
      const data = await res.json()
      if (data.ideas) setHistory(data.ideas)
    } catch (e) {
      console.error('获取历史记录失败', e)
    }
  }

  async function generate() {
    if (!topic.trim()) return
    setLoading(true); setErr(''); setIdeas([])
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      setIdeas(data.ideas || [])
      fetchHistory() // 👈 生成成功后，立刻刷新右侧的历史记录！
    } catch (error: any) {
      setErr('网络请求失败，请稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* 左侧：操作区 */}
      <aside className="w-80 bg-white border-r flex flex-col min-h-screen p-5">
        <div className="mb-6">
          <div className="font-bold text-slate-800 text-lg">内容运营助手</div>
          <div className="text-xs text-slate-500 mt-1">AI 赋能，高效创作</div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">你想写什么领域的选题？</label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="例如：大学生副业、考研经验"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generate()}
            />
          </div>
          
          <div>
            <label className="block text-xs text-slate-500 mb-1">目标平台</label>
            <select
              className="w-full border rounded-lg px-3 py-2 bg-white"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {['小红书', '公众号', '知乎', '抖音', 'B站', '微博'].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-black text-white px-4 py-2.5 rounded-lg font-medium disabled:opacity-50 hover:bg-slate-800 transition-colors"
          >
            {loading ? 'AI 正在思考...' : '生成选题'}
          </button>
          {err && <p className="text-sm text-red-500">{err}</p>}
        </div>
      </aside>

      {/* 右侧：展示区 */}
      <main className="flex-1 p-8 overflow-auto">
        {ideas.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              ✨ 刚刚生成的选题
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {ideas.map((i, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="font-semibold text-lg mb-2 text-slate-800">{i.title}</div>
                  <div className="text-sm text-slate-500 mb-4">{i.angle}</div>
                  <div className="flex flex-wrap gap-2">
                    {(i.tags || []).map((t: string) => (
                      <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">#{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            📚 历史记录
          </h2>
          {history.length === 0 ? (
            <div className="text-slate-500 text-sm">还没有历史记录，去左侧生成一次吧！</div>
          ) : (
            <div className="space-y-3">
              {history.map((i) => (
                <div key={i.id} className="bg-white border rounded-lg p-4 flex justify-between items-center shadow-sm">
                  <div>
                    <div className="font-medium text-slate-800">{i.title}</div>
                    <div className="text-sm text-slate-500 mt-1">{i.angle}</div>
                  </div>
                  <div className="text-xs text-slate-400 whitespace-nowrap ml-4">
                    {new Date(i.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}