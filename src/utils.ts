import { LessonTimeLocation, Lesson } from "./models";

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

export function uniqueLessons(lessons: Lesson[]): Lesson[] {
  const keys: { [id: string]: boolean } = {};
  const result: Lesson[] = [];
  lessons.forEach(val => {
    const key = val.jxb_id;
    if (!(key in keys)) {
      keys[key] = true;
      result.push(val);
    }
  });
  result.sort((a, b) => (a.kch < b.kch ? -1 : a.kch > b.kch ? 1 : 0));
  return result;
}

export function downloadFile(filename: string, data: string) {
  const link = document.createElement("a");
  link.download = filename;
  const blob = new Blob([data], { type: "text/plain" });
  link.href = window.URL.createObjectURL(blob);
  link.click();
}
