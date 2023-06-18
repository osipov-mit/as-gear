import {
  CommonFlags,
  ElementKind,
  FieldDeclaration,
  NamedTypeNode,
  ParameterKind,
  PropertyPrototype,
  Statement,
  Token,
  File,
  DeclaredElement,
  ClassDeclaration,
  ClassPrototype,
  AssertionKind,
} from 'assemblyscript/dist/assemblyscript.js';
import { Generator } from '../generator.js';

export function generateDecodeStructFunc(f: File, elem: ClassPrototype) {
  const members: Map<string, DeclaredElement> | null = elem.instanceMembers;
  const gen = new Generator(f.source.range);
  const props = new Map<string, NamedTypeNode>();

  for (const [name, member] of Array.from(members?.entries() || [])) {
    if (member.kind === ElementKind.PropertyPrototype) {
      props.set(name, (<FieldDeclaration>(<PropertyPrototype>member).fieldDeclaration).type as NamedTypeNode);
    }
  }
  const statements: Statement[] = [];

  statements.push(gen.varStatement([gen.varDecl(gen.identExp('bytesLen'), CommonFlags.Let, gen.intLiteralExp())]));
  for (let [name, type] of Array.from(props.entries())) {
    const t = gen.namedType(type.name, type.typeArguments);
    t.isNullable = false;
    statements.push(
      gen.expStatement(
        gen.binaryExp(
          Token.Equals,
          gen.propAccessExp(gen.thisExp(), gen.identExp(name)),
          gen.newExp(t.name, t.typeArguments),
        ),
      ),
    );
    statements.push(
      gen.expStatement(
        gen.callExp(
          gen.propAccessExp(
            gen.assertExp(AssertionKind.NonNull, gen.propAccessExp(gen.thisExp(), gen.identExp(name))),
            gen.identExp('decode'),
          ),
          null,
          [
            gen.callExp(gen.propAccessExp(gen.identExp('value'), gen.identExp('slice')), null, [
              gen.identExp('bytesLen'),
            ]),
          ],
        ),
      ),
    );
    statements.push(
      gen.expStatement(
        gen.binaryExp(
          Token.Plus_Equals,
          gen.identExp('bytesLen'),
          gen.propAccessExp(
            gen.assertExp(AssertionKind.NonNull, gen.propAccessExp(gen.thisExp(), gen.identExp(name))),
            gen.identExp('bytesLen'),
          ),
        ),
      ),
    );
  }

  statements.push(
    gen.expStatement(
      gen.binaryExp(
        Token.Equals,
        gen.propAccessExp(gen.thisExp(), gen.identExp('_bytesLen')),
        gen.identExp('bytesLen'),
      ),
    ),
  );

  const block = gen.blockStatement(statements);
  const signature = gen.funcType(
    [gen.param(ParameterKind.Default, gen.identExp('value'), gen.namedType(gen.typeName(gen.identExp('Uint8Array'))))],
    gen.namedType(gen.typeName(gen.identExp('void'))),
  );
  const declaration = gen.methodDecl(gen.identExp('decode'), CommonFlags.Instance, signature, block);
  const method = gen.funcPrototype('decode', elem, declaration);
  (<ClassDeclaration>elem.declaration).members.push(declaration);

  return method;
}
