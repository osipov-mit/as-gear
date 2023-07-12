ft: build_transformer
	@npx lerna run --scope fungible-token asbuild:debug
	@./wasm-proc --assembly-script build/ft.debug.wasm
	@rm -f build/ft*.meta.wasm
	@ls -l build/ft*.wasm

enum:
	@npx lerna run --scope enum asbuild:debug
	@./wasm-proc --assembly-script build/enum.debug.wasm
	# @./wasm-proc --skip-stack-end build/enum.debug.wasm
	@rm -f build/enum*.meta.wasm
	@ls -l build/enum*.wasm

build_enum: build_transformer enum

struct:
	@npx lerna run --scope struct asbuild:debug
	@./wasm-proc build/struct.debug.wasm
	@rm -f build/struct*.meta.wasm
	@ls -l build/struct*.wasm

build_struct: build_transformer struct

build_ping:
	@npx lerna run --scope ping asbuild:debug
	@./wasm-proc --assembly-script build/ping.debug.wasm
	@rm -f build/ping*.meta.wasm
	@ls -l build/ping*.wasm



build_sum:
	@npx lerna run --scope sum asbuild:debug
	@./wasm-proc --assembly-script build/sum.debug.wasm
	@rm -f build/sum*.meta.wasm
	@ls -l build/sum*.wasm

mult:
	@npx lerna run --scope multiplier asbuild:debug
	@./wasm-proc --assembly-script build/multiplier.debug.wasm
	@rm -f build/multiplier*.meta.wasm
	@ls -l build/multiplier*.wasm

build_mult: build_transformer mult

panic:
	@npx lerna run --scope panic asbuild:debug
	@./wasm-proc --assembly-script build/panic.debug.wasm
	@rm -f build/panic*.meta.wasm
	@ls -l build/panic*.wasm

build_panic: build_transformer panic

build_examples: build_transformer build_ping build_sum build_enum build_struct build_panic

build_transformer:
	@npx lerna run --scope as-gear-transformer build

clear:
	@rm -rfv build

.PHONY: test clear