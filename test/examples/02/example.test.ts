import path from 'node:path';
import { remarkDirectiveUsingExample } from './example.ts';

const testSourceFilesPath: string = path.join(__dirname, 'fixtures');

describe('remark-code-path-adjustment', () => {

  it('update relative code path',
    async () => {
      const _cwd = process.cwd();
      try {
        process.chdir(__dirname);

        const outputFile = await remarkDirectiveUsingExample(
          path.join(testSourceFilesPath,
            'subfolder1', 'included.md'
          )
        );

        await expect(String(outputFile))
          .toMatchFileSnapshot(path.join(testSourceFilesPath, 'output.md'));

      } finally {
        process.chdir(_cwd);
      };

    }
  );

});
