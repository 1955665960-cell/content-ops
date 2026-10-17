'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns'

export default function CalendarPage() {
  const [contents, setContents] = useState<any[]>([])
  const [cursor, setCursor] = useState(new Date())
  const [selected, setSelected] = useState(new Date())

  async function load() {
    const res = await fetch('/api/contents')
    const data = await res.json()
    setContents(data.contents || [])
  }
  useEffect(() => { load() }, [])

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/contents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, scheduled_at: selected.toISOString() }),
    })
    load()
  }

  async function remove(id: string) {
    if (!confirm('确定删除？')) return
    await fetch(`/api/contents/${id}`, { method: 'DELETE' })
    load()
  }

  const days = eachDayOfInterval({ start: startOfMonth(cursor), end: endOfMonth(cursor) })
  const startWeekday = startOfMonth(cursor).getDay()
  
  // 当天安排的内容
  const dayContents = contents.filter((c) => c.scheduled_at && isSameDay(new Date(c.scheduled_at), selected))
  // 未排期的草稿（新增）
  const unscheduled = contents.filter((c) => !c.scheduled_at)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">内容日历</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧日历区 */}
        <div className="col-span-2 bg-white border rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setCursor(subMonths(cursor, 1))} className="border px-3 py-1 rounded-lg">上月</button>
            <div className="font-semibold">{format(cursor, 'yyyy 年 MM 月')}</div>
            <button onClick={() => setCursor(addMonths(cursor, 1))} className="border px-3 py-1 rounded-lg">下月</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-2">
            {['日','一','二','三','四','五','六'].map((d) => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startWeekday }).map((_, i) => <div key={'e' + i} />)}
            {days.map((d) => {
              const items = contents.filter((c) => c.scheduled_at && isSameDay(new Date(c.scheduled_at), d))
              const isSel = isSameDay(d, selected)
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => setSelected(d)}
                  className={`aspect-square rounded-lg border text-sm p-1 text-left ${
                    isSel ? 'bg-black text-white' : 'hover:bg-slate-50'
                  }`}
                >
                  <div>{format(d, 'd')}</div>
                  {items.length > 0 && (
                    <div className={`text-[10px] mt-1 ${isSel ? 'text-white' : 'text-slate-500'}`}>
                      {items.length} 条
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 右侧详情区 */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold mb-3">{format(selected, 'MM 月 dd 日')}</h2>
          
          {/* 新增：未排期草稿区 */}
          {unscheduled.length > 0 && (
            <div className="mb-5 p-3 bg-slate-50 rounded-lg">
              <h3 className="text-xs font-semibold text-slate-500 mb-2">📝 未排期草稿</h3>
              <div className="space-y-2">
                {unscheduled.map(c => (
                  <div key={c.id} className="border border-slate-200 bg-white rounded-lg p-2 text-sm flex justify-between items-center gap-2">
                    <span className="truncate flex-1" title={c.title}>{c.title}</span>
                    <button onClick={() => updateStatus(c.id, 'scheduled')} className="text-xs border px-2 py-1 rounded bg-black text-white whitespace-nowrap hover:bg-slate-800">排期到这天</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 当天已排期内容 */}
          <div className="space-y-3">
            {dayContents.length === 0 && <div className="text-sm text-slate-500 text-center py-4">这一天还没有安排内容</div>}
            {dayContents.map((c) => (
              <div key={c.id} className="border rounded-lg p-3">
                <div className="font-medium text-sm mb-1">{c.title}</div>
                <div className="text-xs text-slate-500 mb-2">{c.platform} · {c.status}</div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(c.id, 'scheduled')} className="text-xs border px-2 py-0.5 rounded">排期</button>
                  <button onClick={() => updateStatus(c.id, 'published')} className="text-xs border px-2 py-0.5 rounded">已发布</button>
                  <button onClick={() => remove(c.id)} className="text-xs border px-2 py-0.5 rounded text-red-500 hover:bg-red-50">删除</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}