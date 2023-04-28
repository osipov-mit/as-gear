build_ping:
	@npx lerna run --scope ping asbuild:release
	@wasm-proc build/ping.wasm
	@rm -f build/ping*.meta.wasm
	@ls -l build/ping*.wasm

build_sum:
	@npx lerna run --scope sum asbuild:debug
	@wasm-proc build/sum.debug.wasm
	@rm -f build/sum*.meta.wasm
	@ls -l build/sum*.wasm

build_examples: build_ping build_sum

run_sum_workflow:
	@gear-js workflow ./sum.yaml

test: build_sum run_sum_workflow

clear:
	@rm -rfv build

.PHONY: test clear