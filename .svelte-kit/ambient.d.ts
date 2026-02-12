
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
	export const NoDefaultCurrentDirectoryInExePath: string;
	export const CONDA_SHLVL: string;
	export const NVM_DIR: string;
	export const CONDA_EXE: string;
	export const HF_HOME: string;
	export const npm_config_node_gyp: string;
	export const VSCODE_NLS_CONFIG: string;
	export const SSH_CONNECTION: string;
	export const npm_execpath: string;
	export const _: string;
	export const LANG: string;
	export const HISTCONTROL: string;
	export const SINGULARITY_DISABLE_CACHE: string;
	export const HISTTIMEFORMAT: string;
	export const HOSTNAME: string;
	export const EDITOR: string;
	export const PAM_KRB5CCNAME: string;
	export const NVM_CD_FLAGS: string;
	export const npm_config_global_prefix: string;
	export const SINGULARITY_TMPDIR: string;
	export const npm_package_json: string;
	export const CONDA_PREFIX: string;
	export const CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING: string;
	export const npm_config_user_agent: string;
	export const GIT_EDITOR: string;
	export const SSH_AUTH_SOCK: string;
	export const VIRTUAL_ENV: string;
	export const npm_config_init_module: string;
	export const NCARG_ROOT: string;
	export const S_COLORS: string;
	export const _CE_M: string;
	export const which_declare: string;
	export const XDG_SESSION_ID: string;
	export const CURL_CA_BUNDLE: string;
	export const USER: string;
	export const npm_config_userconfig: string;
	export const npm_lifecycle_event: string;
	export const VSCODE_RECONNECTION_GRACE_TIME: string;
	export const SELINUX_ROLE_REQUESTED: string;
	export const MCP_CONNECTION_NONBLOCKING: string;
	export const PWD: string;
	export const NCARG_DATABASE: string;
	export const HOME: string;
	export const npm_config_cache: string;
	export const CONDA_PYTHON_EXE: string;
	export const BROWSER: string;
	export const SSH_CLIENT: string;
	export const LMOD_VERSION: string;
	export const npm_command: string;
	export const SELINUX_LEVEL_REQUESTED: string;
	export const BASH_ENV: string;
	export const COREPACK_ENABLE_AUTO_PIN: string;
	export const VSCODE_CWD: string;
	export const CLAUDECODE: string;
	export const CLAUDE_CODE_ENTRYPOINT: string;
	export const SSL_CERT_FILE: string;
	export const npm_config_noproxy: string;
	export const _CE_CONDA: string;
	export const NCARG_LIB: string;
	export const VSCODE_IPC_HOOK_CLI: string;
	export const TMPDIR: string;
	export const LMOD_sys: string;
	export const VSCODE_ESM_ENTRYPOINT: string;
	export const npm_config_npm_version: string;
	export const WANDB_API_KEY: string;
	export const SCRATCH: string;
	export const LMOD_ROOT: string;
	export const CONDA_PROMPT_MODIFIER: string;
	export const VSCODE_HANDLES_SIGPIPE: string;
	export const VSCODE_CLI_REQUIRE_TOKEN: string;
	export const npm_config_globalconfig: string;
	export const MAIL: string;
	export const npm_lifecycle_script: string;
	export const INIT_CWD: string;
	export const SHELL: string;
	export const NCARG_GRAPHCAPS: string;
	export const VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
	export const NVM_BIN: string;
	export const SELINUX_USE_CURRENT_RANGE: string;
	export const COLOR: string;
	export const ELECTRON_RUN_AS_NODE: string;
	export const OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: string;
	export const SHLVL: string;
	export const npm_node_execpath: string;
	export const npm_config_prefix: string;
	export const MANPATH: string;
	export const npm_config_local_prefix: string;
	export const BNB_CUDA_VERSION: string;
	export const VSCODE_AGENT_FOLDER: string;
	export const MODULEPATH: string;
	export const npm_package_version: string;
	export const SSL_CERT_DIR: string;
	export const LOGNAME: string;
	export const XDG_RUNTIME_DIR: string;
	export const MODULEPATH_ROOT: string;
	export const PATH: string;
	export const DEBUGINFOD_URLS: string;
	export const NCARG_NCARG: string;
	export const MODULESHOME: string;
	export const CONDA_DEFAULT_ENV: string;
	export const LMOD_SETTARG_FULL_SUPPORT: string;
	export const PKG_CONFIG_PATH: string;
	export const NVM_INC: string;
	export const NODE: string;
	export const HISTSIZE: string;
	export const NCARG_FONTCAPS: string;
	export const LMOD_PKG: string;
	export const XML_CATALOG_FILES: string;
	export const npm_package_name: string;
	export const LMOD_CMD: string;
	export const APPLICATION_INSIGHTS_NO_STATSBEAT: string;
	export const CVS_RSH: string;
	export const OMP_NUM_THREADS: string;
	export const LESSOPEN: string;
	export const GITHUB_PAGES: string;
	export const LMOD_DIR: string;
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
		NoDefaultCurrentDirectoryInExePath: string;
		CONDA_SHLVL: string;
		NVM_DIR: string;
		CONDA_EXE: string;
		HF_HOME: string;
		npm_config_node_gyp: string;
		VSCODE_NLS_CONFIG: string;
		SSH_CONNECTION: string;
		npm_execpath: string;
		_: string;
		LANG: string;
		HISTCONTROL: string;
		SINGULARITY_DISABLE_CACHE: string;
		HISTTIMEFORMAT: string;
		HOSTNAME: string;
		EDITOR: string;
		PAM_KRB5CCNAME: string;
		NVM_CD_FLAGS: string;
		npm_config_global_prefix: string;
		SINGULARITY_TMPDIR: string;
		npm_package_json: string;
		CONDA_PREFIX: string;
		CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING: string;
		npm_config_user_agent: string;
		GIT_EDITOR: string;
		SSH_AUTH_SOCK: string;
		VIRTUAL_ENV: string;
		npm_config_init_module: string;
		NCARG_ROOT: string;
		S_COLORS: string;
		_CE_M: string;
		which_declare: string;
		XDG_SESSION_ID: string;
		CURL_CA_BUNDLE: string;
		USER: string;
		npm_config_userconfig: string;
		npm_lifecycle_event: string;
		VSCODE_RECONNECTION_GRACE_TIME: string;
		SELINUX_ROLE_REQUESTED: string;
		MCP_CONNECTION_NONBLOCKING: string;
		PWD: string;
		NCARG_DATABASE: string;
		HOME: string;
		npm_config_cache: string;
		CONDA_PYTHON_EXE: string;
		BROWSER: string;
		SSH_CLIENT: string;
		LMOD_VERSION: string;
		npm_command: string;
		SELINUX_LEVEL_REQUESTED: string;
		BASH_ENV: string;
		COREPACK_ENABLE_AUTO_PIN: string;
		VSCODE_CWD: string;
		CLAUDECODE: string;
		CLAUDE_CODE_ENTRYPOINT: string;
		SSL_CERT_FILE: string;
		npm_config_noproxy: string;
		_CE_CONDA: string;
		NCARG_LIB: string;
		VSCODE_IPC_HOOK_CLI: string;
		TMPDIR: string;
		LMOD_sys: string;
		VSCODE_ESM_ENTRYPOINT: string;
		npm_config_npm_version: string;
		WANDB_API_KEY: string;
		SCRATCH: string;
		LMOD_ROOT: string;
		CONDA_PROMPT_MODIFIER: string;
		VSCODE_HANDLES_SIGPIPE: string;
		VSCODE_CLI_REQUIRE_TOKEN: string;
		npm_config_globalconfig: string;
		MAIL: string;
		npm_lifecycle_script: string;
		INIT_CWD: string;
		SHELL: string;
		NCARG_GRAPHCAPS: string;
		VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
		NVM_BIN: string;
		SELINUX_USE_CURRENT_RANGE: string;
		COLOR: string;
		ELECTRON_RUN_AS_NODE: string;
		OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: string;
		SHLVL: string;
		npm_node_execpath: string;
		npm_config_prefix: string;
		MANPATH: string;
		npm_config_local_prefix: string;
		BNB_CUDA_VERSION: string;
		VSCODE_AGENT_FOLDER: string;
		MODULEPATH: string;
		npm_package_version: string;
		SSL_CERT_DIR: string;
		LOGNAME: string;
		XDG_RUNTIME_DIR: string;
		MODULEPATH_ROOT: string;
		PATH: string;
		DEBUGINFOD_URLS: string;
		NCARG_NCARG: string;
		MODULESHOME: string;
		CONDA_DEFAULT_ENV: string;
		LMOD_SETTARG_FULL_SUPPORT: string;
		PKG_CONFIG_PATH: string;
		NVM_INC: string;
		NODE: string;
		HISTSIZE: string;
		NCARG_FONTCAPS: string;
		LMOD_PKG: string;
		XML_CATALOG_FILES: string;
		npm_package_name: string;
		LMOD_CMD: string;
		APPLICATION_INSIGHTS_NO_STATSBEAT: string;
		CVS_RSH: string;
		OMP_NUM_THREADS: string;
		LESSOPEN: string;
		GITHUB_PAGES: string;
		LMOD_DIR: string;
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
