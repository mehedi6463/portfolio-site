/**
 * Generates a clearly-labelled PLACEHOLDER CV at public/cv/Mehedi-Hasan-CV.pdf.
 * Replace that file with your real CV (keep the same name, or update `cvUrl` in src/data/site.js).
 */
import { mkdir, writeFile } from 'node:fs/promises';

const lines = [
  ['F2', 26, 'Mehedi Hasan'],
  ['F1', 14, 'Frontend Developer  |  5-6 Years of Experience'],
  ['F1', 11, ' '],
  ['F2', 16, 'PLACEHOLDER CV'],
  ['F1', 11, 'This document is a temporary placeholder.'],
  ['F1', 11, 'The real CV has not been supplied yet.'],
  ['F1', 11, ' '],
  ['F1', 11, 'To replace it: put your CV at public/cv/Mehedi-Hasan-CV.pdf'],
  ['F1', 11, 'and rebuild the site.'],
];

let y = 760;
const content = lines
  .map(([font, size, text]) => {
    const out = `BT /${font} ${size} Tf 72 ${y} Td (${text.replace(/[()\\]/g, '\\$&')}) Tj ET`;
    y -= size + 14;
    return out;
  })
  .join('\n');

const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>',
  `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
];

let pdf = '%PDF-1.4\n';
const offsets = [];
objects.forEach((obj, i) => {
  offsets.push(Buffer.byteLength(pdf));
  pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
});
const xref = Buffer.byteLength(pdf);
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
pdf += offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('');
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

await mkdir('public/cv', { recursive: true });
await writeFile('public/cv/Mehedi-Hasan-CV.pdf', pdf);
console.log('✓ public/cv/Mehedi-Hasan-CV.pdf (placeholder)');
