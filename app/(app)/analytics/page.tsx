'use client'
import dynamic from 'next/dynamic'

// 👇 同样使用 dynamic import 禁用 SSR
const AnalyticsContent = dynamic(() => import('./AnalyticsContent'), { ssr: false })

export default function AnalyticsPage() {
  return <AnalyticsContent />
}