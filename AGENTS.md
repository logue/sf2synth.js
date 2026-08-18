# AGENTS.md

You are an expert in TypeScript, Rsbuild, Rslib, Rstest, and library development. You write maintainable, performant, and accessible code.

## Setup & Overview

- **Build tool**: Rslib (for build library), Rsbuild (for demo site)
- **Linter**: Rslint and Biome
- **Testing**: Rstest
- **Language**: TypeScript 7
- **Package manager**: pnpm (do not use npm or yarn)

**Last updated**: 2026-08-17
**Verified with**: `package.json` in this repository

### Tool Versions

See `package.json` for authoritative dependency versions.

This guide assumes:

- TypeScript 7.0.2 or later
- Rsbuild 2.1.13 or later
- Rslib 0.23.2 or later
- Rstest 0.11.8 or later

**If you encounter version-related issues, check `package.json` directly—it is the source of truth.**

### Dependency Management

- `minimumReleaseAge: 0` is set in `pnpm-workspace.yaml` to prevent unpredictable auto-injection of `minimumReleaseAgeExclude`
- This ensures version resolution is deterministic and reproducible across projects

### VS Code Setup

Recommended extensions are listed in `.vscode/extensions.json`.
Formatter and linter are configured in `.vscode/settings.json`:

- Default formatter: **Biome**
- Format on save: enabled
- Auto-fix on save: Rslint

When you open the project in VS Code, you'll be prompted to install recommended extensions.

## Project

### Project Structure

This project uses two complementary build tools:

- **Rslib** - Builds the library for distribution (ESM, CJS, etc.)
  - Command: `pnpm run build`
  - Output: `dist/` (published to npm)
  - Configuration: `rslib.config.ts`, `tsconfig.rslib.json`
- **Rsbuild** - Builds the demo and documentation site
  - Command: `pnpm run build:docs`
  - Output: `docs/` (for manual testing and validation)
  - Configuration: `rsbuild.config.ts`, `tsconfig.rsbuild.json`
  - Purpose: Interactive demo to verify library functionality during development

#### TypeScript Configuration Strategy

TypeScript configurations are organized by **tool name, not by purpose**:

- `tsconfig.rslib.json` - Library bundling configuration
- `tsconfig.rsbuild.json` - Demo/documentation site configuration
- `tsconfig.rstest.json` - Testing configuration (if applicable)

This approach eliminates conditional branching based on build purpose.
Instead, each tool has its own explicit configuration namespace,
making the build pipeline transparent and maintainable.

### Development Workflow

- `pnpm run dev` - Watch mode for library
- `pnpm run dev:docs` - Local dev server for demo site with hot reload

## Commands

- `pnpm run build` - Build the library for production
- `pnpm run build:docs` - Build the demo site
- `pnpm run dev` - Watch mode for library
- `pnpm run dev:docs` - Dev server with hot reload
- `pnpm run preview` - Preview the built demo site
- `pnpm run test` - Run tests
- `pnpm run test:watch` - Watch mode for tests
- `pnpm run lint` - Lint and format all code (Biome + Rslint)
- `pnpm run inspect` - Inspect final rslib config
- `pnpm run inspect:docs` - Inspect final rsbuild config
- `pnpm run clean` - Remove build artifacts
- `pnpm run clean:hard` - Remove build artifact and build caches.

## Documentation

- Rslib: <https://rslib.rs/llms.txt>
- Rsbuild: <https://rsbuild.rs/llms.txt>
- Rslint: <https://rslint.rs/llms.txt>
- Rstest: <https://rstest.rs/llms.txt>

## Code Style

### TypeScript Rules

- **No `any`** - use `unknown` and narrow with type guards.
- **Explicit return types** on exported functions.
- **Underscore prefix** for intentionally unused variables: `_value`, `_error`.
- **Array type syntax**: `string[]` not `Array<string>`.
- **Generic constructors**: left-hand side style - `const map: Map<string, User> = new Map()`.
- **Do not ignore TypeScript errors**
- **Do not use `@ts-ignore` without good reason**

### Directory Structure & File Organization

- **`types/`** — Type-only definitions:
  - Type aliases and union types (preferred over enums)
  - Interface-like object shapes
  - Generic types
  - Default values paired with type definitions (see Type Pattern below)
  - `.d.ts`: Type aliases, interfaces, generic types (no values)
  - `.ts`: Type definitions paired with default values or constants
- **`interfaces/`** — Use only when:
  - Multiple inheritance levels needed
  - Clear contract inheritance matters

### Type Definition Pattern

Prefer `type` over `interface` for most cases.

```ts
// types/Options.d.ts
export type Options = {
  someText: string;
  someNumber: number;
};
```

Consolidate type and default values together:

```ts
// types/Options.ts
import type { Options } from "./Options.d.ts";

/** Default configuration */
export const Options: Options = {
  someText: "white",
  someNumber: 1,
};
```

**Default value naming:** The variable name should match the type name (`import { Options }`).

**Why `type` over `interface`:**

- Tree-shaking friendly (especially for unions)
- Single import point for type and default
- Default values are visibly paired
- Cleaner for simple contracts

**Use `interface` when:**

- Deep inheritance hierarchy (3+ levels)
- Multiple implementations needed
- Inheritance clarity is paramount

### Union Types Over Enums

Avoid `enum`. Use union types:

```ts
export type NoiseType = 'blue' | 'brown' | 'green' | ...;
export const noiseTypes: NoiseType[] = ['blue', 'brown', ...];
export const NoiseType: Record<NoiseType, NoiseGenerator> = { blue, brown, ... };
```

### Do not use `null` except when using JSON

- **strict**: Except for JSON round trips, `null` is not allowed.
- **undefined only**: A unified expression for the state of "no value"

#### Pattern

❌ Do not

```ts
function process(str: string | null) {}
function handler(data: { value: string | null }) {}
```

✓ Recommend

```ts
function process(str?: string) {}
function handler(data: { value?: string }) {}
```

#### Exception: JSON transformation boundary layer only

```typescript
// Immediately after JSON parsing: Normalize to allow null values
const apiData = JSON.parse(json);
const normalized = {
  value: apiData.value ?? undefined,
};

// The following is based on undefined
process(normalized.value);
```

**Why do not use `null`:**

1. SQL normalization (eliminates ambiguity for `0`, `''`, and `null`)
2. TypeScript design philosophy (`Partial` is based on `undefined`)
3. _Type specificity_ at library boundaries

## Formatting

- Use Biome
- Use Rslint for linting
- **Indentation**: Two spaces
- **Semicolons**: Use semicolons
- **Quotes**: Single quotes

### Naming Conventions

- **Types/Interfaces**: `PascalCase` (e.g., `RspackOptions`)
- **Classes**: `PascalCase` (e.g., `Compiler`)
- **Functions**: `camelCase` (e.g., `createCompiler`)
- **Variables**: `camelCase` (e.g., `compiler`)
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Files**: `camelCase.ts` or `PascalCase.ts` (match main export)

### Async/Await Patterns

- Use `async/await` over promises
- Handle errors with try/catch
- Use `Promise.all` for parallel operations

### Facade Pattern: Hiding Complexity

This project employs the **Facade pattern**. In a library, the public API should be simple and focused, while internal complexity should be intentionally hidden.

- Users interact with high-level operations (read/write files, transform data)
- Implementation details (binary parsing, encoding, version handling) are internal
- This reduces cognitive load on users and provides stable contracts

Example: [`symbol-art-parser`](https://github.com/logue/symbol-art-parser) exposes only `.sar` ↔ JSON conversions, hiding binary protocol details.

## Patterns & Best Practices

### Code Documentation & Comments

- Use `//` for single-line
- Use `/* */` for multi-line
- All exported functions, types, interfaces, and global variables must have JSDoc
- Non-exported implementation details can skip JSDoc
- Use `@param`, `@returns`, `@example`, `@throws` as needed
- Explain "why" not "what"

### Error Handling

- **Use standard exceptions** (`TypeError`, `RangeError`, `Error`) for input validation and simple errors
  - `TypeError`: When argument type is incorrect
  - `RangeError`: When argument value is out of valid range
  - `Error`: For unexpected/unrecoverable situations

- **Define custom exceptions** only when:
  - The error has actionable context (error codes, recovery suggestions)
  - Downstream code needs to catch and handle specific failures
  - Multiple error conditions require differentiation

### API Design Principle

Prioritize the external API clarity over internal implementation patterns.
Hidden complexity is acceptable if it provides users with simple, intuitive interfaces.

This may include using the same identifier for both type and value when it improves ergonomics.

## Testing

This project uses **Rstest** for testing.

### Running Tests

- `pnpm run test` - Run all tests
- `pnpm run test:watch` - Run tests in watch mode

### Test Structure & Naming

Tests are co-located with source code in `__tests__/` directories:

```plain
src/
  components/
    Button.ts
    __tests__/
      Button.spec.ts
  utils/
    helpers.ts
    __tests__/
      helpers.spec.ts
```

Naming convention:

- Test files: `[SourceFile].spec.ts`
- Co-location makes tests easy to find and maintain

### Test Code Style

- Use descriptive test names
- Group related tests with `describe`
- Use `it` or `test` for individual cases
- Clean up resources after tests (`afterEach`, `afterAll`)
- Follow the same TypeScript rules as non-test code

## Markdown Generation

When generating markdown (documentation, AGENTS.md, etc.):

- **Preserve code formatting**: `__` should NOT be converted to bold
  within inline code or code blocks
- Use backticks for inline code: `` `__tests__` ``
- Code blocks will preserve literal `__` as-is
- This applies to Node.js globals (`__dirname`, `__filename`)
  and directory names (`__tests__`, `__mocks__`, etc.)

Example:

- ✓ Tests in `` `__tests__` `` directories
- ✗ Tests in `**tests**` directories (incorrect)
