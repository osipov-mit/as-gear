clear:
	@npm run --silent clear

build_debug:
	@npm run --silent asbuild:debug

build_release:
	@npm run --silent asbuild:release

build: build_debug build_release

run_tests:
	@npm run --silent test

test: clear build_debug run_tests

.PHONY: build test