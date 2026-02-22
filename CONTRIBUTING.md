# Contributing to OpenSet

Thank you for considering contributing to OpenSet. This guide covers how to set up the project, run tests, and propose changes to the spec.

## Development Setup

```bash
git clone https://github.com/getdiby/openset.git
cd openset
npm install
npm run build
npm test
```

**Requirements:** Node.js >= 20

## Project Structure

- `spec/v1/` — Specification files (schemas, vocabulary, exercise library)
- `packages/typescript-types/` — `@openset/types` npm package
- `packages/validator/` — `@openset/validator` npm package
- `examples/` — Example OpenSet documents
- `tools/convert/` — LLM conversion prompt
- `website/` — Documentation website (Docusaurus)

## Running Tests

```bash
# Run all tests
npm test

# Run validator tests in watch mode
npm run test:watch -w @openset/validator

# Validate example files
node packages/validator/dist/cli.js validate examples/*.json --summary
```

## Adding an Exercise to the Library

1. Edit `spec/v1/libraries/openset-default.json`
2. Add a new exercise object with:
   - A unique `snake_case` `id`
   - A human-readable `name`
   - At least one valid `common_dimensions` entry (e.g., `[["reps", "load"]]`)
   - As many optional fields as applicable (`body_part`, `category`, `mechanic`, `laterality`, `level`, `equipment`, `target_muscles`, etc.)
3. Update the exercise map in `packages/validator/src/index.ts`
4. Run tests to verify: `npm test`
5. Open a PR

**Bar for inclusion:** The exercise must appear across multiple sports or coaching contexts. Sport-specific or equipment-specific variants belong in application-level extensions.

## Proposing a New Dimension

Open an issue with:

- The proposed dimension name (snake_case)
- Unit(s)
- Allowed value types
- At least 3 real-world examples from different sports that need this dimension
- Why it cannot be expressed with existing dimensions

## Proposing a New Execution Mode

Open an issue with:

- The proposed mode name (UPPER_CASE)
- How it differs semantically from existing modes
- Examples and the rendering expectation for a client

## Pull Request Guidelines

- One logical change per PR
- Include tests for any new validation rules
- Ensure `npm test` passes
- Update relevant documentation
- Follow existing code style (2-space indentation, no trailing whitespace)

## Code of Conduct

Be respectful and constructive. We follow a standard contributor code of conduct.

## Questions and Support

For general contributor questions, email `hello@openset.dev`.

For security issues, do not open a public issue. See `SECURITY.md` and report privately to `security@openset.dev`.
