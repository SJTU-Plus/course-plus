import { createEvents, EventAttributes } from "ics";
import { parseTimeLocation } from "@/utils";

export interface LessonIndex {
  year: string;
  semester: string;
  updated_at: string;
}

export interface Lesson {
  qsjsz: string;
  zjs: string;
  jszc: string;
  kkbm_id: string;
  cdbh: string;
  jxb_id: string;
  xkrs: number;
  xqj: number;
  kch_id: string;
  zhxs: string;
  kch: string;
  kkxy: string;
  cdskjc: string;
  xqm: string;
  jxbrs: number;
  zjxh: number;
  cdmc: string;
  zcd: number;
  sksj: string;
  kcmc: string;
  totalresult: number;
  kklx: string;
  skjc: string;
  xqh_id: string;
  jxbmc: string;
  xf: string;
  rwzxs: number;
  jxbzc: string;
  kcxzmc: string;
  xkbz: string;
  cdjc: number;
  cdqsjsz: string;
  xnm: string;
  xn: string;
  xqmc: string;
  jsxx: string;
  xq: string;
  jc: number;
  nj: string;
  row_id: number;
  jxdd: string;
}

export interface SearchFilter {
  checkedNj: string[];
  checkedLx: string[];
  checkedYx: string[];
  scheduleKey: string;
  lecturerKey: string;
  placeKey: string;
  keyword: {
    keywordType: string;
    keyword: string;
  };
  composition: string;
}

export type ClassTableMapping = { [id: string]: boolean };

export const idOf = (week: number, day: number, block: number) => {
  return `${week}-${day}-${block}`;
};

export interface ClassTableConfig {
  simpleMode: boolean;
}

export interface LessonTimeLocation {
  time: string;
  location: string;
}

export const dayName = [
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
  "星期日"
];

export interface LessonDetail {
  profile: {
    englishIntro: string;
    chineseIntro: string;
  };
}

export function parseBin(data: number): number[] {
  const result = [];
  let i = 1;
  while (data > 0) {
    if (data % 2 == 1) result.push(i);
    i += 1;
    data = data >> 1;
  }
  return result;
}

export function mappingOf(course: Lesson): ClassTableMapping {
  const mapping: ClassTableMapping = {};
  parseBin(course.zcd).forEach(week => {
    parseBin(course.cdjc).forEach(block => {
      mapping[idOf(week, course.xqj, block)] = true;
    });
  });
  return mapping;
}

function addDays(date: Date, days: number): Date {
  const nDate = new Date(date.valueOf());
  nDate.setDate(nDate.getDate() + days);
  return nDate;
}

const timeAt = [
  "8:00",
  "8:55",
  "10:00",
  "10:55",
  "12:00",
  "12:55",
  "14:00",
  "14:55",
  "16:00",
  "16:55",
  "18:00",
  "18:55",
  "19:35",
  "20:15"
].map(x => {
  const [hour, minute] = x.split(":");
  return parseInt(hour) * 60 + parseInt(minute);
});

export function parseTimeLocationDay(
  time: string,
  location: string,
  day: number
): string {
  const tl = parseTimeLocation(time, location);
  let result = "数据解析出错";
  tl.forEach(x => {
    if (x.time.substring(0, 3) == dayName[day - 1]) {
      result = x.location;
    }
  });
  return result;
}

export function generateICS(lessons: Lesson[], begin: Date): string {
  const events: EventAttributes[] = [];
  lessons.forEach(lesson => {
    parseBin(lesson.zcd).forEach(week => {
      const blocks = parseBin(lesson.cdjc);
      const start = Math.min(...blocks) - 1;
      const end = Math.max(...blocks) - 1;
      const time = addDays(begin, (week - 1) * 7 + lesson.xqj - 1);
      const startAt = timeAt[start];
      const endAt = timeAt[end] + 45;
      const duration = endAt - startAt;
      const event: EventAttributes = {
        start: [
          time.getFullYear(),
          time.getMonth() + 1,
          time.getDate(),
          Math.floor(startAt / 60),
          startAt % 60
        ],
        duration: { hours: Math.floor(duration / 60), minutes: duration % 60 },
        title: `${lesson.kch} ${lesson.kcmc}`,
        description: `${lesson.jszc}, ${lesson.xf} 学分, 第 ${week} 周`,
        location: parseTimeLocationDay(lesson.sksj, lesson.jxdd, lesson.xqj)
      };
      events.push(event);
    });
  });
  const { error, value } = createEvents(events);
  if (error) {
    alert(error);
  }
  if (value) return value;
  else return "";
}
