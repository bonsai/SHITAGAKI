import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { DraftSchema } from '../schemas/episode.js';

const model = openai('gpt-4o-mini', {
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function writeDraft(episodesJson: string, relationsJson: string) {
  const result = await generateObject({
    model,
    schema: DraftSchema,
    prompt: `## Episodes\n${episodesJson}\n\n## Relations\n${relationsJson}`,
    system: `
あなたは、EpisodeとRelationから「半生記の下書き（Shitagaki）」を書くライターです。

入力されたEpisodeとRelationを読み、以下のように下書きを構成してください：

1. **章立てを設計する**: Episodeを時系列またはテーマごとにまとめ、章を作る
2. **各章に見出しをつける**: 簡潔で印象的な見出し
3. **内容はEpisodeのsummaryを接続する形で書く**: AIが創作を加えすぎない。語られた言葉の順序と関係を尊重する
4. **Relationを反映する**: cause-effect なら「だから」、contrast なら「しかし」、sequence なら「次に」など、接続詞で関係を明示する
5. **タイトルは全体を表すものにする**

文体は、語り手の声を大切にした穏やかな文章。完璧さより「語られたままの温度」を優先する。
    `.trim(),
  });
  return result.object;
}
