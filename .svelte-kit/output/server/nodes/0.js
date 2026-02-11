import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.B9bRfBUy.js","_app/immutable/chunks/scheduler.CHFMnfDQ.js","_app/immutable/chunks/index.B7zo_JMq.js","_app/immutable/chunks/each.12NJaz3W.js","_app/immutable/chunks/stores.BDFdLui_.js","_app/immutable/chunks/entry.CQOgGdx2.js"];
export const stylesheets = ["_app/immutable/assets/0.U-9DGnEV.css"];
export const fonts = [];
