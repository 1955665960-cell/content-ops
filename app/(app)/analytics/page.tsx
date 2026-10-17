'use client'
export const instant = false
import { useEffect, useState } from 'react'

export default function AnalyticsPage() {
  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/analytics').then(res => res.json()).then(data => setList(data.analytics || []))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">数据复盘</h1>
      <div className="bg-white border rounded-xl p-5">
        <div className="text-sm text-slate-500 mb-4">共获取到 {list.length} 条历史记录。</div>
        <div className="space-y-2">
          {list.map((r: any) => (
            <div key={r.id} className="border p-3 rounded-lg text-sm">
              {r.recorded_at} - {r.platform} - 阅读: {r.views}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}