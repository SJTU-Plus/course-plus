import React from 'react'
import useSWR from 'swr'

import { lessonFetcher } from './SWRFetcher'

export function BreakLine (props) {
  const result = props.data.split(props.sep)
  return (<ul className='list-unstyled'>
    {result.map((x, idx) =>
      <li key={idx}>{x}</li>
    )}
  </ul>)
}

export function parseTimeLocation (
  time,
  location
) {
  const tl = []
  if (!time) time = ''
  if (!location) location = ''
  const tt = time.split(';')
  const ll = location.split(';')
  for (let i = 0; i < Math.max(tt.length, ll.length); i++) {
    const time = i < tt.length ? tt[i] : ''
    const location = i < ll.length ? ll[i] : ''
    if (tl.find(val => val.time === time && val.location === location)) continue
    tl.push({ time, location })
  }
  return tl
}

export function parseTimeLocationDay (
  time,
  location,
  day
) {
  const tl = parseTimeLocation(time, location)
  let result = '数据解析出错'
  tl.forEach(x => {
    if (x.time.substring(0, 3) === dayName[day - 1]) {
      result = x.location
    }
  })
  return result
}

export function TimeLocation (props) {
  const result = parseTimeLocation(props.time, props.location)
  return (<ul className='list-unstyled'>
    {result.map((lesson, idx) =>
      <li key={idx}>{lesson.time} {lesson.location}</li>
    )}
  </ul>)
}

export function useLessonData (semester) {
  return useSWR(`/course-plus-data/lessonData_${semester}.json`, lessonFetcher)
}

export const dayName = [
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期日'
]

export function parseBin (data) {
  const result = []
  let i = 1
  while (data > 0) {
    if (data % 2 === 1) result.push(i)
    i += 1
    data = data >> 1
  }
  return result
}

export function checkBin (data, bit) {
  return (data & (1 << bit)) !== 0
}
