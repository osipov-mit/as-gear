import { Transform } from 'assemblyscript/dist/transform.js';
import { ClassPrototype, ElementKind, Program, Range } from 'assemblyscript/dist/assemblyscript.js';
import { isUserFile, isUserEntryFile, hasDecorator } from './utils.js';
import { generateDecodeStructFunc } from './decode.js';
import { generateEncodeStructFunc } from './encode.js';

const RANGE = new Range(0, 0);

class MyTransform extends Transform {
  afterInitialize(program: Program) {
    const userFiles = Array.from(program.filesByName.values()).filter(
      (file) => isUserEntryFile(file.source) || isUserFile(file.source),
    );

    for (const f of userFiles) {
      for (const elem of Array.from(f.exports?.values() || [])) {
        if (hasDecorator('codec', elem)) {
          if (hasDecorator('struct', elem)) {
            if (elem.kind === ElementKind.ClassPrototype) {
              const members = (<ClassPrototype>elem).instanceMembers;
              if (!members) continue;
              if (!members.has('decode')) {
                const decodeMethod = generateDecodeStructFunc(f, members, elem);
                (<ClassPrototype>elem).instanceMembers?.set('decode', decodeMethod);
              }
              if (!members.has('encode')) {
                const encodeMethod = generateEncodeStructFunc(f, members, elem);
                (<ClassPrototype>elem).instanceMembers?.set('encode', encodeMethod);
              }
            }
          }
        }
      }
    }
  }
}

export default MyTransform;
