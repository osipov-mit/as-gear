import { msg } from 'as-gcore/assembly';
import { I32 } from 'as-scale-codec/assembly';

export function handle(): void {
  const bytes = msg.read();

  const input = I32.decode(bytes);

  const result = input.mul(I32.from(2));

  msg.reply(result.encode());
}
