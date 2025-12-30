import type { Plugin } from "esbuild";

interface InlineWorkerOptions {
	workerName?: string;
	external?: string[];
}

/**
 * Minimal inline worker plugin.
 * The original dependency is not available in this environment, so this keeps the build working
 * by exposing a no-op plugin with the same signature.
 */
export default function inlineWorkerPlugin(_options: InlineWorkerOptions = {}): Plugin {
	return {
		name: "inline-worker-plugin",
		setup() {
			// No-op: this placeholder satisfies the build pipeline in environments
			// where the original plugin cannot be downloaded.
		},
	};
}

