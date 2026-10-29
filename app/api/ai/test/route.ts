import { NextResponse } from 'next/server'
import { ai } from '@/lib/ai'

export async function POST(req: Request) {
  try {
    const { topic } = await req.json()
    const completion = await ai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: `生成5个关于${topic}的选题，只返回JSON格式：{"ideas":[{"title":"标题","angle":"角度"}]}` }],
      response_format: { type: 'json_object' },
    })
    return NextResponse.json(JSON.parse(completion.choices[0].message.content || '{}'))
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}