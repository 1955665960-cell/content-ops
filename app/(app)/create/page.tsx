'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function CreateInner() {
  const params = useSearchParams()
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('小红书')
  const [tone, setTone] = useState('真诚分享')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    const t = params.get('topic')
    if (t) setTopic(t)
  }, [params])

  async function generate() {
    if (!topic.trim()) return
    setLoading(true); setErr(''); setResult(null)
    const res = await fetch('/api/ai/copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, platform, tone }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.error) return setErr(data.error)
    setResult(data)
  }

  function copyAll() {
    if (!result) return
    const text = `${result.raw.titles?.join('\n')}\n\n${result.raw.body}\n\n${(result.raw.tags || []).map((t: string) => '#' + t).join(' ')}`
    navigator.clipboard.writeText(text)
    alert('已复制到剪贴板')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">内容创作</h1>

      <div className="bg-white border rounded-xl p-5 mb-6 space-y-3">
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="内容主题 / 标题"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <div className="flex gap-3">
          <select className="border rounded-lg px-3 py-2" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {['小红书', '公众号', '知乎', '抖音', 'B站', '微博'].map((p) => <option key={p}>{p}</option>)}
          </select>
          <select className="border rounded-lg px-3 py-2" value={tone} onChange={(e) => setTone(e.target.value)}>
            {['真诚分享', '专业干货', '轻松幽默', '情绪共鸣', '犀利观点'].map((t) => <option key={t}>{t}</option>)}
          </select>
          <button onClick={generate} disabled={loading} className="bg-black text-white px-4 rounded-lg disabled:opacity-50">
            {loading ? '生成中...' : '生成文案'}
          </button>
        </div>
        {err && <p className="text-sm text-red-500">{err}</p>}
      </div>

      {result && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white border rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">正文</h2>
              <button onClick={copyAll} className="text-sm border px-3 py-1 rounded-lg">一键复制</button>
            </div>
            <div className="whitespace-pre-wrap leading-7">{result.raw.body}</div>
          </div>
          <div className="space-y-4">
            <div className="bg-white border rounded-xl p-4">
              <h3 className="font-semibold mb-2">标题备选</h3>
              <ul className="space-y-2 text-sm">
                {(result.raw.titles || []).map((t: string) => <li key={t}>· {t}</li>)}
              </ul>
            </div>
            <div className="bg-white border rounded-xl p-4">
              <h3 className="font-semibold mb-2">标签</h3>
              <div className="flex flex-wrap gap-1">
                {(result.raw.tags || []).map((t: string) => (
                  <span key={t} className="text-xs bg-slate-100 px-2 py-0.5 rounded">#{t}</span>
                ))}
              </div>
            </div>
            <div className="bg-white border rounded-xl p-4">
              <h3 className="font-semibold mb-2">发布建议</h3>
              <ul className="space-y-1 text-sm text-slate-600">
                {(result.raw.tips || []).map((t: string) => <li key={t}>· {t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <CreateInner />
    </Suspense>
  )
}