'use client'
export const instant = false
import { useEffect, useState } from 'react'

export default function CalendarPage() {
  const [contents, setContents] = useState<any[]>([])
  
  useEffect(() => {
    fetch('/api/contents').then(res => res.json()).then(data => setContents(data.contents || []))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">内容日历</h1>
      <div className="bg-white border rounded-xl p-5">
        <div className="text-sm text-slate-500 mb-4">共获取到 {contents.length} 条内容数据。</div>
        <div className="space-y-2">
          {contents.map((c: any) => (
            <div key={c.id} className="border p-3 rounded-lg text-sm">
              {c.title} - {c.platform} ({c.status})
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}