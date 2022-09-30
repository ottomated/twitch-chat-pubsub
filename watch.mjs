import { build } from 'esbuild';
import { spawn } from 'child_process';

let process;

build({
	entryPoints: ['src/test.ts'],
	bundle: true,
	platform: 'node',
	outfile: 'lib/index.dev.js',
	watch: {
		onRebuild: spawnResult,
	},
}).then(() => spawnResult());

function spawnResult(err) {
	if (process) process.kill();

	if (err) console.error(err);
	// run output
	console.log('Running:\n');
	process = spawn('node', ['lib/index.dev.js'], { stdio: 'inherit' });
}
