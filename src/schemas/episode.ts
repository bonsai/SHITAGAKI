import { z } from 'zod';

export const EpisodeSchema = z.object({
  id: z.string().describe('Episodeの一意なID（ulidまたは短いランダム文字列）'),
  title: z.string().describe('Episodeの短いタイトル（10〜30字程度）'),
  summary: z.string().describe('内容の要約（50〜200字程度）'),
  people: z.array(z.string()).describe('文中に登場した人物の名前'),
  places: z.array(z.string()).describe('文中に登場した場所'),
  timeHint: z.string().describe('時期の手がかり（例：「小学3年生の冬」「20代前半」）').optional(),
  sourceVoiceRef: z.string().describe('元になった音声やテキストの参照ID').optional(),
  confidence: z.number().min(0).max(1).describe('情報の確信度'),
});

export type Episode = z.infer<typeof EpisodeSchema>;

export const RelationTypeSchema = z.enum([
  'same-person',
  'same-place',
  'same-time',
  'cause-effect',
  'contrast',
  'theme',
  'sequence',
]);

export const RelationCandidateSchema = z.object({
  fromEpisodeId: z.string(),
  toEpisodeId: z.string(),
  type: RelationTypeSchema,
  description: z.string().describe('なぜこのRelationがあるかの説明'),
  confidence: z.number().min(0).max(1),
});

export type RelationCandidate = z.infer<typeof RelationCandidateSchema>;

export const DraftSchema = z.object({
  title: z.string().describe('下書きのタイトル'),
  sections: z.array(
    z.object({
      heading: z.string(),
      content: z.string(),
    })
  ).describe('章立てされた下書きのセクション'),
  rawText: z.string().describe('プレーンテキスト版'),
});

export type Draft = z.infer<typeof DraftSchema>;

export const ArrangementSchema = z.object({
  sections: z.array(
    z.object({
      title: z.string().describe('章のタイトル'),
      episodeIds: z.array(z.string()).describe('含めるEpisodeのIDリスト'),
      reason: z.string().describe('なぜこの順序・配置か'),
    })
  ).describe('読ませる順序に再配置された章立て'),
  overallFlow: z.string().describe('全体の流れの説明'),
});

export type Arrangement = z.infer<typeof ArrangementSchema>;

export const EditedDraftSchema = DraftSchema.extend({
  editorNotes: z.array(z.string()).describe('編集者からのコメント・提案'),
});

export type EditedDraft = z.infer<typeof EditedDraftSchema>;
