import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.g_BImftG.js","_app/immutable/chunks/scheduler.CHFMnfDQ.js","_app/immutable/chunks/index.BvnlO6mU.js","_app/immutable/chunks/paths.Dz6Zim6s.js","_app/immutable/chunks/each.Cn-hsyDx.js","_app/immutable/chunks/stores.Df1n8OY0.js","_app/immutable/chunks/entry.IXSR7iWE.js"];
export const stylesheets = ["_app/immutable/assets/0.ChBBf1Xn.css"];
export const fonts = [];
