import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { EpisodeSchema } from '../schemas/episode.js';

const sakura = createOpenAI({
  baseURL: 'https://api.ai.sakura.ad.jp/v1',
  apiKey: process.env.SAKURA_API_KEY,
});

function extractJson(text: string): string {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }
  throw new Error('JSONが見つかりませんでした');
}

export async function extractEpisodes(transcript: string) {
  const result = await generateText({
    model: sakura('gpt-oss-120b'),
    system: `
あなたは、語られた声や文章から「人生の断片（Episode）」を抽出する専門家です。

ルール：
1. 1つの出来事・思い出・主題 = 1 Episode として分離する
2. 各Episodeには short title（10〜30字）、summary（50〜200字）、people（人物）、places（場所）、timeHint（時期）、confidence（0〜1）を含める
3. 複数のEpisodeが含まれていれば、それぞれを抽出する
4. 必ずJSON配列だけを出力する。前後に説明文を入れない。
5. 出力形式：
[{"id":"...","title":"...","summary":"...","people":["..."],"places":["..."],"timeHint":"...","confidence":0.9}, ...]
    `.trim(),
    prompt: `以下のtranscriptからEpisodeを抽出してください。\n\n${transcript}`,
  });

  const json = extractJson(result.text);
  const parsed = JSON.parse(json);
  return EpisodeSchema.array().parse(parsed);
}
