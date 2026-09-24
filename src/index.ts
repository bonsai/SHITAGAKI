import { Mastra } from '@mastra/core';
import { shitagakiWorkflow } from './workflows/shitagakiWorkflow.js';

export const mastra = new Mastra({
  workflows: {
    shitagaki: shitagakiWorkflow,
  },
});

// テスト実行（直接 node src/index.ts したとき）
async function main() {
  const transcript = `
    小学校3年生の冬、父親に連れられて初めてスキー場に行った。
    善光寺の近くの小さなゲレンデで、レンタルの板を履いて父の後を追った。
    転んで泣いたが、父は笑いながら手を貸してくれた。
    あの時の寒さと、父の手の温かさが今でも覚えている。

    20代に入ってから、同僚と北海道のニセコへスキー旅行に行った。
    あの時はもう父とは行かなくなっていた。
    同僚たちと楽しく滑ったが、リフトの上でふと、父のことを思い出した。
    あの善光寺の近くの小さなゲレンデのこと。
  `;

  const workflow = mastra.getWorkflow('shitagaki');
  const run = await workflow.createRun();
  const result = await run.start({ inputData: { transcript } });

  console.log('\n=== Shitagaki Result ===\n');
  console.log(JSON.stringify(result.results?.draft ?? result, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
