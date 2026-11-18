import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Compile the same catalog and formulas used by the website into a Worker-safe
// module. The original Node server uses node:vm for execution limits; Workers
// do not implement that API, so the Worker invokes the already-vetted formulas
// directly after applying the same input validation and tenure caps.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const pluginRoot = resolve(root, 'chatgpt-plugin');
const read = path => readFileSync(resolve(root, path), 'utf8');
const between = (text, from, to) => {
  const start = text.indexOf(from);
  const end = text.indexOf(to, start + from.length);
  if (start < 0 || end <= start) throw new Error(`Source boundary changed: ${from} / ${to}`);
  return text.slice(start, end);
};
const replaceRequired = (source, target, replacement) => {
  if (!source.includes(target)) throw new Error(`Source boundary changed: ${target.slice(0, 85)}`);
  return source.replace(target, replacement);
};

const engine = between(read('calculator-core.js'),
  '  /* ===================== helpers ===================== */',
  "  const PINNED_FEATURES_KEY=");

let catalog = read('chatgpt-plugin/src/catalog.mjs');
catalog = catalog.slice(catalog.indexOf('const catalog = context.__sevenCatalog;'));
catalog = replaceRequired(catalog, 'const catalog = context.__sevenCatalog;', 'const catalog = __engine;');
catalog = replaceRequired(catalog,
  `  context.__calculationId = id;
  context.__calculationInputs = values;
  try {
    const rows = new Script('CALC_MAP[__calculationId].compute(__calculationInputs)', {
      filename: 'seventask-calculation.js',
    }).runInContext(context, { timeout: 400 });`,
  '  const rows = item.compute(values);');
catalog = replaceRequired(catalog,
  `  } finally {
    delete context.__calculationId;
    delete context.__calculationInputs;
  }
}`, '}');
catalog = catalog.replaceAll('export const ', 'const ').replaceAll('export function ', 'function ')
  .replaceAll('export async function ', 'async function ');

const handler = read('chatgpt-plugin/worker/handler.js');
const iconBase64 = readFileSync(resolve(pluginRoot, 'assets/seventask-icon.png')).toString('base64');
const widget = replaceRequired(read('chatgpt-plugin/public/result-widget.html'),
  '__STC_ICON_DATA_URI__', `data:image/png;base64,${iconBase64}`);
const output = [
  '// GENERATED. Edit scripts/build-worker.mjs and worker/handler.js, then rebuild.',
  `const __engine = (() => {\nconst window = { setTimeout, clearTimeout };\n${engine}\nreturn { categories: CATEGORIES, map: CALC_MAP };\n})();`,
  catalog,
  `const WIDGET_HTML = ${JSON.stringify(widget)};`,
  `const ICON_BYTES = Uint8Array.from(atob(${JSON.stringify(iconBase64)}), char => char.charCodeAt(0));`,
  handler,
].join('\n\n');
const outputPath = resolve(pluginRoot, 'dist/worker.mjs');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, output);
console.log(`Built ${outputPath}: ${Buffer.byteLength(output)} bytes, ${engine.length} formula bytes`);
