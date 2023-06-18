import {
  AssertionKind,
  CommonFlags,
  ElementKind,
  SwitchCase,
  NamedTypeNode,
  PropertyPrototype,
  Statement,
  Token,
  File,
  DeclaredElement,
  ClassDeclaration,
  ClassPrototype,
  MethodDeclaration,
  ParameterKind,
} from 'assemblyscript/dist/assemblyscript.js';
import { Generator } from '../generator.js';

export function generateEncodeEnumFunc(f: File, elem: ClassPrototype) {
  const members: Map<string, DeclaredElement> = elem.instanceMembers!;

  const gen = new Generator(f.source.range);

  const variantIndexTypeName = (<NamedTypeNode>(
    (<MethodDeclaration>members!.get('variantIndex')!.declaration).signature.returnType
  )).name.identifier.text;
  const variantsIndexType = f.members?.get(variantIndexTypeName) as ClassPrototype;

  const variantsEnum = variantsIndexType.members!.keys();

  const variantsTypeName = (<NamedTypeNode>(
    (<MethodDeclaration>members!.get('variants')!.declaration).signature.returnType
  )).name.identifier.text;

  const variantsType = f.members?.get(variantsTypeName) as ClassPrototype;

  const variants: Map<string, NamedTypeNode> = new Map();

  Array.from(variantsType.instanceMembers!.entries()).forEach(([name, prop]) => {
    if (prop.kind === ElementKind.PropertyPrototype) {
      const type = (<PropertyPrototype>prop).fieldDeclaration!.type as NamedTypeNode;
      variants.set(name, gen.namedType(type.name, type.typeArguments));
    }
  });

  const statements: Statement[] = [];

  statements.push(
    gen.varStatement([
      gen.varDecl(
        gen.identExp('firstByte'),
        CommonFlags.Const,
        gen.callExp(
          gen.propAccessExp(
            gen.newExp(gen.typeName(gen.identExp('U8')), null, [
              gen.assertExp(
                AssertionKind.Prefix,
                gen.propAccessExp(gen.thisExp(), gen.identExp('variantIndex')),
                gen.namedType(gen.typeName(gen.identExp('u8'))),
              ),
            ]),
            gen.identExp('encode'),
          ),
        ),
      ),
    ]),
  );

  statements.push(
    gen.varStatement([
      gen.varDecl(
        gen.identExp('bytes'),
        CommonFlags.Let,
        null,
        gen.namedType(gen.typeName(gen.identExp('Uint8Array'))),
      ),
    ]),
  );

  const cases: SwitchCase[] = [];

  for (const name of variantsEnum) {
    const scStatements: Statement[] = [];
    const variant = variants.get(name);

    if (variant) {
      scStatements.push(
        gen.expStatement(
          gen.binaryExp(
            Token.Equals,
            gen.identExp('bytes'),
            gen.callExp(
              gen.propAccessExp(
                gen.assertExp(
                  AssertionKind.NonNull,
                  gen.propAccessExp(
                    gen.assertExp(AssertionKind.NonNull, gen.propAccessExp(gen.thisExp(), gen.identExp('variants'))),
                    gen.identExp(name),
                  ),
                ),
                gen.identExp('encode'),
              ),
            ),
          ),
        ),
      );
    } else {
      scStatements.push(
        gen.expStatement(
          gen.binaryExp(
            Token.Equals,
            gen.identExp('bytes'),
            gen.newExp(gen.typeName(gen.identExp('Uint8Array')), null, [gen.intLiteralExp(i64_zero)]),
          ),
        ),
      );
    }

    scStatements.push(gen.breakStatement());

    cases.push(
      gen.switchCaseExp(gen.propAccessExp(gen.identExp(variantIndexTypeName), gen.identExp(name)), scStatements),
    );
  }

  cases.push(
    gen.switchCaseExp(null, [
      gen.throwStatement(
        gen.newExp(gen.typeName(gen.identExp('Error')), null, [gen.strLiteralExp('Invalid variant index')]),
      ),
    ]),
  );

  statements.push(gen.switchStatement(gen.propAccessExp(gen.thisExp(), gen.identExp('variantIndex')), cases));

  statements.push(
    gen.expStatement(
      gen.binaryExp(
        Token.Equals,
        gen.propAccessExp(gen.thisExp(), gen.identExp('_bytes')),
        gen.newExp(gen.typeName(gen.identExp('Uint8Array')), null, [
          gen.binaryExp(
            Token.Plus,
            gen.propAccessExp(gen.identExp('firstByte'), gen.identExp('length')),
            gen.propAccessExp(gen.identExp('bytes'), gen.identExp('length')),
          ),
        ]),
      ),
    ),
  );

  statements.push(
    gen.expStatement(
      gen.callExp(
        gen.propAccessExp(
          gen.assertExp(AssertionKind.NonNull, gen.propAccessExp(gen.thisExp(), gen.identExp('_bytes'))),
          gen.identExp('set'),
        ),
        null,
        [gen.identExp('firstByte')],
      ),
    ),
  );
  statements.push(
    gen.expStatement(
      gen.callExp(
        gen.propAccessExp(
          gen.assertExp(AssertionKind.NonNull, gen.propAccessExp(gen.thisExp(), gen.identExp('_bytes'))),
          gen.identExp('set'),
        ),
        null,
        [gen.identExp('bytes'), gen.propAccessExp(gen.identExp('firstByte'), gen.identExp('length'))],
      ),
    ),
  );

  statements.push(
    gen.expStatement(
      gen.binaryExp(
        Token.Equals,
        gen.propAccessExp(gen.thisExp(), gen.identExp('_bytesLen')),
        gen.propAccessExp(
          gen.assertExp(AssertionKind.NonNull, gen.propAccessExp(gen.thisExp(), gen.identExp('_bytes'))),
          gen.identExp('length'),
        ),
      ),
    ),
  );
  statements.push(
    gen.returnStatement(gen.assertExp(AssertionKind.NonNull, gen.propAccessExp(gen.thisExp(), gen.identExp('_bytes')))),
  );

  const name = gen.identExp('encode');
  const returnType = gen.namedType(gen.typeName(gen.identExp('Uint8Array')));
  const signature = gen.funcType([], returnType);
  const block = gen.blockStatement(statements);
  const declaration = gen.methodDecl(name, CommonFlags.Instance, signature, block);
  const method = gen.funcPrototype('encode', elem, declaration);

  (<ClassDeclaration>elem.declaration).members.push(declaration);

  return method;
}
