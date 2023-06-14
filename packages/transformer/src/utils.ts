import {
  DeclaredElement,
  FieldDeclaration,
  IdentifierExpression,
  NamedTypeNode,
  Node,
  NodeKind,
  PropertyPrototype,
  SourceKind,
  TypeName,
} from 'assemblyscript/dist/assemblyscript.js';

export function isUserEntryFile(node: Node): boolean {
  return node.range.source.sourceKind === SourceKind.UserEntry;
}

export function isUserFile(node: Node): boolean {
  return node.range.source.sourceKind === SourceKind.User;
}

export function hasDecorator(name: string, element: DeclaredElement): boolean {
  return element.declaration.decorators?.some((node) => (<IdentifierExpression>node.name).text === name) == true;
}

function getRegExp(typeName: string) {
  return new RegExp(`${typeName}<[<>\\w\\d, ]*>`);
}

export function getTypeName(ident: IdentifierExpression) {
  const nameStart = ident.range.source.text.slice(ident.range.start);
  const match = nameStart.match(getRegExp(ident.text));
  if (match === null) {
    return ident.text;
  }
  return match[0];
}

// export function getTypeName(prop: NamedTypeNode): TypeName {
//   return prop.name
// }

// export function getTypeArguments(prop: NamedTypeNode): NamedTypeNode[] {
//   if (prop.typeArguments == null || prop.typeArguments.length == 0) {
//     return [];
//   }

// }

// function getTypeArgs(ident: NamedTypeNode) {
//   if (ident.typeArguments == null || ident.typeArguments.length == 0) {
//     return '';
//   }
//   const args = [];
//   let result = '';
//   for (const arg of ident.typeArguments) {
//     args.push(arg.name);
//   }
// }
