export function getPath(obj, path) {
  return path.split('.').reduce((o, key) => (o == null ? o : o[key]), obj);
}

export function setPath(obj, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((o, key) => o[key], obj);
  target[last] = value;
  return obj;
}

export function deepMerge(base, override) {
  if (Array.isArray(base) || Array.isArray(override) || typeof base !== 'object' || base === null || typeof override !== 'object' || override === null) {
    return override === undefined ? base : override;
  }
  const out = { ...base };
  for (const key of Object.keys(override)) {
    out[key] = deepMerge(base[key], override[key]);
  }
  return out;
}
