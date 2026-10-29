import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { topic } = await req.json()
    const apiKey = process.env.DEEPSEEK_API_KEY

    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not set in Vercel')
    }

    // 直接用 fetch 请求，不走 SDK
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
    
    if (data.error) {
      throw new Error(data.error.message || 'DeepSeek API error')
    }

    const result = JSON.parse(data.choices[0].message.content)
    return NextResponse.json({ ideas: result.ideas || [] })

  } catch (error: any) {
    console.error('API Route Error:', error.message) // 这样能在 Vercel 日志里看到真实报错
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}