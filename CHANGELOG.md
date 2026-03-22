# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Rebuilt the canonical `openset-default` exercise library around 50 broadly recognized starter exercises and updated example documents, docs, and codegen fixtures to match.
- Validator `W003` library-membership warnings now run only when a library is explicitly provided via `validate(document, { library })`.

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
