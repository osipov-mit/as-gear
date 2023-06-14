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
} from 'assemblyscript/dist/assemblyscript.js';
import { Generator } from './statements.js';

export function generateDecodeStructFunc(f: File, members: Map<string, DeclaredElement>, elem: DeclaredElement) {
  const gen = new Generator(f.source.range);
  const props = new Map<string, NamedTypeNode>();

  for (const [name, member] of Array.from(members?.entries() || [])) {
    if (member.kind === ElementKind.PropertyPrototype) {
      props.set(name, (<FieldDeclaration>(<PropertyPrototype>member).fieldDeclaration).type as NamedTypeNode);
    }
  }
  const name = gen.identExp('decode');
  const paramName = gen.identExp('value');
  const paramType = gen.namedType(gen.typeName(gen.identExp('Uint8Array')));
  const returnType = gen.namedType(gen.typeName(gen.identExp('void')));
  const signature = gen.funcType([gen.param(ParameterKind.Default, paramName, paramType)], returnType);

  const statements: Statement[] = [];

  statements.push(gen.varStatement([gen.varDecl(gen.identExp('bytesLen'), CommonFlags.Let, gen.intLiteralExp())]));
  for (const [name, type] of Array.from(props.entries())) {
    statements.push(
      gen.expStatement(
        gen.binaryExp(
          Token.Equals,
          gen.propAccessExp(gen.thisExp(), gen.identExp(name)),
          gen.newExp(type.name, type.typeArguments),
        ),
      ),
    );
    statements.push(
      gen.expStatement(
        gen.callExp(
          gen.propAccessExp(gen.propAccessExp(gen.thisExp(), gen.identExp(name)), gen.identExp('decode')),
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
          gen.propAccessExp(gen.propAccessExp(gen.thisExp(), gen.identExp(name)), gen.identExp('bytesLen')),
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
  const declaration = gen.methodDecl(name, CommonFlags.Instance, signature, block);
  const method = gen.funcPrototype('decode', elem, declaration);
  (<ClassDeclaration>elem.declaration).members.push(declaration);

  return method;
}
