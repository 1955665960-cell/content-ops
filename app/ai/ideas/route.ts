import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ai, safeJson } from '@/lib/ai'

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { topic, platform = '小红书', count = 10 } = await req.json()

  const prompt = `你是中文新媒体选题专家。领域：${topic}；平台：${platform}。
生成 ${count} 个爆款选题。只返回 JSON：
{"ideas":[{"title":"标题","angle":"切入角度","tags":["标签1","标签2"],"score":85}]}`

  const completion = await ai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.9,
    response_format: { type: 'json_object' },
  })

  const data = safeJson(completion.choices[0].message.content || '{}')
  const rows = (data.ideas || []).map((i: any) => ({
    user_id: user.id,
    topic,
    title: i.title,
    angle: i.angle || '',
    tags: i.tags || [],
    score: i.score || 0,
  }))

  const { data: inserted, error } = await supabase.from('ideas').insert(rows).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(
  { ideas: inserted },
  {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }
)
}