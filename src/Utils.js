import React from 'react'
import useSWR from 'swr'
import { useQueryParam } from 'use-query-params'

import fetcher from './SWRFetcher'

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

export function TimeLocation (props) {
  const result = parseTimeLocation(props.time, props.location)
  return (<ul className='list-unstyled'>
    {result.map((lesson, idx) =>
      <li key={idx}>{lesson.time} {lesson.location}</li>
    )}
  </ul>)
}

export function useLessonData (semester) {
  return useSWR(`/course-plus-data/lessonData_${semester}.json`, fetcher)
}

export function useQueryParamReplace (key, config) {
  const [query, setQuery] = useQueryParam(key, config)

  const setQueryReplace = (newQuery, updateType = 'replaceIn') =>
    setQuery(newQuery, updateType)

  return [query, setQueryReplace]
}
