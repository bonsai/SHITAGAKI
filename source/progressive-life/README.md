# progressive-life

**声から、自分の半生を発見する。**

progressive-life は、人生を時系列に並べて記録するためのWebではない。
声で語られた断片を **Episode** として保存し、互いの関係を発見しながら、
どこからでも読める「無限編集」の半生記をつくる。

## Concept

> 半生記を語る。語ったことをつなげる。つながるほど、自分の人生が見えてくる。

Episode は固定された年表の一点ではなく、Episode Field に浮かぶ断片。
読者も語り手も同じUIを使い、語り手にはマイクが追加される。

- **Voice** — 原資料。録音された声を失わない
- **Episode** — 声から切り出された人生の断片
- **Event** — 世界で起きた操作・変化の履歴
- **Decision** — AIによる構造化された判断
- **Relation** — Episode同士の関係
- **View** — 履歴・判断から生成される現在の表示

AIは人生を書き換えない。候補となる関係や解釈を提案し、人間が確認した結果だけを新しいEventとして残す。

## World Model

history → latest → now → action

### SVO

Subject → Action → Object

## Architecture

progressive-life = GitHub Canon + AW + Jev + View + replaceable Providers

| Provider | Role |
|---|---|
| GitHub | Canon / History / Source |
| GitHub Actions / gh aw | Operation / Automation |
| Jev | Structured Decision |
| GitHub Pages | Legacy / Optional Static View |
| Cloudflare Workers | API / Interface / Public View |
| Cloudflare D1 | Current State |
| Cloudflare R2 | Audio / Binary Artifact |
| Vercel | Alternate API / Runtime |
| Surge | Prototype View |

現在の公開View: https://progressive-life.vonsai-apps.workers.dev

## Data

原資料と派生データを分離する。

Voice = canonical source / Transcript = derived / Decision = interpretation / Event = history / View = projection

音声は上書きしない。新しく吹き込んだ声は新しいFragment / Episodeとして扱う。

## Interaction

Episode Field は固定されたTimelineではない。

- Episodeを自由に配置する
- Episodeを別のEpisodeへ運ぶ
- 近づけることで関係を表現する
- AIは関係候補を発見する
- 人間が確認する
- 確認結果をEventとして保存する

## Decision Flow

Human Action → Event → Jev → Candidate Relation → Human Confirmation → New Event → View

## Ontology / Topology

- **Ontology** = 何が存在し、それは何か
- **Topology** = それらがどう接続し、どう流れるか

## Principles

1. Voice is source
2. History is append-oriented
3. Interpretation is additive
4. View is projection
5. Human confirms
6. No fixed beginning or end
7. Providers are replaceable
8. GitHub is Canon
