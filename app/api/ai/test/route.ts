import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { topic } = await req.json()
    const apiKey = process.env.DEEPSEEK_API_KEY

    if (!apiKey) throw new Error('DEEPSEEK_API_KEY is not set')

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: `你是新媒体选题专家。请为「${topic}」生成5个爆款选题。只返回JSON格式：{"ideas":[{"title":"标题","angle":"切入角度","tags":["标签1"],"score":90}]}` }
        ],
        response_format: { type: 'json_object' }
      })
    })

    const data = await response.json()
    if (data.error) throw new Error(data.error.message)

    const result = JSON.parse(data.choices[0].message.content)
    
    // 👇 将数据存入 Supabase 数据库
    const supabase = await createClient()
    const rowsToInsert = result.ideas.map((i: any) => ({
      title: i.title,
      angle: i.angle,
      tags: i.tags || [],
      score: i.score || 0,
      topic: topic
    }))

    const { error: dbError } = await supabase.from('ideas').insert(rowsToInsert)

    if (dbError) {
      console.error('Database insert failed:', dbError.message)
      // 即便数据库报错（比如没登录或 RLS 拦截），我们依然把 AI 结果返回给前端展示
    }

    return NextResponse.json({ ideas: result.ideas || [] })

  } catch (error: any) {
    console.error('API Route Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}