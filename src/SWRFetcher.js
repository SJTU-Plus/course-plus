import { get } from 'axios'
export default (...args) => get(...args).then(resp => resp.data)

export const lessonFetcher = (...args) => get(...args).then(resp =>
  resp.data.map((lesson, idx) => {
    if (!('kcxzmc' in lesson)) {
      lesson.kcxzmc = '无类型'
    }
    if (lesson.nj === 'wnj') {
      lesson.nj = '无年级'
    }
    lesson.row_id = idx
    return lesson
  }))
