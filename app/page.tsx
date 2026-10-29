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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      
      {/* 👇 左侧侧边栏：全部用内联样式写死 */}
      <aside style={{ width: '260px', backgroundColor: '#fff', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#000', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutDashboard size={18} />
          </div>
          内容运营助手
        </div>
        
        <nav style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('generate')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s',
              backgroundColor: activeTab === 'generate' ? '#000' : 'transparent',
              color: activeTab === 'generate' ? '#fff' : '#475569',
            }}
          >
            <Sparkles size={18} /> AI 灵感生成
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s',
              backgroundColor: activeTab === 'history' ? '#000' : 'transparent',
              color: activeTab === 'history' ? '#fff' : '#475569',
            }}
          >
            <History size={18} /> 历史记录
          </button>
        </nav>
      </aside>

      {/* 👇 右侧主内容区 */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {activeTab === 'generate' && (
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B', marginBottom: '24px' }}>AI 灵感生成</h1>
              
              <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', marginBottom: '32px', display: 'flex', gap: '16px' }}>
                <input
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
                  placeholder="输入你的领域（如：大学生副业、考研经验）"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generate()}
                />
                <select
                  style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', backgroundColor: '#fff' }}
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  {['小红书', '公众号', '知乎', '抖音', 'B站', '微博'].map((p) => <option key={p}>{p}</option>)}
                </select>
                <button
                  onClick={generate}
                  disabled={loading}
                  style={{ backgroundColor: '#000', color: '#fff', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '500', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {loading ? '生成中...' : '生成选题'}
                </button>
              </div>
              {err && <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '12px' }}>{err}</p>}

              {ideas.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {ideas.map((i, idx) => (
                    <div key={idx} style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
                      <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '12px', color: '#1E293B' }}>{i.title}</div>
                      <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>{i.angle}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(i.tags || []).map((t: string) => (
                          <span key={t} style={{ fontSize: '12px', backgroundColor: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: '6px' }}>#{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B', marginBottom: '24px' }}>历史记录</h1>
              {Object.keys(groupedHistory).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: '#fff', borderRadius: '16px', border: '1px dashed #E2E8F0', color: '#94A3B8' }}>
                  暂无历史数据，快去生成你的第一条灵感吧！
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {Object.keys(groupedHistory).map((topicKey) => (
                    <div key={topicKey} style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                      <button 
                        onClick={() => setExpandedTopic(expandedTopic === topicKey ? null : topicKey)}
                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#fff', border: 'none', cursor: 'pointer' }}
                      >
                        <div style={{ fontWeight: '600', color: '#1E293B' }}>{topicKey}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', backgroundColor: '#F1F5F9', padding: '4px 12px', borderRadius: '99px' }}>
                          {groupedHistory[topicKey].length} 条记录
                        </div>
                      </button>
                      
                      {expandedTopic === topicKey && (
                        <div style={{ borderTop: '1px solid #F1F5F9', padding: '20px', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {groupedHistory[topicKey].map((item: any) => (
                            <div key={item.id} style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
                              <div style={{ fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>{item.title}</div>
                              <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '12px' }}>{item.angle}</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {(item.tags || []).map((t: string) => (
                                  <span key={t} style={{ fontSize: '12px', backgroundColor: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: '6px' }}>#{t}</span>
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