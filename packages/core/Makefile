wasm-proc:
	@wasm-proc build/release.wasm
	@ls -l build/*.wasm 

wasm-build:
	@asc assembly/index.ts --target release

build: wasm-build wasm-proc

clean:
	@rm -rf build

all: clean build

.PHONY: build clean all