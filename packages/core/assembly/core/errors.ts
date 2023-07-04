export class SyscallError {
  code: u32;

  constructor(v: u32) {
    this.code = v;
  }

  assert(): void {
    if (this.code != 0) {
      throw new Error();
    }
  }
}
