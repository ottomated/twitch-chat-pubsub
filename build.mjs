import { build } from 'esbuild';

build({
	entryPoints: ['src/index.ts'],
	bundle: true,
	outfile: 'lib/index.js',
	external: ['util'],
	format: 'cjs',
});

build({
	entryPoints: ['src/index.ts'],
	bundle: true,
	outfile: 'lib/index.mjs',
	external: ['util'],
	format: 'esm',
});
