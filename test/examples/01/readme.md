# Updating relative paths for code

When `processor.data().filePathChanges` is set,
this plugin adjusts all relative paths
for code
to ensure they are accurate.

```typescript file=./example.ts
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

````markdown file=fixtures/subfolder1/included.md
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

````markdown file=fixtures/output.md
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
