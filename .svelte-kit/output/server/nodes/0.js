import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.426O_Co-.js","_app/immutable/chunks/scheduler.Dz6rpRjC.js","_app/immutable/chunks/index.Bq3CIXiF.js","_app/immutable/chunks/stores.BKHtJ5Lc.js","_app/immutable/chunks/entry.C7zXIbAw.js"];
export const stylesheets = ["_app/immutable/assets/0.BTPaK8o_.css"];
export const fonts = [];
