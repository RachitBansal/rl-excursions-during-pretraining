import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CRsqGZf7.js","_app/immutable/chunks/scheduler.Dz6rpRjC.js","_app/immutable/chunks/index.Dx860wGY.js","_app/immutable/chunks/stores.Zg02FEhg.js","_app/immutable/chunks/entry.BNWWcQ0o.js"];
export const stylesheets = ["_app/immutable/assets/0.BtuG7yZA.css"];
export const fonts = [];
