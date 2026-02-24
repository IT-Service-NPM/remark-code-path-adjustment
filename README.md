# @it-service-npm/remark-code-path-adjustment Remark plugin

[![GitHub release][github-release]][github-release-url]
[![NPM release][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]

[![CI Status][build]][build-url]
[![Tests Results][tests]][tests-url]
[![Coverage status][coverage]][coverage-url]

[![Semantic Versioning](https://img.shields.io/badge/Semantic%20Versioning-v2.0.0-green.svg?logo=semver)](https://semver.org/lang/ru/spec/v2.0.0.html)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-v1.0.0-yellow.svg?logo=git)](https://conventionalcommits.org)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

[![VS Code](https://img.shields.io/badge/Visual_Studio_Code-0078D4?logo=visual%20studio%20code)](https://code.visualstudio.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-333333.svg?logo=typescript)](http://www.typescriptlang.org/)
[![EditorConfig](https://img.shields.io/badge/EditorConfig-333333.svg?logo=editorconfig)](https://editorconfig.org)
[![ESLint](https://img.shields.io/badge/ESLint-3A33D1?logo=eslint)](https://eslint.org)

[github-release]: https://img.shields.io/github/v/release/IT-Service-NPM/remark-code-path-adjustment.svg?sort=semver&logo=github

[github-release-url]: https://github.com/IT-Service-NPM/remark-code-path-adjustment/releases

[npm]: https://img.shields.io/npm/v/@it-service-npm/remark-code-path-adjustment.svg?logo=npm

[npm-url]: https://www.npmjs.com/package/@it-service-npm/remark-code-path-adjustment

[node]: https://img.shields.io/node/v/@it-service-npm/remark-code-path-adjustment.svg

[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@it-service-npm/remark-code-path-adjustment

[deps-url]: https://libraries.io/npm/@it-service-npm%2Fremark-code-path-adjustment

[size]: https://packagephobia.com/badge?p=@it-service-npm/remark-code-path-adjustment

[size-url]: https://packagephobia.com/result?p=@it-service-npm/remark-code-path-adjustment

[build]: https://github.com/IT-Service-NPM/remark-code-path-adjustment/actions/workflows/ci.yml/badge.svg?branch=main

[build-url]: https://github.com/IT-Service-NPM/remark-code-path-adjustment/actions/workflows/ci.yml

[tests]: https://img.shields.io/endpoint?logo=vitest&url=https%3A%2F%2Fgist.githubusercontent.com%2Fsergey-s-betke%2Fd70e4de09a490afc9fb7a737363b231a%2Fraw%2Fremark-code-path-adjustment-junit-tests.json

[tests-url]: https://github.com/IT-Service-NPM/remark-code-path-adjustment/actions/workflows/ci.yml

[coverage]: https://coveralls.io/repos/github/IT-Service-NPM/remark-code-path-adjustment/badge.svg?branch=main

[coverage-url]: https://coveralls.io/github/IT-Service-NPM/remark-code-path-adjustment?branch=main

This Remark plugin helps to adjust code meta `file`,
ensuring paths remain accurate even after file relocations or inclusions.

When `processor.data().filePathChanges` is set,
this plugin adjusts all relative paths
for code
to ensure they are accurate.

## Contents

- [@it-service-npm/remark-code-path-adjustment Remark plugin](#it-service-npmremark-code-path-adjustment-remark-plugin)
  - [Contents](#contents)
  - [Install](#install)
  - [Examples](#examples)
    - [Updating relative paths for code](#updating-relative-paths-forcode)
  - [API](#api)
  - [License](#license)

## Install

```sh
npm install --save-dev @it-service-npm/remark-code-path-adjustment
```

## Examples

### Updating relative paths for code

When `processor.data().filePathChanges` is set,
this plugin adjusts all relative paths
for code
to ensure they are accurate.

```typescript file=test/examples/01/example.ts
import { remark } from 'remark';
import * as vFile from 'to-vfile';
import {
  remarkRelativeCodePathsAdjustment
} from '@it-service-npm/remark-code-path-adjustment';
import type { VFile } from 'vfile';

export async function remarkDirectiveUsingExample(
  filePath: string
): Promise<VFile> {
  return remark()
    .data({
      filePathChanges: {
        destinationPath: './fixtures/'
      }
    })
    .use(remarkRelativeCodePathsAdjustment)
    .process(await vFile.read(filePath));
};

```

Source files:

included.md:

````markdown file=test/examples/01/fixtures/subfolder1/included.md
Hello. I am the included. Test for code file path rebasing:

```typescript file=../../example.ts
import { remark } from 'remark';
import * as vFile from 'to-vfile';
import remarkDirective from 'remark-directive';
import { remarkInclude } from '@it-service-npm/remark-include';
import type { VFile } from 'vfile';

export async function remarkDirectiveUsingExample(
  filePath: string
): Promise<VFile> {
  return remark()
    .use(remarkDirective)
    .use(remarkInclude)
    .process(await vFile.read(filePath));
};

```

Code with file path with spaces and lines range:

```typescript file=code\ with\ spaces.ts#L11-L15
  return remark()
    .use(remarkDirective)
    .use([codeImport])
    .use(remarkInclude)
    .process(await vFile.read(filePath));
```

And code without file attribute:

```typescript
import { remark } from 'remark';
import * as vFile from 'to-vfile';
import remarkDirective from 'remark-directive';
import { remarkInclude } from '@it-service-npm/remark-include';
import type { VFile } from 'vfile';
```

````

Remark output:

````markdown file=test/examples/01/fixtures/output.md
Hello. I am the included. Test for code file path rebasing:

```typescript file=../example.ts
import { remark } from 'remark';
import * as vFile from 'to-vfile';
import remarkDirective from 'remark-directive';
import { remarkInclude } from '@it-service-npm/remark-include';
import type { VFile } from 'vfile';

export async function remarkDirectiveUsingExample(
  filePath: string
): Promise<VFile> {
  return remark()
    .use(remarkDirective)
    .use(remarkInclude)
    .process(await vFile.read(filePath));
};

```

Code with file path with spaces and lines range:

```typescript file=subfolder1/code\ with\ spaces.ts#L11-L15
  return remark()
    .use(remarkDirective)
    .use([codeImport])
    .use(remarkInclude)
    .process(await vFile.read(filePath));
```

And code without file attribute:

```typescript
import { remark } from 'remark';
import * as vFile from 'to-vfile';
import remarkDirective from 'remark-directive';
import { remarkInclude } from '@it-service-npm/remark-include';
import type { VFile } from 'vfile';
```

````

## API

Please, read the [API reference](/docs/index.md).

## License

[MIT](LICENSE) © [Sergei S. Betke](https://github.com/sergey-s-betke)
