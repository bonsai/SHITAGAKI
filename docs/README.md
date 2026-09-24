# SHITAGAKI

**SHITAGAKI（したがき）**は、記録・素材・出来事・解釈・編集を蓄積し、あとから何度でも組み替えられる下書き基盤です。

完成した文章を最初に決めるのではなく、素材を残し、断片化し、関係を発見し、履歴を積み重ねながら成果物へ投影します。

## Purpose

- 原資料を失わずに残す
- 素材を小さな断片として扱う
- 断片を並べ替え、関係を発見する
- AIによる解釈・候補生成と、人間による確認を分離する
- 編集や確認を履歴として残す
- 同じ素材から複数の文章・ビューを生成する

## Core model

```text
Source → Fragment → Event → Interpretation → Relation → View
                         ↑
                   Human confirmation
```

### Source
録音、メモ、写真、資料などの原資料。原資料そのものは上書きしません。

### Fragment
原資料から切り出した意味のある断片。固定された時系列だけでなく、自由に並べ替えます。

### Event
主体が対象に対して行った操作・変化を記録する履歴。

```text
Subject → Action → Object
```

### Interpretation
素材やイベントから導いた仮説・分類・意味づけ。原資料とは分離して保存します。

### Relation
断片・イベント・人物・場所などの間に見つかった関係。候補と確定を区別します。

### View
履歴と現在状態から生成される文章、カード、一覧、Web表示などの投影です。

## Documents

### Foundation

- [Concept](concept.md)
- [Entities](entities.md)
- [Data](data.md)
- [Data Model](data-model.md)
- [Ontology](ontology.md)
- [Topology](topology.md)
- [Principles](principles.md)

### System

- [Architecture](architecture.md)
- [Interaction](interaction.md)
- [Decision Flow](decision-flow.md)
- [History](history.md)
- [AI](ai.md)
- [Implementation](implementation.md)
- [JSONL Contract](jsonl-contract.md)
- [PRD](prd.md)
- [Cloudflare](cloudflare.md)

### Working models

- [Voice](voice.md)
- [Episode](episode.md)
- [Event](event.md)
- [Decision](decision.md)
- [Relation](relation.md)
- [View](view.md)
- [Episode Intelligence](episode-intelligence.md)

## Component agents

責務を小さな単位に分離し、それぞれを独立したエージェントとして扱える構造です。

- [Voice](voice/) — 原資料を扱う
- [Episode](episode/) — 断片を扱う
- [Event](event/) — 履歴を扱う
- [Decision](decision/) — 解釈・判断候補を扱う
- [Relation](relation/) — 関係を扱う
- [View](view/) — 投影を扱う
- [Interface](interface/) — 外部世界との境界を扱う
- [Orchestration](orchestration/) — 全体を調整する

各コンポーネントには `agent.md` を置き、責務と挙動を局所化します。

## Data model

```text
Source          = canonical material
Transcript      = derived data
Interpretation  = added meaning
Event           = history
View            = projection
```

変換・解釈・編集によって原資料を破壊せず、新しいデータまたはイベントとして積み上げます。

## World model

```text
history → latest → now → action
```

- **history** — 蓄積された履歴
- **latest** — 最新の確定情報
- **now** — 現在の状態
- **action** — 次に行う操作

世界と外部世界の接点は **Interface** として定義し、外部サービスやAIプロバイダは交換可能な実装として扱います。

## Automation

GitHubを変更履歴と設計の基準点として扱い、GitHub Actions / `gh aw` などで収集・変換・検証・公開を自動化します。

```text
record → extract → structure → interpret → confirm → publish
```

## Principles

1. 原資料を守る
2. 履歴を残す
3. 解釈は追加する
4. Viewは投影として扱う
5. AIの提案と人間の確認を分離する
6. 時系列だけを唯一の構造にしない
7. Interfaceの外側は交換可能にする
8. 小さな責務を組み合わせる

SHITAGAKIは完成原稿ではなく、**素材と履歴から何度でも成果物を生成するための下書きシステム**です。
