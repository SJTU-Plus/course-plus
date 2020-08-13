import { LessonTimeLocation } from "./models";

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

export function parseTimeLocation(
  time: string,
  location: string
): LessonTimeLocation[] {
  const tl: LessonTimeLocation[] = [];
  if (!time) time = "";
  if (!location) location = "";
  const tt = time.split(";");
  const ll = location.split(";");
  for (let i = 0; i < Math.max(tt.length, ll.length); i++) {
    const time = i < tt.length ? tt[i] : "";
    const location = i < ll.length ? ll[i] : "";
    if (tl.find(val => val.time == time && val.location == location)) continue;
    tl.push({ time, location });
  }
  return tl;
}
