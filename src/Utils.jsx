import React, { useState } from 'react'
import useSWR from 'swr'

import { lessonFetcher } from './SWRFetcher'

export function BreakLine(props) {
  const result = props.data.split(props.sep)
  return (
    <ul className='list-unstyled'>
      {result.map((x, idx) => (
        <li key={idx}>{x}</li>
      ))}
    </ul>
  )
}

export function parseTimeLocation(time, location) {
  const tl = []
  if (!time) time = ''
  if (!location) location = ''
  const tt = time.split(';')
  const ll = location.split(';')
  for (let i = 0; i < Math.max(tt.length, ll.length); i++) {
    const time = i < tt.length ? tt[i] : ''
    const location = i < ll.length ? ll[i] : ''
    if (tl.find((val) => val.time === time && val.location === location))
      continue
    tl.push({ time, location })
  }
  return tl
}

export function parseTimeLocationDay(time, location, day) {
  const tl = parseTimeLocation(time, location)
  let result = '数据解析出错'
  tl.forEach((x) => {
    if (x.time.substring(0, 3) === dayName[day - 1]) {
      result = x.location
    }
  })
  return result
}

export function TimeLocation(props) {
  const result = parseTimeLocation(props.time, props.location)
  return (
    <ul className='list-unstyled'>
      {result.map((lesson, idx) => (
        <li key={idx}>
          {lesson.time} {lesson.location}
        </li>
      ))}
    </ul>
  )
}

export function useLessonData(semester) {
  return useSWR(`/course-plus-data/lessonData_${semester}.json`, lessonFetcher)
}

export function useIndexData() {
  return useSWR(`/course-plus-data/lessonData_index.json`, lessonFetcher)
}

export function useLessonDetail() {
  return useSWR(`/course-plus-data/lesson_description_2019.json`, lessonFetcher)
}

export const dayName = [
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期日',
]

export function parseBin(data) {
  const result = []
  let i = 1
  while (data > 0) {
    if (data % 2 === 1) result.push(i)
    i += 1
    data = data >> 1
  }
  return result
}

export function checkBin(data, bit) {
  return (data & (1 << bit)) !== 0
}

export function useLocalStorageSet(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? new Set(JSON.parse(item)) : initialValue
    } catch (error) {
      // If error also return initialValue
      console.log(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify([...valueToStore]))
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error)
    }
  }

  return [storedValue, setValue]
}

export function filterKeyword(dataRaw, filterForm) {
  let filteringData = dataRaw
  const keyword = filterForm.keyword
  const keywordType = filterForm.keywordType
  const scheduleKey = filterForm.scheduleKey
  const lecturerKey = filterForm.lecturerKey
  const placeKey = filterForm.placeKey
  const composition = filterForm.composition
  const notes = filterForm.notes

  if (keyword) {
    filteringData = filteringData.filter((lesson) => {
      if (lesson[keywordType]) {
        return lesson[keywordType].toLowerCase().includes(keyword.toLowerCase())
      } else {
        return false
      }
    })
  }
  if (scheduleKey) {
    filteringData = filteringData.filter((lesson) =>
      lesson.sksj.includes(scheduleKey)
    )
  }
  if (lecturerKey) {
    filteringData = filteringData.filter((lesson) =>
      lesson.jsxx.includes(lecturerKey)
    )
  }
  if (placeKey) {
    filteringData = filteringData.filter((lesson) =>
      (lesson.jxdd || '').includes(placeKey)
    )
  }
  if (composition) {
    filteringData = filteringData.filter((lesson) =>
      lesson.jxbzc.split(';').some((x) => x.includes(composition))
    )
  }
  if (notes) {
    filteringData = filteringData.filter((lesson) =>
      (lesson.xkbz || '').includes(notes)
    )
  }
  return filteringData
}

export function filterDataForm(dataRaw, filterForm) {
  let filteringData = filterKeyword(dataRaw, filterForm)
  const checkedNj = filterForm.checkedNj
  const checkedLx = filterForm.checkedLx
  const checkedYx = filterForm.checkedYx

  if (checkedNj.size) {
    filteringData = filteringData.filter((lesson) =>
      lesson.nj.split(',').some((x) => checkedNj.has(x))
    )
  }
  if (checkedLx.size) {
    filteringData = filteringData.filter((lesson) =>
      checkedLx.has(lesson.kcxzmc)
    )
  }
  if (checkedYx.size) {
    filteringData = filteringData.filter((lesson) => checkedYx.has(lesson.kkxy))
  }
  return filteringData
}
