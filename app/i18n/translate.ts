export function translate(
  catalog: object,
  key: string,
  params?: Record<string, string | number>,
  fallback?: object,
): string {
  const value = lookup(catalog, key) ?? (fallback ? lookup(fallback, key) : undefined);
  if (typeof value !== "string") return key;
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (_, name: string) => {
    const param = params[name];
    return param === undefined ? `{${name}}` : String(param);
  });
}

function lookup(catalog: object, key: string): string | undefined {
  const parts = key.split(".");
  let current: unknown = catalog;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}
