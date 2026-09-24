import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { ArrangementSchema } from '../schemas/episode.js';

const sakura = createOpenAI({
  baseURL: 'https://api.ai.sakura.ad.jp/v1',
  apiKey: process.env.SAKURA_API_KEY,
});

function extractJson(text: string): string {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }
  throw new Error('JSONが見つかりませんでした');
}

export async function arrangeEpisodes(episodesJson: string, relationsJson: string) {
  const result = await generateText({
    model: sakura('gpt-oss-120b'),
    system: `
あなたは半生記の構成設計者です。EpisodeとRelationを読み、「読ませる順序」に再配置します。

設計方針：
1. 時系列で並べる場合と、テーマでまとめる場合を判断する
2. 読者の興味を引くオープニングを考える
3. クライマックスまたはまとめの配置を考える
4. 原因と結果が連続するようにする
5. 同じ人物や場所のEpisodeを近くに配置して深掘りできるようにする
6. 語り手の意図を尊重する。AIが勝手に「ドラマチックに」しない

出力形式：
{"sections":[{"title":"章タイトル","episodeIds":["id1","id2"],"reason":"なぜこの配置か"}],"overallFlow":"全体の流れの説明"}

前後に説明文を入れない。必ずJSONだけを出力する。
    `.trim(),
    prompt: `## Episodes\n${episodesJson}\n\n## Relations\n${relationsJson}\n\n上記から読ませる構成を設計してください。`,
  });

  const json = extractJson(result.text);
  const parsed = JSON.parse(json);
  return ArrangementSchema.parse(parsed);
}
