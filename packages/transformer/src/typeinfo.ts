import {
  ElementKind,
  FieldDeclaration,
  NamedTypeNode,
  PropertyPrototype,
  DeclaredElement,
  ClassPrototype,
  MethodDeclaration,
  File,
  TypeName,
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

export function generateEnumTypeInfo(f: File, elem: ClassPrototype) {
  const members: Map<string, DeclaredElement> = elem.instanceMembers!;

  if (!members) {
    return null;
  }

  const variantIndexTypeName = (<NamedTypeNode>(
    (<MethodDeclaration>members!.get('variantIndex')!.declaration).signature.returnType
  )).name.identifier.text;
  const variantsIndexType = f.members?.get(variantIndexTypeName) as ClassPrototype;

  const variantsEnum = variantsIndexType.members!.keys();

  const variantsTypeName = (<NamedTypeNode>(
    (<MethodDeclaration>members!.get('variants')!.declaration).signature.returnType
  )).name.identifier.text;

  const variantsType = f.members?.get(variantsTypeName) as ClassPrototype;

  const result: { ['_enum']: Record<string, string | null> } = { _enum: {} };

  const variants: Map<string, NamedTypeNode> = new Map();

  Array.from(variantsType.instanceMembers!.entries()).forEach(([name, prop]) => {
    if (prop.kind === ElementKind.PropertyPrototype) {
      const type = (<PropertyPrototype>prop).fieldDeclaration!.type as NamedTypeNode;
      variants.set(name, type);
    }
  });

  for (const name of variantsEnum) {
    const variant = variants.get(name);
    if (!variant) {
      result._enum[name] = null;
    } else {
      result._enum[name] = getTypeName(variant);
    }
  }
  return { name: elem.name, def: result };
}
