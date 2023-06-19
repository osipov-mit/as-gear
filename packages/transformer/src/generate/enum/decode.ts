import {
  AssertionKind,
  CommonFlags,
  ElementKind,
  SwitchCase,
  NamedTypeNode,
  ParameterKind,
  PropertyPrototype,
  Statement,
  Token,
  File,
  DeclaredElement,
  ClassDeclaration,
  ClassPrototype,
  MethodDeclaration,
} from 'assemblyscript/dist/assemblyscript.js';
import { Generator } from '../generator.js';

export function generateDecodeEnumFunc(f: File, elem: ClassPrototype) {
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
        gen.identExp('index'),
        CommonFlags.Const,
        gen.propAccessExp(
          gen.callExp(gen.propAccessExp(gen.identExp('U8'), gen.identExp('decode')), null, [gen.identExp('value')]),
          gen.identExp('value'),
        ),
      ),
    ]),
  );

  statements.push(
    gen.varStatement([
      gen.varDecl(
        gen.identExp('variantValue'),
        CommonFlags.Const,
        gen.callExp(gen.propAccessExp(gen.identExp('value'), gen.identExp('slice')), null, [
          gen.intLiteralExp(i64_one),
        ]),
      ),
    ]),
  );

  statements.push(
    gen.varStatement([gen.varDecl(gen.identExp('bytesLen'), CommonFlags.Let, gen.intLiteralExp(i64_one))]),
  );

  const cases: SwitchCase[] = [];

  for (const name of variantsEnum) {
    const scStatements: Statement[] = [];
    const variant = variants.get(name);

    scStatements.push(
      gen.expStatement(
        gen.binaryExp(
          Token.Equals,
          gen.propAccessExp(gen.thisExp(), gen.identExp('variantIndex')),
          gen.propAccessExp(gen.identExp(variantIndexTypeName), gen.identExp(name)),
        ),
      ),
    );

    if (variant !== undefined) {
      scStatements.push(
        gen.expStatement(
          gen.binaryExp(
            Token.Equals,
            gen.propAccessExp(gen.thisExp(), gen.identExp('variantIndex')),
            gen.propAccessExp(gen.identExp(variantIndexTypeName), gen.identExp(name)),
          ),
        ),
      );

      scStatements.push(
        gen.expStatement(
          gen.binaryExp(
            Token.Equals,
            gen.propAccessExp(
              gen.assertExp(AssertionKind.NonNull, gen.propAccessExp(gen.thisExp(), gen.identExp('variants'))),
              gen.identExp(name),
            ),
            gen.newExp(variant.name),
          ),
        ),
      );

      scStatements.push(
        gen.expStatement(
          gen.callExp(
            gen.propAccessExp(
              gen.assertExp(
                AssertionKind.NonNull,
                gen.propAccessExp(
                  gen.assertExp(AssertionKind.NonNull, gen.propAccessExp(gen.thisExp(), gen.identExp('variants'))),
                  gen.identExp(name),
                ),
              ),
              gen.identExp('decode'),
            ),
            null,
            [gen.identExp('variantValue')],
          ),
        ),
      );
      scStatements.push(
        gen.expStatement(
          gen.binaryExp(
            Token.Plus_Equals,
            gen.identExp('bytesLen'),
            gen.propAccessExp(
              gen.assertExp(
                AssertionKind.NonNull,
                gen.propAccessExp(
                  gen.assertExp(AssertionKind.NonNull, gen.propAccessExp(gen.thisExp(), gen.identExp('variants'))),
                  gen.identExp(name),
                ),
              ),
              gen.identExp('bytesLen'),
            ),
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

  statements.push(gen.switchStatement(gen.identExp('index'), cases));

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
