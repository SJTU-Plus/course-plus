export function cmpChs(a: string, b: string) {
  return a.localeCompare(b, "zh-cn");
}
export function range(count: number, startAt: number) {
  return [...Array(count).keys()].map(i => i + startAt);
}

export function toChsDate(date: string) {
  const x = date.split("-").map(x => +x);
  return `${x[0]}年${x[1]}月${x[2]}日`;
}
