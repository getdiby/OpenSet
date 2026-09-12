# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-09-12

### Added

- **`media.animations[]`** on exercises, workout-library entries and prescription documents, beside `photos` and `videos`. An animation is a looping demonstration of the movement: `url` and `label` required, `format`, `fps` and `loop` optional.
- **Localized text.** `name`, `description` and `aliases` accept either the plain form or a map keyed by BCP 47 locale code. Both forms are valid, so no existing document changes. `@diby/openset-types` exports `LocalizedText`, `LocalizedTextList`, `resolveText` and `resolveTextList`, which read either form and fall back from `pt-BR` to `pt` to `en`.
- **A validation path for `exercise_library` documents.** `validate()` had none: a library fell through to the prescription checks and was reported as a workout missing its `blocks`. It now checks required fields, snake_case and unique ids, the shape of every localized field, and whether `progressions` / `regressions` / `variations` resolve inside the library.
- Error rules `E016` (localized field has the wrong shape), `E017` (locale map with no entries), `E018` (key that is not a language tag); warnings `W011` (locale map without `en`), `W012` (easier / harder / similar link that leaves the library).
- `examples/exercise-library-localized.json` — two exercises, one carrying animations and four languages.
- A recommended muscle vocabulary in `spec/v1/README.md`: 5 body parts, 28 muscle terms and 13 filter groups, with the older word each term covers. Documented, not enforced — `target_muscles` and `synergist_muscles` stay free text.

### Changed

- `exercise-library.schema.json` and `workout-library.schema.json` pinned `openset_version` to the literal `"1.0"`, so a 1.1 or 1.2 library could not declare its own version. Both now accept `^1\.[0-9]+$`, matching the other schemas.
- The validator knows versions 1.0, 1.1 and 1.2; a 1.1 document no longer draws the `W010` "newer than this validator" warning.
- Rebuilt the canonical `openset-default` exercise library around 50 broadly recognized starter exercises and updated example documents, docs, and codegen fixtures to match. *(Committed in March, released here.)*
- Validator `W003` library-membership warnings now run only when a library is explicitly provided via `validate(document, { library })`. *(Committed in March, released here.)*

### Unchanged

- `spec/v1/libraries/openset-default.json` keeps its 50 exercises and their existing muscle words. The vocabulary table above is a mapping, not a migration.

### Published packages

- `@diby/openset-types@1.2.0`
- `@diby/openset-validator@1.2.0`
- `@diby/openset-codegen@1.2.0`

## [1.1.0] - 2025-03-22

### Added

- Prescription `workout` and `program` documents: optional `media` field (`videos` / `photos`), same structure as exercise and workout-library entries (`openset.schema.json`, TypeScript types, codegen builders).

### Changed

- **npm package name:** fluent builder is published as `@diby/openset-codegen` (formerly `@openset/codegen`, which could not be published without an `@openset` org on npm). Update installs and imports accordingly.

### Published packages

- `@diby/openset-types@1.1.0`
- `@diby/openset-codegen@1.1.0`
- `@diby/openset-validator@1.1.0` (version alignment; no validator logic change for `media`)

## [1.0.0] - 2026-02-20

### Added

- OpenSet v1.0 specification
- Document types: `workout`, `program`, `workout_library`
- JSON Schemas: `openset.schema.json`, `exercise-library.schema.json`, `workout-library.schema.json`
- Vocabulary files: 21 dimensions, 6 value types
- Canonical exercise library with 50 exercises (`openset-default.json`)
- `@diby/openset-types` — TypeScript type definitions
- `@diby/openset-validator` — CLI and programmatic validator
  - 15 error rules (E001–E015)
  - 10 warning rules (W001–W010)
- `@diby/openset-codegen` — Fluent TypeScript builder for documents
- 7 example documents (strength, conditioning, endurance, mixed, program, workout library)
- LLM conversion prompt for unstructured text to OpenSet JSON
- Docusaurus documentation website
