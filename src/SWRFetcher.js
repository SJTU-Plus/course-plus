import { get } from 'axios'
import invert from 'lodash/invert'

export default (...args) => get(...args).then((resp) => resp.data)

export const lessonFetcher = (...args) =>
  get(...args).then((resp) =>
    resp.data.map((lesson, idx) => {
      if (!('kcxzmc' in lesson)) {
        lesson.kcxzmc = '无类型'
      }
      if (lesson.nj === 'wnj') {
        lesson.nj = '无年级'
      }
      lesson.row_id = idx
      return lesson
    })
  )

export const conversionFetcher = (...args) =>
  get(...args).then((resp) => {
    return {
      to_new: resp.data,
      to_old: invert(resp.data),
    }
  })
