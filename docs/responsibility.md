# 責務分離 — 声から本へ

## 原則

> **AIは人生を書き換えない。候補を提示し、人間が確認する。**

## フローと責務

```
声（Voice）
  │ 原資料。上書きしない。新しい発話は新しいFragment。
  ▼
[Structurer] 構造化
  │ トークをEpisode（カード）に分解。1イベント=1カード。
  │ 責務：分解精度。漏れなく、重複なく。
  ▼
[Relator] 関係発見
  │ Episode間のRelation候補を提示。
  │ 責務：見落とさない。無理な関係は作らない。
  ▼
[Arranger] 再配置
  │ Episodeを「読ませる順序」に再配置。時系列・テーマ・因果を考慮。
  │ 責務：読者の視点で流れを設計する。語り手の意図を尊重。
  ▼
[Drafter] 文章化
  │ 配置されたEpisodeから文章を生成。
  │ 責務：語り手の声を保つ。創作を加えない。
  ▼
[Editor] 推敲
  │ 文章を整える。接続詞・重複・段落の調整。
  │ 責務：読みやすさを上げる。語りの温度を失わない。
  ▼
[Reader] 提示
  │ 人間が読んで確認する。フィードバックをEventとして保存。
  │ 責務：最終判断は人間。
```

## 各レイヤーの境界

| 境界 | 左（確定） | 右（候補/提案） |
|---|---|---|
| Voice → Episode | 録音された声は不変 | EpisodeはAIが切り出す候補 |
| Episode → Relation | 確認されたEpisodeはEvent | Relationは候補 |
| Relation → Arrange | 確認されたRelationはEvent | 配置順序は候補 |
| Arrange → Draft | 確認された配置はEvent | 文章はProjection |
| Draft → Edit | 編集後の文章はVersion | Editorの変更は追跡可能 |

## データの流れ

| ステップ | 入力 | 出力 |
|---|---|---|
| Structurer | transcript | Episode[] |
| Relator | Episode[] | RelationCandidate[] |
| Arranger | Episode[] + RelationCandidate[] | Arrangement（章立てと順序） |
| Drafter | Episode[] + Arrangement + RelationCandidate[] | Draft |
| Editor | Draft | EditedDraft |
