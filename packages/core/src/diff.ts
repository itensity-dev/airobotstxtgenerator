/** Minimal line diff (Myers' O(ND) algorithm) used to show what the merge mode changed. */
export interface DiffLine {
  type: 'same' | 'add' | 'remove';
  text: string;
  /** 1-based line number in the old text (same/remove). */
  oldLine?: number;
  /** 1-based line number in the new text (same/add). */
  newLine?: number;
}

export function diffLines(oldText: string, newText: string): DiffLine[] {
  const a = oldText.split(/\r\n|\r|\n/);
  const b = newText.split(/\r\n|\r|\n/);
  const n = a.length;
  const m = b.length;
  const max = n + m;
  const offset = max + 1;
  const v = new Int32Array(2 * max + 3);
  const trace: Int32Array[] = [];
  let found = false;
  for (let d = 0; d <= max && !found; d++) {
    trace.push(v.slice());
    for (let k = -d; k <= d; k += 2) {
      let x: number;
      if (k === -d || (k !== d && v[offset + k - 1]! < v[offset + k + 1]!)) x = v[offset + k + 1]!;
      else x = v[offset + k - 1]! + 1;
      let y = x - k;
      while (x < n && y < m && a[x] === b[y]) {
        x++;
        y++;
      }
      v[offset + k] = x;
      if (x >= n && y >= m) {
        found = true;
        break;
      }
    }
  }
  // Backtrack.
  const out: DiffLine[] = [];
  let x = n;
  let y = m;
  for (let d = trace.length - 1; d >= 0; d--) {
    const vd = trace[d]!;
    const k = x - y;
    let prevK: number;
    if (k === -d || (k !== d && vd[offset + k - 1]! < vd[offset + k + 1]!)) prevK = k + 1;
    else prevK = k - 1;
    const prevX = vd[offset + prevK]!;
    const prevY = prevX - prevK;
    while (x > prevX && y > prevY) {
      out.push({ type: 'same', text: a[x - 1]!, oldLine: x, newLine: y });
      x--;
      y--;
    }
    if (d > 0) {
      if (x === prevX) out.push({ type: 'add', text: b[y - 1]!, newLine: y });
      else out.push({ type: 'remove', text: a[x - 1]!, oldLine: x });
    }
    x = prevX;
    y = prevY;
  }
  return out.reverse();
}
