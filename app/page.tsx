'use client'
import { useState, useEffect } from 'react'
import { Sparkles, History, LayoutDashboard } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate')
  
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('小红书')
  const [ideas, setIdeas] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)

  useEffect(() => { fetchHistory() }, [])

  async function fetchHistory() {
    try {
      const res = await fetch('/api/ideas')
      const data = await res.json()
      if (data.ideas) setHistory(data.ideas)
    } catch (e) { console.error(e) }
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
      fetchHistory()
    } catch (error: any) {
      setErr('网络请求失败，请稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  const groupedHistory = history.reduce((acc: any, curr: any) => {
    if (!acc[curr.topic]) acc[curr.topic] = []
    acc[curr.topic].push(curr)
    return acc
  }, {})

  return (
    <div className="w-full min-h-screen flex bg-[#F8FAFC]">
      {/* 左侧导航栏 */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <div className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <LayoutDashboard size={18} />
            </div>
            内容运营助手
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('generate')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'generate' 
                ? 'bg-black text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles size={18} /> AI 灵感生成
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'history' 
                ? 'bg-black text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History size={18} /> 历史记录
          </button>
        </nav>
      </aside>

      {/* 右侧内容区 */}
      <main className="flex-1 p-10 overflow-auto">
        <div className="max-w-4xl mx-auto">
          
          {/* AI 生成页 */}
          {activeTab === 'generate' && (
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-6">AI 灵感生成</h1>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
                <div className="flex gap-4">
                  <input
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="输入你的领域（如：大学生副业、考研经验）"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generate()}
                  />
                  <select
                    className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                  >
                    {['小红书', '公众号', '知乎', '抖音', 'B站', '微博'].map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <button
                    onClick={generate}
                    disabled={loading}
                    className="bg-black text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-slate-800 disabled:opacity-50 whitespace-nowrap"
                  >
                    {loading ? '生成中...' : '生成选题'}
                  </button>
                </div>
                {err && <p className="text-sm text-red-500 mt-3">{err}</p>}
              </div>

              {ideas.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {ideas.map((i, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                      <div className="font-semibold text-base mb-3 text-slate-800">{i.title}</div>
                      <div className="text-sm text-slate-500 mb-4">{i.angle}</div>
                      <div className="flex flex-wrap gap-2">
                        {(i.tags || []).map((t: string) => (
                          <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">#{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 历史记录页 */}
          {activeTab === 'history' && (
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-6">历史记录</h1>
              {Object.keys(groupedHistory).length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                  <div className="text-slate-400 text-sm">暂无历史数据，快去生成你的第一条灵感吧！</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.keys(groupedHistory).map((topicKey) => (
                    <div key={topicKey} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <button 
                        onClick={() => setExpandedTopic(expandedTopic === topicKey ? null : topicKey)}
                        className="w-full flex justify-between items-center p-5 hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="font-semibold text-slate-800">{topicKey}</div>
                        <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                          {groupedHistory[topicKey].length} 条记录
                        </div>
                      </button>
                      
                      {expandedTopic === topicKey && (
                        <div className="border-t border-slate-100 p-5 bg-slate-50 space-y-4">
                          {groupedHistory[topicKey].map((item: any) => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                              <div className="font-medium text-slate-800 mb-2">{item.title}</div>
                              <div className="text-sm text-slate-500 mb-3">{item.angle}</div>
                              <div className="flex flex-wrap gap-2">
                                {(item.tags || []).map((t: string) => (
                                  <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">#{t}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}