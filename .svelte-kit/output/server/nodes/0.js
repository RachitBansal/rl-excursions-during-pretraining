import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.Cub6Q-dq.js","_app/immutable/chunks/scheduler.Dz6rpRjC.js","_app/immutable/chunks/index.Dx860wGY.js","_app/immutable/chunks/stores.wMCaai56.js","_app/immutable/chunks/entry.CIQAH391.js"];
export const stylesheets = ["_app/immutable/assets/0.BtuG7yZA.css"];
export const fonts = [];
