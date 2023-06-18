import { debug, msg } from 'as-gear-core/assembly';
import { MyEnum, Variants } from './io';

export function init(): void {
  let bytes = msg.read();
  let input = MyEnum.decode(bytes);

  if (input.match(Variants.Action1)) {
    debug(`Action1: ${input.variants!.Action1!.field1!.toString()}`);
  }

  if (input.match(Variants.Action2)) {
    debug(`Action2: ${input.variants!.Action2!.toString()}`);
  }

  if (input.match(Variants.Action3)) {
    debug(`Action3`);
  }

  const result = MyEnum.Action3();

  msg.reply(result.encode());
}
