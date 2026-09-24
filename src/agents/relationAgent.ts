import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { RelationCandidateSchema } from '../schemas/episode.js';

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

export async function findRelations(episodesJson: string) {
  const result = await generateText({
    model: sakura('gpt-oss-120b'),
    system: `
あなたは、人生の断片（Episode）同士の関係（Relation）を発見する専門家です。

以下のtypeで関係候補を抽出してください：
same-person, same-place, same-time, cause-effect, contrast, theme, sequence

ルール：
1. すべてのEpisodeの組み合わせをチェックする
2. confidenceは、関係が明確であれば高く、薄ければ低くする
3. descriptionで「なぜこのRelationか」を説明する
4. 必ずJSON配列だけを出力する。前後に説明文を入れない。
5. 出力形式：
[{"fromEpisodeId":"...","toEpisodeId":"...","type":"same-person","description":"...","confidence":0.8}, ...]
    `.trim(),
    prompt: `以下のEpisodeリストからRelation候補を抽出してください。\n\n${episodesJson}`,
  });

  const json = extractJson(result.text);
  const parsed = JSON.parse(json);
  return RelationCandidateSchema.array().parse(parsed);
}
