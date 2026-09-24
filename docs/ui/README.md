# UI

SHITAGAKI's primary UI is a **floating text fragment field**.

The interface does not force fragments into a fixed timeline. Text fragments drift in a spatial canvas, and their position and proximity can become material for human editing and relation discovery.

## Interaction

- fragments float slowly
- hover reveals focus
- click selects a fragment
- drag changes its position
- nearby fragments suggest a relation
- selected fragments can be grouped
- source/audio metadata can be opened without changing the source

## Principle

The UI is a projection. Moving a fragment is an editing action; it should become an Event rather than silently rewriting canonical source data.

```text
fragment → spatial field
             ↓
       human arrangement
             ↓
       relation candidate
             ↓
             Event
```
