import {
  ElementKind,
  NamedTypeNode,
  PropertyPrototype,
  DeclaredElement,
  ClassPrototype,
  TypeParameterNode,
  FunctionPrototype,
  File,
  Range,
  CommonFlags,
  Statement,
} from 'assemblyscript/dist/assemblyscript.js';
import { getTypeName } from './utils.js';
import { Generator } from './statements.js';

export function generateMetadata(elem: ClassPrototype) {
  const members: Map<string, DeclaredElement> | null = elem.instanceMembers;
  if (!members) {
    return null;
  }

  const result: Record<string, { in: string; out: string } | string> = {};

  for (const [name, def] of Array.from(members.entries())) {
    if (def.kind !== ElementKind.PropertyPrototype) {
      continue;
    }

    const type = <NamedTypeNode>(<PropertyPrototype>def).fieldDeclaration?.type;

    if (['init', 'handle', 'reply', 'others'].includes(name)) {
      console.assert(
        type.name.identifier.text === 'InOut',
        'Invalid type name for metadata field.\nExpected: InOut.\nActual: ' + type.name.identifier.text,
      );
      result[name] = {
        in: getTypeName(<NamedTypeNode>type.typeArguments![0]),
        out: getTypeName(<NamedTypeNode>type.typeArguments![1]),
      };
    } else if (['signal', 'state'].includes(name)) {
      result[name] = getTypeName(type);
    }
  }

  return result;
}

export function generateMetahashFunc(metahash: Uint8Array, parent: File) {
  const gen = new Generator(parent.source.range);
  const statements: Statement[] = [];
  statements.push(
    gen.varStatement([
      gen.varDecl(
        gen.identExp('metahash'),
        CommonFlags.Const,
        gen.newExp(gen.typeName(gen.identExp('Uint8Array')), null, [gen.intLiteralExp(i64_new(32))]),
        gen.namedType(gen.typeName(gen.identExp('Uint8Array'))),
      ),
    ]),
  );

  const metahashArr = [];

  for (let i = 0; i < metahash.length; i++) {
    metahashArr.push(gen.intLiteralExp(i64_new(metahash[i])));
  }

  statements.push(
    gen.expStatement(
      gen.callExp(gen.propAccessExp(gen.identExp('metahash'), gen.identExp('set')), null, [
        gen.arrLiteralExp(metahashArr),
      ]),
    ),
  );

  statements.push(
    gen.expStatement(
      gen.callExp(gen.propAccessExp(gen.identExp('msg'), gen.identExp('reply')), null, [gen.identExp('metahash')]),
    ),
  );
  const func = gen.funcPrototype(
    'metahash',
    parent,
    gen.funcDecl(
      gen.identExp('metahash'),
      CommonFlags.Export,
      gen.funcType([], gen.namedType(gen.typeName(gen.identExp('void')))),
      gen.blockStatement(statements),
    ),
  );

  // console.log((func.declaration as any).body.statements[0].declarations[0]);
  return func;
}
