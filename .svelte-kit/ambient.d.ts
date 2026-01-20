
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const LESSOPEN: string;
	export const LMOD_DIR: string;
	export const CONDA_PROMPT_MODIFIER: string;
	export const USER: string;
	export const SSH_CLIENT: string;
	export const CODER1_EXEC: string;
	export const npm_config_user_agent: string;
	export const LMOD_COLORIZE: string;
	export const GIT_ASKPASS: string;
	export const LMOD_PKG: string;
	export const npm_node_execpath: string;
	export const SHLVL: string;
	export const BROWSER: string;
	export const npm_config_noproxy: string;
	export const HOME: string;
	export const CONDA_SHLVL: string;
	export const OLDPWD: string;
	export const TERM_PROGRAM_VERSION: string;
	export const NVM_BIN: string;
	export const VSCODE_IPC_HOOK_CLI: string;
	export const npm_package_json: string;
	export const NVM_INC: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const GURU_DATA_DIR: string;
	export const PS1: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const npm_config_userconfig: string;
	export const npm_config_local_prefix: string;
	export const PYDEVD_DISABLE_FILE_VALIDATION: string;
	export const BUNDLED_DEBUGPY_PATH: string;
	export const COLORTERM: string;
	export const LMOD_sys: string;
	export const COLOR: string;
	export const NVM_DIR: string;
	export const npm_config_metrics_registry: string;
	export const LOGNAME: string;
	export const LMOD_VERSION: string;
	export const _: string;
	export const npm_config_prefix: string;
	export const npm_config_npm_version: string;
	export const CLAUDE_CODE_SSE_PORT: string;
	export const TERM: string;
	export const npm_config_cache: string;
	export const HF_TOKEN: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const LMOD_PREPEND_BLOCK: string;
	export const LMOD_FULL_SETTARG_SUPPORT: string;
	export const NODE: string;
	export const npm_package_name: string;
	export const SHARE: string;
	export const STEM_LLM_JUDGE_URL_1: string;
	export const VSCODE_DEBUGPY_ADAPTER_ENDPOINTS: string;
	export const LANG: string;
	export const STEM_LLM_JUDGE_URL_2: string;
	export const VIRTUAL_ENV_PROMPT: string;
	export const LS_COLORS: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const TERM_PROGRAM: string;
	export const npm_lifecycle_script: string;
	export const CONDA_PYTHON_EXE: string;
	export const SHELL: string;
	export const MODULEPATH_ROOT: string;
	export const WANDB_ENTITY: string;
	export const npm_package_version: string;
	export const npm_lifecycle_event: string;
	export const LESSCLOSE: string;
	export const CONDA_BIN_MEGATRON_PATH: string;
	export const CONDA_DEFAULT_ENV: string;
	export const LMOD_CMD: string;
	export const CONDA_BIN_PATH: string;
	export const VIRTUAL_ENV: string;
	export const VSCODE_GIT_IPC_AUTH_TOKEN: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const BASH_ENV: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const PWD: string;
	export const npm_execpath: string;
	export const CONDA_EXE: string;
	export const SSH_CONNECTION: string;
	export const NVM_CD_FLAGS: string;
	export const XDG_DATA_DIRS: string;
	export const npm_config_global_prefix: string;
	export const npm_command: string;
	export const LMOD_arch: string;
	export const CONDA_PREFIX: string;
	export const MANPATH: string;
	export const TMOUT: string;
	export const MODULEPATH: string;
	export const MODULESHOME: string;
	export const LMOD_SETTARG_CMD: string;
	export const INIT_CWD: string;
	export const EDITOR: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		LESSOPEN: string;
		LMOD_DIR: string;
		CONDA_PROMPT_MODIFIER: string;
		USER: string;
		SSH_CLIENT: string;
		CODER1_EXEC: string;
		npm_config_user_agent: string;
		LMOD_COLORIZE: string;
		GIT_ASKPASS: string;
		LMOD_PKG: string;
		npm_node_execpath: string;
		SHLVL: string;
		BROWSER: string;
		npm_config_noproxy: string;
		HOME: string;
		CONDA_SHLVL: string;
		OLDPWD: string;
		TERM_PROGRAM_VERSION: string;
		NVM_BIN: string;
		VSCODE_IPC_HOOK_CLI: string;
		npm_package_json: string;
		NVM_INC: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		GURU_DATA_DIR: string;
		PS1: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		npm_config_userconfig: string;
		npm_config_local_prefix: string;
		PYDEVD_DISABLE_FILE_VALIDATION: string;
		BUNDLED_DEBUGPY_PATH: string;
		COLORTERM: string;
		LMOD_sys: string;
		COLOR: string;
		NVM_DIR: string;
		npm_config_metrics_registry: string;
		LOGNAME: string;
		LMOD_VERSION: string;
		_: string;
		npm_config_prefix: string;
		npm_config_npm_version: string;
		CLAUDE_CODE_SSE_PORT: string;
		TERM: string;
		npm_config_cache: string;
		HF_TOKEN: string;
		npm_config_node_gyp: string;
		PATH: string;
		LMOD_PREPEND_BLOCK: string;
		LMOD_FULL_SETTARG_SUPPORT: string;
		NODE: string;
		npm_package_name: string;
		SHARE: string;
		STEM_LLM_JUDGE_URL_1: string;
		VSCODE_DEBUGPY_ADAPTER_ENDPOINTS: string;
		LANG: string;
		STEM_LLM_JUDGE_URL_2: string;
		VIRTUAL_ENV_PROMPT: string;
		LS_COLORS: string;
		VSCODE_GIT_IPC_HANDLE: string;
		TERM_PROGRAM: string;
		npm_lifecycle_script: string;
		CONDA_PYTHON_EXE: string;
		SHELL: string;
		MODULEPATH_ROOT: string;
		WANDB_ENTITY: string;
		npm_package_version: string;
		npm_lifecycle_event: string;
		LESSCLOSE: string;
		CONDA_BIN_MEGATRON_PATH: string;
		CONDA_DEFAULT_ENV: string;
		LMOD_CMD: string;
		CONDA_BIN_PATH: string;
		VIRTUAL_ENV: string;
		VSCODE_GIT_IPC_AUTH_TOKEN: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		BASH_ENV: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		PWD: string;
		npm_execpath: string;
		CONDA_EXE: string;
		SSH_CONNECTION: string;
		NVM_CD_FLAGS: string;
		XDG_DATA_DIRS: string;
		npm_config_global_prefix: string;
		npm_command: string;
		LMOD_arch: string;
		CONDA_PREFIX: string;
		MANPATH: string;
		TMOUT: string;
		MODULEPATH: string;
		MODULESHOME: string;
		LMOD_SETTARG_CMD: string;
		INIT_CWD: string;
		EDITOR: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
