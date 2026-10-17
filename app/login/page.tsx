'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// 翻译函数：把常见的 Supabase 英文报错换成中文
function translateError(msg: string) {
  if (msg.includes('Anonymous sign-ins are disabled')) return '邮箱注册功能未开启，请检查 Supabase 后台设置。'
  if (msg.includes('Invalid login credentials')) return '邮箱或密码错误，请检查后重试。'
  if (msg.includes('User already registered')) return '该邮箱已经注册过了，请直接登录。'
  if (msg.includes('Password should be at least 6 characters')) return '密码太短了，至少要6位哦。'
  if (msg.includes('Unable to validate email address: invalid format')) return '邮箱格式不对，请重新输入。'
  if (msg.includes('Email not confirmed')) return '邮箱还没有验证，请去邮箱收件箱点一下确认链接。'
  return msg // 其他没预料到的错误，原样展示
}

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleLogin() {
    setLoading(true); setMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email, password }) 
    setLoading(false)
    if (error) return setMsg(translateError(error.message))
    router.push('/dashboard')
    router.refresh()
  }

  async function handleSignUp() {
    setLoading(true); setMsg('')
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) return setMsg(translateError(error.message))
    setMsg('注册成功，请点击登录。')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-1">内容运营助手</h1>
        <p className="text-sm text-slate-500 mb-6">AI 选题 · 创作 · 排期 · 复盘</p>

        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 mb-4"
          type="password"
          placeholder="密码（至少 6 位）"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white rounded-lg py-2 mb-2 disabled:opacity-50"
        >
          {loading ? '处理中...' : '登录'}
        </button>
        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full border rounded-lg py-2 disabled:opacity-50"
        >
          注册新账号
        </button>

        {msg && <p className="text-sm text-red-500 mt-3">{msg}</p>}
      </div>
    </div>
  )
}