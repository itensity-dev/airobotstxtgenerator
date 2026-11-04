/** Build-time Open Graph images (1200×630) with satori + resvg. */
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const require = createRequire(import.meta.url);
const dir = (pkg: string) => join(dirname(require.resolve(`${pkg}/package.json`)), 'files');

let fonts: { name: string; data: Buffer; weight: 400 | 700; style: 'normal' }[] | null = null;
function loadFonts() {
  if (fonts) return fonts;
  const os = dir('@fontsource/old-standard-tt');
  const lf = dir('@fontsource/libre-franklin');
  const jp = dir('@fontsource/noto-sans-jp');
  fonts = [
    { name: 'Old Standard TT', data: readFileSync(join(os, 'old-standard-tt-latin-700-normal.woff')), weight: 700, style: 'normal' },
    { name: 'Old Standard TT', data: readFileSync(join(os, 'old-standard-tt-latin-ext-700-normal.woff')), weight: 700, style: 'normal' },
    { name: 'Libre Franklin', data: readFileSync(join(lf, 'libre-franklin-latin-400-normal.woff')), weight: 400, style: 'normal' },
    { name: 'Libre Franklin', data: readFileSync(join(lf, 'libre-franklin-latin-ext-400-normal.woff')), weight: 400, style: 'normal' },
    { name: 'Libre Franklin', data: readFileSync(join(lf, 'libre-franklin-latin-700-normal.woff')), weight: 700, style: 'normal' },
    ...readdirSync(jp)
      .filter((f) => /-700-normal\.woff$/.test(f) && !/latin|cyrillic|vietnamese/.test(f))
      .map((f) => ({ name: 'Noto Sans JP', data: readFileSync(join(jp, f)), weight: 700 as const, style: 'normal' as const })),
  ];
  return fonts;
}

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } });

export interface OgInput {
  kicker: string;
  title: string;
  lead: string;
  stamp?: { text: string; color: string } | undefined;
  footer: string;
  japanese?: boolean;
}

export async function renderOg(o: OgInput): Promise<Buffer> {
  const ink = '#1a1916';
  const display = o.japanese ? 'Noto Sans JP' : 'Old Standard TT';
  const text = o.japanese ? 'Noto Sans JP' : 'Libre Franklin';
  const title = o.title.length > 70 ? o.title.slice(0, 68) + '…' : o.title;
  const lead = o.lead.length > 170 ? o.lead.slice(0, 168) + '…' : o.lead;
  const tree = h(
    'div',
    { width: 1200, height: 630, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#f5f0e5', color: ink, padding: '44px 64px', fontFamily: text },
    [
      h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 14, borderBottom: `6px solid ${ink}` }, [
        h('div', { fontFamily: 'Old Standard TT', fontSize: 40, fontWeight: 700 }, 'AI Robots.txt Generator'),
        h('div', { fontSize: 20, fontFamily: 'Libre Franklin' }, 'airobotstxtgenerator.com'),
      ]),
      h('div', { height: 2, background: ink, marginTop: 4 }),
      h('div', { display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', gap: 18 }, [
        h('div', { fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#4b463e', fontFamily: o.japanese ? 'Noto Sans JP' : 'Libre Franklin' }, o.kicker),
        h('div', { fontSize: title.length > 40 ? 62 : 76, fontWeight: 700, lineHeight: 1.08, fontFamily: display }, title),
        h('div', { fontSize: 28, lineHeight: 1.35, color: '#2c2a25', fontFamily: text, fontWeight: o.japanese ? 700 : 400 }, lead),
      ]),
      h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `2px solid ${ink}`, paddingTop: 16 }, [
        h('div', { fontSize: 20, color: '#4b463e', fontFamily: text, fontWeight: o.japanese ? 700 : 400 }, o.footer),
        o.stamp
          ? h('div', { display: 'flex', fontSize: 20, fontWeight: 700, letterSpacing: 3, color: o.stamp.color, border: `3px double ${o.stamp.color}`, padding: '6px 14px', textTransform: 'uppercase', fontFamily: 'Libre Franklin' }, o.stamp.text)
          : h('div', { display: 'flex' }, ''),
      ]),
    ],
  );
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts: loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
