export function cmpChs(a: string, b: string) {
  return a.localeCompare(b, "zh-cn");
}
export function range(count: number, startAt: number) {
  return [...Array(count).keys()].map(i => i + startAt);
}
