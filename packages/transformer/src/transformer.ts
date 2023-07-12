import { Transform } from 'assemblyscript/dist/transform.js';
import { ClassPrototype, ElementKind, Program, File, FunctionPrototype } from 'assemblyscript/dist/assemblyscript.js';
import { blake2b } from 'blakejs';
import { isUserEntryFile, hasDecorator, u8aToHex } from './utils.js';
import {
  generateEncodeEnumFunc,
  generateDecodeEnumFunc,
  generateEncodeStructFunc,
  generateDecodeStructFunc,
} from './generate/index.js';
import { generateEnumTypeInfo, generateFixedSizeArrayTypeInfo, generateStructTypeInfo } from './typeinfo.js';
import { generateMetadata, generateMetahashFunc } from './metadata.js';
import { Module } from 'types:assemblyscript/src/module';
import { insertCollectStatement } from './generate/collect.js';

const LANG = new Uint8Array([0x01]);
const IMPL_VERSION = new Uint8Array([0x00, 0x01]);

class MyTransform extends Transform {
  afterInitialize(program: Program) {
    const userFiles = Array.from(program.filesByName.values());
    const typeInfo: Record<string, any> = {};
    let metadata: Record<string, any> | null = null;
    let entryFile: File | null = null;

    for (const f of userFiles) {
      if (isUserEntryFile(f.source) && f.name === 'assembly/index.ts') {
        entryFile = f;
        if (f.members) {
          const init = <FunctionPrototype>f.members.get('init');
          const handle = <FunctionPrototype>f.members.get('handle');
          const reply = <FunctionPrototype>f.members.get('reply');
          if (init) {
            insertCollectStatement(init);
          }

          if (handle) {
            insertCollectStatement(handle);
          }

          if (reply) {
            insertCollectStatement(reply);
          }
        }
      }
      for (const elem of Array.from(f.members?.values() || [])) {
        const file = elem.parent as File;
        if (hasDecorator('codec', elem)) {
          if (hasDecorator('struct', elem)) {
            if (elem.kind === ElementKind.ClassPrototype) {
              const members = (<ClassPrototype>elem).instanceMembers;
              if (!members) continue;
              if (!members.has('decode')) {
                const decodeMethod = generateDecodeStructFunc(file, <ClassPrototype>elem);
                (<ClassPrototype>elem).instanceMembers?.set('decode', decodeMethod);
              }
              if (!members.has('encode')) {
                const encodeMethod = generateEncodeStructFunc(file, <ClassPrototype>elem);
                (<ClassPrototype>elem).instanceMembers?.set('encode', encodeMethod);
              }
            }
          }
          if (hasDecorator('scaleEnum', elem)) {
            if (elem.kind === ElementKind.ClassPrototype && f.name === elem.parent.name) {
              const members = (<ClassPrototype>elem).instanceMembers;
              if (!members) continue;
              if (!members.has('decode')) {
                const decodeMethod = generateDecodeEnumFunc(file, <ClassPrototype>elem);
                (<ClassPrototype>elem).instanceMembers?.set('decode', decodeMethod);
              }
              if (!members.has('encode')) {
                const encodeMethod = generateEncodeEnumFunc(file, <ClassPrototype>elem);
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
          } else if (hasDecorator('scaleEnum', elem)) {
            const type = generateEnumTypeInfo(file, <ClassPrototype>elem);
            if (type) {
              typeInfo[type.name] = type.def;
            }
          } else if (hasDecorator('FixedSizeArray', elem)) {
            if (elem.kind === ElementKind.ClassPrototype && f.name === elem.parent.name) {
              const type = generateFixedSizeArrayTypeInfo(file, <ClassPrototype>elem);
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

    if (metadata) {
      metadata.types = typeInfo;
      const jsonMetadata = JSON.stringify(metadata);

      const encMetadata = new TextEncoder().encode(jsonMetadata);

      const u8a = new Uint8Array(LANG.byteLength + IMPL_VERSION.byteLength + encMetadata.byteLength);
      // Set the first byte to the language identifier
      u8a.set(LANG, 0);
      u8a.set(IMPL_VERSION, 1);
      u8a.set(encMetadata, 3);

      const metahash = blake2b(u8a, undefined, 32);
      const metahashFunc = generateMetahashFunc(metahash, entryFile!);
      entryFile?.members?.set('metahash', metahashFunc);
      entryFile?.exports?.set('metahash', metahashFunc);
      this.writeFile('meta.txt', u8aToHex(u8a), '.');
    }
  }

  afterCompile(module: Module): void | Promise<void> {
    module.addGlobalExport('~lib/memory/__data_end', '__data_end');
    module.addGlobalExport('~lib/memory/__stack_pointer', '__stack_pointer');
  }
}

export default MyTransform;
