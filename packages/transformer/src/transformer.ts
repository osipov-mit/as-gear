import { Transform } from 'assemblyscript/dist/transform.js';
import { ClassPrototype, ElementKind, Program, File } from 'assemblyscript/dist/assemblyscript.js';
import { isUserFile, isUserEntryFile, hasDecorator, u8aToHex } from './utils.js';
import { generateDecodeStructFunc } from './decode.js';
import { generateEncodeStructFunc } from './encode.js';
import { generateStructTypeInfo } from './typeinfo.js';
import { generateMetadata, generateMetahashFunc } from './metadata.js';
import { blake2b } from '../../../node_modules/blakejs/index.js';

const lang = new Uint8Array([0x01]);

class MyTransform extends Transform {
  afterInitialize(program: Program) {
    const userFiles = Array.from(program.filesByName.values()).filter(
      (file) => isUserEntryFile(file.source) || isUserFile(file.source),
    );

    const typeInfo: Record<string, any> = {};
    let metadata: Record<string, any> | null = null;
    let entryFile: File | null = null;

    for (const f of userFiles) {
      if (isUserEntryFile(f.source) && f.name === 'assembly/index.ts') {
        entryFile = f;
      }
      for (const elem of Array.from(f.members?.values() || [])) {
        if (hasDecorator('codec', elem)) {
          if (hasDecorator('struct', elem)) {
            if (elem.kind === ElementKind.ClassPrototype) {
              const members = (<ClassPrototype>elem).instanceMembers;
              if (!members) continue;
              if (!members.has('decode')) {
                const decodeMethod = generateDecodeStructFunc(f, <ClassPrototype>elem);
                (<ClassPrototype>elem).instanceMembers?.set('decode', decodeMethod);
              }
              // else {
              //   console.log(
              //     (members as any).get('decode')?.declaration.body.statements[2].expression.expression.expression,
              //   );
              // }
              if (!members.has('encode')) {
                const encodeMethod = generateEncodeStructFunc(f, <ClassPrototype>elem);
                (<ClassPrototype>elem).instanceMembers?.set('encode', encodeMethod);
              }
            }
          }
        }
        if (hasDecorator('typeInfo', elem)) {
          if (hasDecorator('struct', elem)) {
            if (elem.kind === ElementKind.ClassPrototype) {
              const type = generateStructTypeInfo(<ClassPrototype>elem);
              if (type) {
                typeInfo[type.name] = type.def;
              }
            }
          }
        }
        if (hasDecorator('metadata', elem)) {
          metadata = generateMetadata(<ClassPrototype>elem);
        }
      }
    }

    if (!metadata) {
      metadata = { types: typeInfo };
    } else {
      metadata.types = typeInfo;
    }

    const jsonMetadata = JSON.stringify(metadata);

    const encMetadata = new TextEncoder().encode(jsonMetadata);

    const u8a = new Uint8Array(lang.byteLength + encMetadata.byteLength);
    // Set the first byte to the language identifier
    u8a.set(lang, 0);
    u8a.set(encMetadata, 1);

    const metahash = blake2b(u8a, undefined, 32);
    const metahashFunc = generateMetahashFunc(metahash, entryFile!);
    entryFile?.members?.set('metahash', metahashFunc);
    entryFile?.exports?.set('metahash', metahashFunc);
    this.writeFile('meta.txt', u8aToHex(u8a), '.');
  }
}

export default MyTransform;
