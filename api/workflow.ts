import type { VercelRequest, VercelResponse } from '@vercel/node';
import { mastra } from '../src/index.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transcript } = req.body || {};
  if (!transcript || typeof transcript !== 'string') {
    return res.status(400).json({ error: 'transcript is required' });
  }

  try {
    const workflow = mastra.getWorkflow('shitagaki');
    const run = await workflow.createRun();
    const result = await run.start({ inputData: { transcript } });

    const finalDraft = (result.results as any)?.edit ?? result.results;
    return res.status(200).json({
      status: result.status,
      draft: finalDraft,
      stepExecutionPath: result.stepExecutionPath,
    });
  } catch (err: any) {
    console.error('workflow error:', err);
    return res.status(500).json({ error: err.message });
  }
}
