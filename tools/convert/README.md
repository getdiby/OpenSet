# convert -- Workout Text to OpenSet JSON

This directory contains a self-contained LLM system prompt (`prompt.md`) that converts free-form workout descriptions into valid **OpenSet v1.0** JSON.

## What it does

The prompt instructs any LLM to act as a strict workout-to-JSON converter. Given unstructured text like:

```
Back Squat 5x5 @ 100kg, 3 min rest
Pull-ups 3x8
Plank 3x60s
```

it produces a fully conformant OpenSet v1.0 JSON document with proper blocks, series, exercises, sets, dimensions, and ValueType dimension objects.

## How to use it

1. **Copy** the entire contents of `prompt.md`.
2. **Paste** it as the system prompt (or first message) in any LLM conversation -- ChatGPT, Claude, a local model, or an API call.
3. **Send** your workout text as the user message.
4. The model will respond with raw JSON only, no surrounding prose.

### API example (OpenAI-compatible)

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      { "role": "system", "content": "<contents of prompt.md>" },
      { "role": "user", "content": "Bench 4x8 @ 80kg\nPull-ups 4x10" }
    ]
  }'
```

### What the prompt covers

- Full OpenSet v1.0 document structure (workout, blocks, series, exercises, sets)
- All 10 series execution modes (SEQUENTIAL, CIRCUIT, SUPERSET, AMRAP, etc.)
- Free-form set dimensions — any combination of 21 known dimensions
- All 6 ValueType shapes (fixed, range, min, amrap, max, any)
- The 42 canonical exercise IDs with synonym matching guidance
- Ambiguity handling and unknown exercise fallback rules
- Two worked examples
