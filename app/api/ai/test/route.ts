import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { topic, platform = '小红书' } = await req.json()
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) throw new Error('DEEPSEEK_API_KEY is not set')

    // 1. 获取当前登录用户
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // 如果没登录，直接打回（因为你是在无痕窗口，如果没登录会报错）
    if (!user) {
      return NextResponse.json({ error: '请先登录再生成' }, { status: 401 })
    }

    // 2. 请求 DeepSeek
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: `你是新媒体选题专家。请为「${topic}」生成5个爆款选题。只返回JSON格式：{"ideas":[{"title":"标题","angle":"切入角度","tags":["标签1"],"score":90}]}` }],
        response_format: { type: 'json_object' }
      })
    })

    const data = await response.json()
    if (data.error) throw new Error(data.error.message)
    const result = JSON.parse(data.choices[0].message.content)

    // 3. 把 AI 生成的数据存入 Supabase
    const rowsToInsert = result.ideas.map((i: any) => ({
      user_id: user.id, // 👈 必须带上用户 ID，否则会被数据库拦截
      topic: topic,
      title: i.title,
      angle: i.angle,
      tags: i.tags || [],
      score: i.score || 0
    }))

    const { error: dbError } = await supabase.from('ideas').insert(rowsToInsert)
    if (dbError) {
      console.error('数据库写入失败:', dbError.message)
      throw new Error('数据库写入失败')
    }

    return NextResponse.json({ ideas: result.ideas || [] })
  } catch (error: any) {
    console.error('API Route Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}