import { read, size, reply } from 'as-gear-core';
import { ScaleString } from 'as-scale-codec';

export function handle(): void {
  const bytes = new Uint8Array(size());
  read(bytes);
  const str = ScaleString.decode(bytes);
  if (str == ScaleString.from('PING')) {
    reply(ScaleString.from('PONG').encode());
  }
}
