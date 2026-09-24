import { Workflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { EpisodeSchema, RelationCandidateSchema, DraftSchema } from '../schemas/episode.js';
import { extractEpisodes } from '../agents/episodeAgent.js';
import { findRelations } from '../agents/relationAgent.js';
import { writeDraft } from '../agents/draftAgent.js';

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

const draftStep = createStep({
  id: 'draft',
  description: 'Episode と Relation から下書きを生成する',
  inputSchema: RelationCandidateSchema.array(),
  outputSchema: DraftSchema,
  execute: async ({ inputData, getStepResult }) => {
    const episodes = getStepResult<typeof EpisodeSchema._type[]>('extract');
    const relations = inputData;
    if (!episodes) throw new Error('extract step の結果がありません');
    return await writeDraft(
      JSON.stringify(episodes, null, 2),
      JSON.stringify(relations, null, 2)
    );
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
  .then(draftStep)
  .commit();
