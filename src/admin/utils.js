/** Immutable set: returns a copy of `obj` with `value` written at `path` (array of keys). */
export function setIn(obj, path, value) {
  if (!path.length) return value;
  const [key, ...rest] = path;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  copy[key] = setIn(obj?.[key] ?? (typeof rest[0] === 'number' ? [] : {}), rest, value);
  return copy;
}

export const getIn = (obj, path) => path.reduce((o, k) => (o == null ? o : o[k]), obj);

export const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

export const uniqueId = (base, taken) => {
  const root = slugify(base) || 'item';
  let id = root;
  let n = 2;
  while (taken.includes(id)) id = `${root}-${n++}`;
  return id;
};

export const move = (list, from, to) => {
  if (to < 0 || to >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};
