import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.D8chsMeb.js","_app/immutable/chunks/scheduler.CHFMnfDQ.js","_app/immutable/chunks/index.BvnlO6mU.js","_app/immutable/chunks/paths.DKzkOzmW.js","_app/immutable/chunks/each.Cn-hsyDx.js","_app/immutable/chunks/stores.EgXvbmaj.js","_app/immutable/chunks/entry.Ch-h1KAn.js"];
export const stylesheets = ["_app/immutable/assets/0.ChBBf1Xn.css"];
export const fonts = [];
