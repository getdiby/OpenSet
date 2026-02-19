# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-19

### Added

- OpenSet v1.0 specification
- JSON Schema for session and program documents (`openset.schema.json`)
- JSON Schema for exercise libraries (`exercise-library.schema.json`)
- Vocabulary files: value types, dimensions, execution types
- Canonical exercise library with 42 exercises (`openset-default.json`)
- `@openset/types` — TypeScript type definitions package
- `@openset/validator` — Validator with CLI and programmatic API
  - 13 error rules (E001–E013)
  - 9 warning rules (W001–W009)
- 6 example documents (strength, conditioning, endurance, mixed, program)
- LLM conversion prompt for unstructured text to OpenSet JSON
- Docusaurus documentation website
