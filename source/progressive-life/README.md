# progressive-life

「声から、自分の半生を発見する」。

ここは一つの巨大なアプリではなく、責務ごとに分離された小さな世界の集合として扱う。

## Components

| Component | Responsibility | Agent |
|---|---|---|
| [Voice](voice/) | canonical source | Voice Agent |
| [Episode](episode/) | life-fragment extraction | Episode Agent |
| [Event](event/) | append-only history | Event Agent |
| [Decision](decision/) | interpretation candidates | Decision Agent |
| [Relation](relation/) | relations between entities | Relation Agent |
| [View](view/) | projection for humans | View Agent |
| [Interface](interface/) | boundary to other worlds/providers | Interface Agent |
| [Orchestration](orchestration/) | coordination and automation | Orchestration Agent |

## System documents

- [Concept](docs/concept.md)
- [Entities](docs/entities.md)
- [Data](docs/data.md)
- [Architecture](docs/architecture.md)
- [Interaction](docs/interaction.md)
- [Decision Flow](docs/decision-flow.md)
- [History Model](docs/history.md)
- [Principles](docs/principles.md)
- [Ontology](ontology.yaml)
- [Topology](topology.yaml)

## Core flow

Voice → Episode → Decision / Relation → Human Confirmation → Event → View

history → latest → now → action

Subject → Action → Object

## Boundary

Each component has one responsibility and an agent.md. The component can later become an independent repository/agent without changing the system ontology.

GitHub is Canon. Voice is source, Event is history, Decision is interpretation, and View is projection.
