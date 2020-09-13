import uniqBy from 'lodash/uniqBy'
import React, { useEffect, useState } from 'react'
import { InView } from 'react-intersection-observer'
import { useParams } from 'react-router-dom'

import LessonRow from './LessonRow'
import { filterDataForm, useLessonData } from './Utils'

const tableHeader = [
  '课号',
  '开课院系',
  '教师姓名',
  '课程',
  '学时/学分',
  '上课时间地点',
  '备注',
  '年级',
  '教学组成',
]

function DataLoaded({ loaded, size }) {
  if (!loaded) {
    return (
      <div>
        <div className='spinner-border spinner-border-sm mr-3 text-muted'></div>
        <span className='text-muted'>正在加载数据……</span>
      </div>
    )
  } else {
    return (
      <div>
        <div className='d-flex align-items-center justify-content-center mb-3'>
          <span className='text-muted'>以上为全部 {size} 条记录</span>
        </div>
      </div>
    )
  }
}

export default ({ filterData, state, setState }) => {
  const { semester } = useParams()
  const { data: lessonsRaw } = useLessonData(semester)
  const [entries, setEntries] = useState(100)

  const handleStateChange = ({ name, value }) => {
    const set = new Set(state)
    if (value) {
      set.add(name)
    } else {
      set.delete(name)
    }
    setState(set)
  }

  if (lessonsRaw) {
    const lessons = filterDataForm(uniqBy(lessonsRaw, 'jxbmc'), filterData)
    const truncatedLessons = lessons.slice(0, entries)

    const moreEntries = () => {
      setTimeout(
        () =>
          setEntries(Math.max(Math.min(entries + 100, lessons.length), 100)),
        300
      )
    }

    return (
      <div>
        <p className='text-center mt-3'>共 {lessons.length} 条记录</p>
        <div className='table-responsive-md'>
          <table className='table table-sm small sjtu-table'>
            <thead>
              <tr>
                {tableHeader.map((header) => (
                  <th scope='col' className='table-header' key={header}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {truncatedLessons.map((lesson) => (
                <LessonRow
                  lesson={lesson}
                  key={lesson.jxbmc}
                  name={lesson.jxbmc}
                  state={state.has(lesson.jxbmc)}
                  setState={handleStateChange}
                ></LessonRow>
              ))}
            </tbody>
          </table>
          <InView
            as='div'
            onChange={(inView) => {
              if (inView) moreEntries()
            }}
            className='d-flex align-items-center justify-content-center mb-3'
          >
            <DataLoaded
              loaded={entries >= lessons.length}
              size={lessons.length}
            ></DataLoaded>
          </InView>
        </div>
      </div>
    )
  } else {
    return <div></div>
  }
}
