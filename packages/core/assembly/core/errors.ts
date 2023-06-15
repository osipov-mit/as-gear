import { gsys } from '../sys';

export class SyscallError {
  len: u32;

  constructor(v: u32) {
    this.len = v;
  }

  //TODO: decode error
  getErr(): Uint8Array {
    const buf = new Uint8Array(this.len);
    gsys.gr_error(<i32>buf.dataStart, this.len);
    return buf;
  }
}
