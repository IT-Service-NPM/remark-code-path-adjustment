import { suite, test } from 'node:test';
import path from 'node:path';
import { remarkDirectiveUsingExample } from './example.ts';

await suite('remark-code-path-adjustment', async () => {

  await test('update relative code path',
    async (t) => {
      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);

        const outputFile = await remarkDirectiveUsingExample(
          path.join(
            import.meta.dirname, 'fixtures',
            'subfolder1', 'included.md'
          )
        );
        t.assert.fileSnapshot(
          String(outputFile),
          path.resolve(import.meta.dirname, 'fixtures', 'output.md'),
          { serializers: [(data: string) => data] }
        );

      } finally {
        process.chdir(_cwd);
      };
    }
  );

});
