export function buildQS<T>(o: T) {
  let qs = [];
  Object.entries(o).map(([key, value]) => {
    qs.push(`${key}=${value}`);
  });
  return qs.join("&");
}
