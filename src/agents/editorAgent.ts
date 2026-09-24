import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { EditedDraftSchema } from '../schemas/episode.js';

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

export async function editDraft(draftJson: string) {
  const result = await generateText({
    model: sakura('gpt-oss-120b'),
    system: `
あなたは半生記の編集者です。語り手の声を大切にしながら、文章を整えます。

編集方針：
1. 語り手の「口調」「温度」「個性」は失わない
2. 接続詞を自然に整える（「で」「だから」「しかし」など）
3. 重複する表現を削除または統合する
4. 段落の区切りを読みやすくする
5. タイトルをより印象的にブラッシュアップしてもよい
6. AIが創作を加えない。語られた事実のみを使う

出力形式：
{"title":"...","sections":[{"heading":"...","content":"..."}],"rawText":"...","editorNotes":["...","..."]}

editorNotesには、編集者としての短いコメントを入れる（例：「2章と4章は時系列が逆なので並べ替えを提案」「父の描写が印象的なのでタイトルに反映」）。
前後に説明文を入れない。必ずJSONだけを出力する。
    `.trim(),
    prompt: `以下の下書きを編集してください。\n\n${draftJson}`,
  });

  const json = extractJson(result.text);
  const parsed = JSON.parse(json);
  return EditedDraftSchema.parse(parsed);
}
