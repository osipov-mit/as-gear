import { read, size, reply, debug } from 'as-gear-core/assembly';
import { ScaleString } from 'as-scale-codec/assembly';

export function handle(): void {
  const bytes = new Uint8Array(size());
  read(bytes);
  const str = ScaleString.decode(bytes);
  if (str == ScaleString.from('PING')) {
    reply(ScaleString.from('PONG').encode());
  } else {
    debug(str.value);
  }
}
