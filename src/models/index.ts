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
