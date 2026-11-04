/** Tiny translator for islands: the dictionary subset is passed as a prop. */
export type Dict = Record<string, string>;
export function makeT(dict: Dict) {
  return (key: string, params?: Record<string, string | number>): string => {
    const s = dict[key] ?? key;
    return params
      ? s.replace(/\{(\w+)\}/g, (m, k: string) => (params[k] !== undefined ? String(params[k]) : m))
      : s;
  };
}
