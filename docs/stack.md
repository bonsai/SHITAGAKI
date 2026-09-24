# SHITAGAKI Stack

## 前提

- ブランド: SHITAGAKI（声で作る半生記）
- エンジン: progressive-life の世界観・データモデル
- AI: Mastra（Agent / Workflow）
- LLM: さくらAI Engine `gpt-oss-120b`

## レイヤー分け

| レイヤー | 候補技術 | 役割 |
|---|---|---|
| Frontend | Next.js (App Router) | PWA、録音UI、Episode Field、本のプレビュー |
| API Glue | Frourio | フロント↔バックの型安全な契約（aspida） |
| API Runtime | Hono | 軽量HTTP、Cloudflare Workers / Deno 対応 |
| Runtime | Deno 2.x | TypeScriptネイティブ、セキュリティ、npm互換 |
| AI Engine | Mastra | Episode抽出 → Relation → Draft のWorkflow |

## 構成案

### A. Node.js 安定構成（推奨：PoC〜本番初期）

```
[Next.js]  ←──aspida──→  [Frourio + Hono (Node.js)]  ←──→  [Mastra (Node.js)]  →  さくらAI Engine
     │                          │                              │
     └─ PWA/録音/Field          └─ 認証/音声アップロード      └─ Workflow実行
```

- **Next.js**: App Router、Server Actionsで簡易APIも兼ねられる
- **Frourio**: Next.jsとHonoバックエンドを型安全に接続
- **Hono**: `/api/*` の軽量エンドポイント。必要に応じてCloudflare Workersへ移行可能
- **Mastra**: Node.js上でWorkflow実行。推論は非同期（Queue or Cron）
- **Deno**: 現段階では使用しない（MastraのDeno互換性が未検証）

### B. Edge / Deno 構成（将来的な理想系）

```
[Next.js]  ←──aspida──→  [Hono (Deno Deploy / Cloudflare Workers)]  ←──→  [Mastra轻型版]  →  さくらAI Engine
```

- **Deno Deploy** または **Cloudflare Workers** でHonoを動かす
- Mastraの軽量実行部分（Workflowエンジン）のみEdgeで動かし、重い推論はQueueに逃がす
- 今はまだMastraのDeno/Edge対応は不確定なため、計画留保

## 推奨：当面は構成A

| 判断基準 | 理由 |
|---|---|
| Mastraの成熟度 | Node.jsが最も安定。Deno/Edge対応は未検証 |
| さくらAI Engine | HTTP呼び出しなので、どのRuntimeでも同じ |
| Frourioの使い所 | Next.js ↔ Honoの型安全な接続に最適 |
| Honoの使い所 | 軽量なため、後からEdgeへ移行しやすい |
| Deno | 現時点では採用見送り。Node.js 22で十分 |

## フロー

```
1. ユーザーがNext.js上でボイスメモを録音
2. 音声はR2/S3に保存。DBにメタデータ記録
3. Mastra Workflow起動（非同期）
   - extract: STT後のtranscript → Episode[]
   - relate: Episode[] → RelationCandidate[]
   - draft: Episode + Relation → Draft（半生記の下書き）
4. ユーザーがNext.jsのField UIでカードを確認・並べ替え
5. 確定後、PDF/電子書籍/KDP用データを生成
```

## 技術バージョン

- Node.js: 22.x LTS
- Next.js: 15.x (App Router)
- Hono: 4.x
- Frourio: 1.x
- Mastra: 1.31.x
- TypeScript: 5.6.x

## Next Actions

1. Next.js + Hono + Frourio の最小構成を立ち上げる
2. Mastra WorkflowをHonoのエンドポイントから呼び出す
3. さくらAI Engineとの接続を本番キーで検証
4. Deno/Edge移行の是非をMastraの対応状況を見て判断
