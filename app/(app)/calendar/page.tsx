'use client'
import dynamic from 'next/dynamic'

// 👇 终极绝杀：使用 dynamic import 禁用 SSR
const CalendarContent = dynamic(() => import('./CalendarContent'), { ssr: false })

export default function CalendarPage() {
  return <CalendarContent />
}