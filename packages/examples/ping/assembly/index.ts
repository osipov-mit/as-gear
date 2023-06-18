import { msg, debug } from 'as-gear-core/assembly';
import { ScaleString } from 'as-scale-codec/assembly';

export function handle(): void {
  const bytes = msg.read();
  const str = ScaleString.decode(bytes);
  if (str == ScaleString.from('PING')) {
    msg.reply(ScaleString.from('PONG').encode());
  } else {
    debug(str.value);
  }
}
