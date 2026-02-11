import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.C21b7AdM.js","_app/immutable/chunks/scheduler.CHFMnfDQ.js","_app/immutable/chunks/index.B7zo_JMq.js","_app/immutable/chunks/entry.BA1Rdi2j.js","_app/immutable/chunks/each.12NJaz3W.js","_app/immutable/chunks/stores.CPOYYnEc.js"];
export const stylesheets = ["_app/immutable/assets/0.ChBBf1Xn.css"];
export const fonts = [];
