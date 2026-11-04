// Renders PNG/ICO icons from public/favicon.svg (run once; outputs are committed to public/).
import { readFileSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8');
const render = (size) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: size }, font: { loadSystemFonts: true } })
    .render()
    .asPng();
for (const [name, size] of [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  writeFileSync(new URL(`../public/${name}`, import.meta.url), render(size));
}
// favicon.ico with one embedded 32×32 PNG.
const png = render(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt8(0, 8);
header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
writeFileSync(new URL('../public/favicon.ico', import.meta.url), Buffer.concat([header, png]));
console.log('icons written');
