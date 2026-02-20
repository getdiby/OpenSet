# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-02-20

### Added

- OpenSet v1.0 specification
- Document types: `workout`, `program`, `workout_library`
- JSON Schemas: `openset.schema.json`, `exercise-library.schema.json`, `workout-library.schema.json`
- Vocabulary files: 21 dimensions, 6 value types
- Canonical exercise library with 42 exercises (`openset-default.json`)
- `@openset/types` — TypeScript type definitions
- `@openset/validator` — CLI and programmatic validator
  - 15 error rules (E001–E015)
  - 10 warning rules (W001–W010)
- `@openset/codegen` — Fluent TypeScript builder for documents
- 7 example documents (strength, conditioning, endurance, mixed, program, workout library)
- LLM conversion prompt for unstructured text to OpenSet JSON
- Docusaurus documentation website
