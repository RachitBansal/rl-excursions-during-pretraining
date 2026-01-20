import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.D9xc3N8e.js","_app/immutable/chunks/scheduler.Dz6rpRjC.js","_app/immutable/chunks/index.CC-ciazE.js","_app/immutable/chunks/each.CIP44Kv6.js","_app/immutable/chunks/stores.BovDM2oA.js","_app/immutable/chunks/entry.BDpS92Jp.js"];
export const stylesheets = ["_app/immutable/assets/0.BeZLgl2-.css"];
export const fonts = [];
