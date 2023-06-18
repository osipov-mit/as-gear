enum:
	@npx lerna run --scope enum asbuild:debug
	@./wasm-proc --skip-stack-end build/enum.debug.wasm
	@rm -f build/enum*.meta.wasm
	@ls -l build/enum*.wasm

build_enum: build_transformer enum

struct:
	@npx lerna run --scope struct asbuild:debug
	@./wasm-proc --skip-stack-end build/struct.debug.wasm
	@rm -f build/struct*.meta.wasm
	@ls -l build/struct*.wasm

build_struct: build_transformer struct

build_ping:
	@npx lerna run --scope ping asbuild:release
	@./wasm-proc --skip-stack-end build/ping.wasm
	@rm -f build/ping*.meta.wasm
	@ls -l build/ping*.wasm

build_sum:
	@npx lerna run --scope sum asbuild:debug
	@./wasm-proc build/sum.debug.wasm --skip-stack-end
	@rm -f build/sum*.meta.wasm
	@ls -l build/sum*.wasm

build_examples: build_ping build_sum

build_transformer:
	@npx lerna run --scope as-gear-transformer build

run_sum_workflow:
	@gear-js workflow ./sum.yaml

test: build_sum run_sum_workflow

clear:
	@rm -rfv build

.PHONY: test clear