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

  const { topic, platform = '小红书', tone = '真诚分享' } = await req.json()

  const prompt = `你是中文新媒体主编。为「${platform}」写一篇内容。
主题：${topic}
风格：${tone}
要求：给 3 个标题、分段正文、5-10 个标签、2-3 条发布建议。
只返回 JSON：
{"titles":["..."],"body":"...","tags":["..."],"tips":["..."]}`

  const completion = await ai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.85,
    response_format: { type: 'json_object' },
  })

  const result = safeJson(completion.choices[0].message.content || '{}')

  const { data, error } = await supabase
    .from('contents')
    .insert({
      user_id: user.id,
      title: result.titles?.[0] || topic,
      platform,
      body: result.body || '',
      tags: result.tags || [],
      status: 'draft',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(
  { content: data, raw: result },
  {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }
)
}