import { CodecClass } from 'as-scale-codec/assembly';

export interface InOut<In extends CodecClass | null, Out extends CodecClass | null> {
  in: In;
  out: Out;
}

export interface MetadataRepr {
  init: InOut<CodecClass | null, CodecClass | null>;
  handle: InOut<CodecClass | null, CodecClass | null>;
  reply: InOut<CodecClass | null, CodecClass | null>;
  others: InOut<CodecClass | null, CodecClass | null>;
  signal: CodecClass | null;
  state: CodecClass | null;
}

export declare function Metadata(): void;
