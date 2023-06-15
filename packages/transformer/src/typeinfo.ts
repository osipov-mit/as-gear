import {
  ElementKind,
  FieldDeclaration,
  NamedTypeNode,
  PropertyPrototype,
  DeclaredElement,
  ClassPrototype,
} from 'assemblyscript/dist/assemblyscript.js';
import { getTypeName } from './utils.js';

export function generateStructTypeInfo(elem: ClassPrototype) {
  const members: Map<string, DeclaredElement> | null = elem.instanceMembers;
  if (!members) {
    return null;
  }

  const result: Record<string, string> = {};

  for (const [name, member] of Array.from(members?.entries() || [])) {
    if (member.kind === ElementKind.PropertyPrototype) {
      result[name] = getTypeName(
        (<FieldDeclaration>(<PropertyPrototype>member).fieldDeclaration).type as NamedTypeNode,
      );
    }
  }
  return { name: elem.name, def: result };
}
