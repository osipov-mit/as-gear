import {
  FunctionDeclaration,
  ExpressionStatement,
  CallExpression,
  IdentifierExpression,
  FunctionPrototype,
  BlockStatement,
} from 'assemblyscript/dist/assemblyscript.js';
import { Generator } from './generator.js';

export function insertCollectStatement(func: FunctionPrototype) {
  const body = <BlockStatement>(<FunctionDeclaration>func.declaration).body;
  const lastStatement = <ExpressionStatement>body.statements.at(-1);

  if (isCollectCall(lastStatement)) {
    return;
  }

  const gen = new Generator(body.range);

  body.statements.push(gen.expStatement(gen.callExp(gen.identExp('__collect'))));
}

function isCollectCall(exp: ExpressionStatement) {
  if (exp.kind !== 38) {
    return false;
  }

  if (exp.expression.kind !== 9) {
    return false;
  }

  if ((<CallExpression>exp.expression).expression.kind !== 6) {
    return false;
  }

  if ((<IdentifierExpression>(<CallExpression>exp.expression).expression).text !== '__collect') {
    return false;
  }

  return true;
}
