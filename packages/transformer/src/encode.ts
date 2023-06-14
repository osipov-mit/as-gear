import {
  CommonFlags,
  ElementKind,
  Statement,
  Token,
  File,
  DeclaredElement,
  ClassDeclaration,
} from 'assemblyscript/dist/assemblyscript.js';
import { Generator } from './statements.js';

export function generateEncodeStructFunc(f: File, members: Map<string, DeclaredElement>, elem: DeclaredElement) {
  const gen = new Generator(f.source.range);
  const props: string[] = [];

  for (const [name, member] of Array.from(members?.entries() || [])) {
    if (member.kind === ElementKind.PropertyPrototype) {
      props.push(name);
    }
  }

  const statements: Statement[] = [];

  statements.push(gen.varStatement([gen.varDecl(gen.identExp('bytesLen'), CommonFlags.Let, gen.intLiteralExp())]));
  statements.push(gen.varStatement([gen.varDecl(gen.identExp('offset'), CommonFlags.Let, gen.intLiteralExp())]));

  for (const name of props) {
    statements.push(
      gen.varStatement([
        gen.varDecl(
          gen.identExp(name),
          CommonFlags.Const,
          gen.callExp(gen.propAccessExp(gen.propAccessExp(gen.thisExp(), gen.identExp(name)), gen.identExp('encode'))),
        ),
      ]),
    );

    statements.push(
      gen.expStatement(
        gen.binaryExp(
          Token.Plus_Equals,
          gen.identExp('bytesLen'),
          gen.propAccessExp(gen.identExp(name), gen.identExp('byteLength')),
        ),
      ),
    );
  }

  statements.push(
    gen.varStatement([
      gen.varDecl(
        gen.identExp('bytes'),
        CommonFlags.Const,
        gen.newExp(gen.typeName(gen.identExp('Uint8Array')), null, [gen.identExp('bytesLen')]),
      ),
    ]),
  );

  for (let i = 0; i < props.length; i++) {
    const name = props[i];

    statements.push(
      gen.expStatement(
        gen.callExp(gen.propAccessExp(gen.identExp('bytes'), gen.identExp('set')), null, [
          gen.identExp(name),
          gen.identExp('offset'),
        ]),
      ),
    );

    if (i < props.length - 1)
      statements.push(
        gen.expStatement(
          gen.binaryExp(
            Token.Plus_Equals,
            gen.identExp('offset'),
            gen.propAccessExp(gen.identExp(name), gen.identExp('byteLength')),
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

  statements.push(
    gen.expStatement(
      gen.binaryExp(Token.Equals, gen.propAccessExp(gen.thisExp(), gen.identExp('_bytes')), gen.identExp('bytes')),
    ),
  );

  statements.push(gen.returnStatement(gen.identExp('bytes')));

  const name = gen.identExp('encode');
  const returnType = gen.namedType(gen.typeName(gen.identExp('Uint8Array')));
  const signature = gen.funcType([], returnType);
  const block = gen.blockStatement(statements);
  const declaration = gen.methodDecl(name, CommonFlags.Instance, signature, block);
  const method = gen.funcPrototype('encode', elem, declaration);

  (<ClassDeclaration>elem.declaration).members.push(declaration);

  return method;
}
