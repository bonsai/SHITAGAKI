import { Workflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { EpisodeSchema, RelationCandidateSchema, DraftSchema, EditedDraftSchema, ArrangementSchema } from '../schemas/episode.js';
import { extractEpisodes } from '../agents/episodeAgent.js';
import { findRelations } from '../agents/relationAgent.js';
import { arrangeEpisodes } from '../agents/arrangerAgent.js';
import { writeDraft } from '../agents/draftAgent.js';
import { editDraft } from '../agents/editorAgent.js';

const extractStep = createStep({
  id: 'extract',
  description: 'transcript から Episode を抽出する',
  inputSchema: z.object({ transcript: z.string() }),
  outputSchema: EpisodeSchema.array(),
  execute: async ({ inputData }) => {
    return await extractEpisodes(inputData.transcript);
  },
});

const relateStep = createStep({
  id: 'relate',
  description: 'Episode 間の Relation 候補を発見する',
  inputSchema: EpisodeSchema.array(),
  outputSchema: RelationCandidateSchema.array(),
  execute: async ({ inputData }) => {
    return await findRelations(JSON.stringify(inputData, null, 2));
  },
});

const arrangeStep = createStep({
  id: 'arrange',
  description: 'Episode を読ませる順序に再配置する',
  inputSchema: RelationCandidateSchema.array(),
  outputSchema: ArrangementSchema,
  execute: async ({ inputData, getStepResult }) => {
    const episodes = getStepResult<typeof EpisodeSchema._type[]>('extract');
    if (!episodes) throw new Error('extract step の結果がありません');
    return await arrangeEpisodes(
      JSON.stringify(episodes, null, 2),
      JSON.stringify(inputData, null, 2)
    );
  },
});

const draftStep = createStep({
  id: 'draft',
  description: '配置された Episode から下書きを生成する',
  inputSchema: ArrangementSchema,
  outputSchema: DraftSchema,
  execute: async ({ inputData, getStepResult }) => {
    const episodes = getStepResult<typeof EpisodeSchema._type[]>('extract');
    const relations = getStepResult<typeof RelationCandidateSchema._type[]>('relate');
    if (!episodes) throw new Error('extract step の結果がありません');
    return await writeDraft(
      JSON.stringify(episodes, null, 2),
      JSON.stringify(inputData, null, 2),
      JSON.stringify(relations ?? [], null, 2)
    );
  },
});

const editStep = createStep({
  id: 'edit',
  description: 'AI編集者が下書きを編集・推敲する',
  inputSchema: DraftSchema,
  outputSchema: EditedDraftSchema,
  execute: async ({ inputData }) => {
    return await editDraft(JSON.stringify(inputData, null, 2));
  },
});

export const shitagakiWorkflow = new Workflow({
  id: 'shitagaki',
  inputSchema: z.object({
    transcript: z.string().describe('音声文字起こしやテキストの原資料'),
  }),
})
  .then(extractStep)
  .then(relateStep)
  .then(arrangeStep)
  .then(draftStep)
  .then(editStep)
  .commit();
