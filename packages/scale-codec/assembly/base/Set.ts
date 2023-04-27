// import { u8aToHex } from '../utils';
// import { Codec } from './Codec';
// import { CompactInt } from './numbers/Compact';

// function getBufLen<T extends Codec>(set: Set<T>): u64 {
//   let len = <u64>0;
//   const array = set.values();
//   for (let i = <i32>0; i < set.size; i++) {
//     len += array[i].bytesLen;
//   }
//   return len;
// }

// export class ScaleSet<T extends Codec> extends Set<T> implements Codec {
//   private _bytesLen: u32;
//   private _bytes: Uint8Array | null;

//   constructor() {
//     super();
//     this._bytesLen = 0;
//     this._bytes = null;
//   }

//   encode(): Uint8Array {
//     const bufLen = getBufLen<T>(this);
//     const numOfItemsU8a = new CompactInt(this.size).encode();

//     const result = new Uint8Array(<i32>bufLen + numOfItemsU8a.length);
//     result.set(numOfItemsU8a);

//     let offset = numOfItemsU8a.length;

//     const array = this.values();

//     //TODO figure out why the size of set is wrong without tracing the size
//     // trace(this.size.toString());

//     for (let i = <i32>0; i < this.size; i++) {
//       const encoded = array[i].encode();
//       result.set(encoded, offset);
//       offset += <i32>encoded.length;
//     }
//     this._bytes = result;
//     this._bytesLen = result.length;
//     return result;
//   }

//   decode(value: Uint8Array): void {
//     this.clear();
//     const len = CompactInt.decode(value);
//     value = value.slice(len.bytesLen);
//     for (let i = <u64>0; i < len.value; i++) {
//       const instance = instantiate<T>();
//       instance.decode(value);
//       this.add(instance);
//       value = value.slice(instance.bytesLen);
//     }
//   }

//   get bytesLen(): u32 {
//     return this._bytesLen;
//   }

//   static decode<T extends Codec>(value: Uint8Array): ScaleSet<T> {
//     const set = new ScaleSet<T>();
//     set.decode(value);
//     return set;
//   }

//   static from<T extends Codec>(array: Array<T>): ScaleSet<T> {
//     const set = new ScaleSet<T>();
//     for (let i = 0; i < array.length; i++) {
//       set.add(array[i]);
//     }
//     return set;
//   }

//   toHex(): string {
//     if (!this._bytes) {
//       this.encode;
//     }
//     return u8aToHex(this._bytes!);
//   }
// }
