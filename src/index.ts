/**
 * This Remark plugin helps to adjust code meta `file`,
 * ensuring paths remain accurate even after file relocations or inclusions.
 *
 * When `processor.data().filePathChanges` is set,
 * this plugin adjusts all relative paths
 * for code
 * to ensure they are accurate.
 *
 * @packageDocumentation
 */

import path from 'node:path';
import convertPath from '@stdlib/utils-convert-path';
import type { Transformer, Processor } from 'unified';
import type { Nodes, Code } from 'mdast';
import type { VFile } from 'vfile';
import { visit } from 'unist-util-visit';

declare module 'unified' {

  interface Data {
    /**
     * When `processor.data().filePathChanges` is set,
     * this plugin adjusts all relative URLs
     * for images, definitions, and links
     * to ensure they are accurate.
     *
     * @public
     */
    filePathChanges?: {

      /**
       * markdown file path before moving or including.
       * If not specified, file.path used
       *
       * @public
       */
      sourcePath?: string,

      /**
       * markdown file path after moving or including.
       * If not specified, <current dir>/<filename> used
       *
       * @public
       */
      destinationPath?: string
    }
  }

};

/**
 * This Remark plugin helps to adjust code meta `file`,
 * ensuring paths remain accurate even after file relocations or inclusions.
 *
 * When `processor.data().filePathChanges` is set,
 * this plugin adjusts all relative paths
 * for code
 * to ensure they are accurate.
 *
 * @public
 */
export function remarkRelativeCodePathsAdjustment(
  this: Processor
): Transformer {

  const processor: Processor = this;

  return function (tree: Nodes, file: VFile): Nodes {
    const filePathChanges =
      processor.data().filePathChanges;

    if (typeof filePathChanges !== 'undefined') {
      visit(tree,
        'code',
        function (node: Code): void {
          const fileMeta: string | undefined = (node.meta ?? '')
            // Allow escaping spaces
            .split(/(?<!\\) /g)
            .find((meta) => meta.startsWith('file='));
          if (typeof fileMeta === 'undefined') {
            return;
          };
          // eslint-disable-next-line max-len
          const fileAttributeRegExp = /^file=(?<path>.+?)(?:(?:#(?:L(?<from>\d+)(?:-)?)?)(?:L(?<to>\d+))?)?$/;
          const fileMetaStructure = fileAttributeRegExp.exec(fileMeta);
          if (fileMetaStructure?.groups?.path) {
            const filePath = fileMetaStructure.groups.path;
            const normalizedFilePath = filePath
              .replaceAll(String.raw`\ `, ' ');
            if (!path.isAbsolute(normalizedFilePath)) {
              const rebasedFilePath = convertPath(
                path.relative(
                  path.dirname(path.resolve(
                    filePathChanges.destinationPath ?? './'
                  )),
                  path.resolve(
                    path.dirname(filePathChanges.sourcePath ?? file.path),
                    normalizedFilePath
                  )
                ),
                'posix'
              );
              node.meta =
                'file=' + rebasedFilePath.replaceAll(' ', String.raw`\ `) +
                (fileMetaStructure.groups.from ?
                  '#L' + fileMetaStructure.groups.from
                  : '') +
                (fileMetaStructure.groups.to ?
                  '-L' + fileMetaStructure.groups.to
                  : '');
            };
          };
        }
      );
    };

    return tree;
  } as Transformer;

};
