import { createEvents } from 'ics'

import { parseBin, parseTimeLocationDay } from './Utils'

const timeAt = [
  '8:00',
  '8:55',
  '10:00',
  '10:55',
  '12:00',
  '12:55',
  '14:00',
  '14:55',
  '16:00',
  '16:55',
  '18:00',
  '18:55',
  '19:35',
  '20:15',
].map((x) => {
  const [hour, minute] = x.split(':')
  return parseInt(hour) * 60 + parseInt(minute)
})

function addDays(date, days) {
  const nDate = new Date(date.valueOf())
  nDate.setDate(nDate.getDate() + days)
  return nDate
}

export function generateICS(lessons, begin, semester) {
  const events = []
  lessons.forEach((lesson) => {
    parseBin(lesson.zcd).forEach((week) => {
      const blocks = parseBin(lesson.cdjc)
      const start = Math.min(...blocks) - 1
      const end = Math.max(...blocks) - 1
      const time = addDays(begin, (week - 1) * 7 + lesson.xqj - 1)
      const startAt = timeAt[start]
      const endAt = timeAt[end] + 45
      const duration = endAt - startAt
      const event = {
        start: [
          time.getFullYear(),
          time.getMonth() + 1,
          time.getDate(),
          Math.floor(startAt / 60),
          startAt % 60,
        ],
        duration: { hours: Math.floor(duration / 60), minutes: duration % 60 },
        title: `${lesson.kch} ${lesson.kcmc}`,
        description: `${lesson.jszc}, ${lesson.xf} 学分, 第 ${week} 周`,
        location: parseTimeLocationDay(lesson.sksj, lesson.jxdd, lesson.xqj),
        calName: `课程表 ${semester}`,
      }
      events.push(event)
    })
  })
  const { error, value } = createEvents(events)
  if (error) {
    alert(error)
  }
  if (value) return value
  else return ''
}
