import {
  Expression,
  IdentifierExpression,
  PropertyAccessExpression,
  Token,
  Range,
  ThisExpression,
  BinaryExpression,
  TypeNode,
  CallExpression,
  NewExpression,
  TypeName,
  IntegerLiteralExpression,
  VariableDeclaration,
  CommonFlags,
  NamedTypeNode,
  FunctionTypeNode,
  ParameterNode,
  ParameterKind,
  MethodDeclaration,
  Statement,
  FunctionPrototype,
  FunctionDeclaration,
  Element,
  BlockStatement,
  ExpressionStatement,
  VariableStatement,
  ReturnStatement,
  Signature,
  ArrowKind,
  ArrayLiteralExpression,
  AssertionExpression,
  AssertionKind,
} from 'assemblyscript/dist/assemblyscript.js';

export class Generator {
  constructor(private range: Range) {}

  propAccessExp(exp: Expression, prop: IdentifierExpression): PropertyAccessExpression {
    return new PropertyAccessExpression(exp, prop, this.range);
  }

  thisExp(): ThisExpression {
    return new ThisExpression(this.range);
  }

  identExp(name: string): IdentifierExpression {
    return new IdentifierExpression(name, false, this.range);
  }

  binaryExp(operator: Token, left: Expression, right: Expression) {
    return new BinaryExpression(operator, left, right, this.range);
  }

  callExp(exp: Expression, typeArgs: TypeNode[] | null = null, args: Expression[] = []): CallExpression {
    return new CallExpression(exp, typeArgs, args, this.range);
  }

  newExp(typeName: TypeName, typeArgs: TypeNode[] | null = null, args: Expression[] = []): NewExpression {
    return new NewExpression(typeName, typeArgs, args, this.range);
  }

  intLiteralExp(value: i64 = i64_zero): IntegerLiteralExpression {
    return new IntegerLiteralExpression(value, this.range);
  }

  arrLiteralExp(exp: Expression[]): ArrayLiteralExpression {
    return new ArrayLiteralExpression(exp, this.range);
  }

  assertExp(kind: AssertionKind, exp: Expression, toType: TypeNode | null = null): AssertionExpression {
    return new AssertionExpression(kind, exp, toType, this.range);
  }

  typeName(name: IdentifierExpression): TypeName {
    return new TypeName(name, null, this.range);
  }

  namedType(name: TypeName, typeArgs: TypeNode[] | null = null): NamedTypeNode {
    return new NamedTypeNode(name, typeArgs, false, this.range);
  }

  funcType(param: ParameterNode[], retType: TypeNode): FunctionTypeNode {
    return new FunctionTypeNode(param, retType, null, false, this.range);
  }

  param(kind: ParameterKind, name: IdentifierExpression, type: TypeNode, initializer: Expression | null = null) {
    return new ParameterNode(kind, name, type, initializer, this.range);
  }

  methodDecl(
    name: IdentifierExpression,
    flags: CommonFlags,
    sig: FunctionTypeNode,
    body: Statement | null = null,
  ): MethodDeclaration {
    return new MethodDeclaration(name, null, flags, null, sig, body, this.range);
  }

  varDecl(
    name: IdentifierExpression,
    flags: CommonFlags,
    initializer: Expression | null = null,
    type: TypeNode | null = null,
  ): VariableDeclaration {
    return new VariableDeclaration(name, null, flags, type, initializer, this.range);
  }

  funcDecl(
    name: IdentifierExpression,
    flags: CommonFlags,
    sig: FunctionTypeNode,
    body: BlockStatement,
  ): FunctionDeclaration {
    return new FunctionDeclaration(name, null, flags, null, sig, body, ArrowKind.None, this.range);
  }

  varStatement(decl: VariableDeclaration[]): VariableStatement {
    return new VariableStatement(null, decl, this.range);
  }

  expStatement(exp: Expression): ExpressionStatement {
    return new ExpressionStatement(exp);
  }

  blockStatement(statements: Statement[]): BlockStatement {
    return new BlockStatement(statements, this.range);
  }

  returnStatement(value: Expression): ReturnStatement {
    return new ReturnStatement(value, this.range);
  }

  funcPrototype(name: string, parent: Element, decl: FunctionDeclaration): FunctionPrototype {
    return new FunctionPrototype(name, parent, decl);
  }
}
