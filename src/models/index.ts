export interface LessonIndex {
  year: string;
  semester: string;
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
