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
