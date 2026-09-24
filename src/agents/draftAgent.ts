import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { DraftSchema } from '../schemas/episode.js';

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

export async function writeDraft(episodesJson: string, arrangementJson: string, relationsJson: string) {
  const result = await generateText({
    model: sakura('gpt-oss-120b'),
    system: `
あなたは、Episodeと構成設計から「半生記の下書き（Shitagaki）」を書くライターです。

ルール：
1. Arrangement（章立て）に従って文章を構成する
2. 各章の見出しはArrangementのtitleを使う
3. 章内のEpisodeをsummaryを接続する形で書く
4. Relationを接続詞で反映する（cause-effect→「だから」、contrast→「しかし」、sequence→「次に」）
5. 語り手の声を大切にする。完璧さより「語られたままの温度」を優先
6. rawTextには全体のプレーンテキストを入れる

出力形式：
{"title":"本のタイトル","sections":[{"heading":"章見出し","content":"章の内容"}],"rawText":"全文"}
前後に説明文を入れない。必ずJSONだけを出力する。
    `.trim(),
    prompt: `## Episodes\n${episodesJson}\n\n## Arrangement\n${arrangementJson}\n\n## Relations\n${relationsJson}\n\n上記から下書きを書いてください。`,
  });

  const json = extractJson(result.text);
  const parsed = JSON.parse(json);
  return DraftSchema.parse(parsed);
}
