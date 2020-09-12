export type LessonIndex = {
  year: string
  semester: string
  updated_at: string
}

export type FilterFormData = {
  checkedNj: Set
  checkedLx: Set
  checkedYx: Set
  scheduleKey: String
  lecturerKey: String
  placeKey: String
  keywordType: String
  keyword: String
  composition: String
}
