import {
  DeclaredElement,
  IdentifierExpression,
  NamedTypeNode,
  Node,
  NodeKind,
  SourceKind,
  TypeNode,
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

export function getTypeName(prop: NamedTypeNode) {
  let name = getName(prop);
  if (prop.typeArguments !== null && prop.typeArguments.length !== 0) {
    name += '<' + getTypeArgs(prop.typeArguments) + '>';
  }
  return name;
}

function getTypeArgs(args: TypeNode[]) {
  let result = '';
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.kind === NodeKind.NamedType) {
      result += getName(<NamedTypeNode>arg);
      const typeArgs = (<NamedTypeNode>arg).typeArguments as TypeNode[];
      if (typeArgs !== null && typeArgs.length > 0) {
        result += '<' + getTypeArgs(typeArgs) + '>';
      }
    }
    if (i < args.length - 1) result += ', ';
  }
  return result;
}

function getName(node: NamedTypeNode): string {
  const name = node.name.identifier.text;
  switch (name) {
    case 'ScaleString':
      return 'String';
    case 'ScaleMap':
      return 'BTreeMap';
    default:
      return name;
  }
}
const HEX_CHARS: string = '0123456789abcdef';

export function u8aToHex(value: Uint8Array): string {
  const hex = new Array<string>(value.length * 2);
  for (let i = 0; i < value.length; i++) {
    let v = value[i] & 0xff;
    hex[i * 2] = HEX_CHARS[v >> 4];
    hex[i * 2 + 1] = HEX_CHARS[v & 0x0f];
  }
  return hex.join('');
}

export enum DefaultTypes {
  U8 = 'U8',
  U16 = 'U16',
  U32 = 'U32',
  U64 = 'U64',
  U128 = 'U128',
  I8 = 'I8',
  I16 = 'I16',
  I32 = 'I32',
  I64 = 'I64',
  I128 = 'I128',
  Bool = 'Bool',
  String = 'String',
  Option = 'Option',
  Vec = 'Vec',
  Result = 'Result',
  Map = 'BTreeMap',
}
