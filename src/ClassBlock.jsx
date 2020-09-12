import flatMap from 'lodash/flatMap'
import keys from 'lodash/keys'
import max from 'lodash/max'
import sortBy from 'lodash/sortBy'
import React from 'react'

import { checkBin, parseBin, parseTimeLocationDay } from './Utils'

export default ({ day, block, colorMapping, classTableConfig, selectedLesson }) => {
  const weekDots = []
  const maxWeek = max(flatMap(selectedLesson, lesson => parseBin(lesson.zcd))) || 16
  const conflictLesson = []
  const showLesson = {}

  for (let week = 0; week < maxWeek; week++) {
    let dot = ''
    selectedLesson.forEach(lesson => {
      if (checkBin(lesson.zcd, week) && checkBin(lesson.cdjc, block - 1) && lesson.xqj === day) {
        if (dot !== '') {
          dot = 'CONFLICT'
          conflictLesson.push(lesson.jxbmc)
        } else {
          dot = lesson.jxbmc
        }
        if (block <= 1 || !checkBin(lesson.cdjc, block - 2)) {
          showLesson[lesson.jxbmc] = lesson
        }
      }
    })
    if (dot === '') {
      weekDots.push(<span className='week-dot-empty' key={week}></span>)
    } else if (dot === 'CONFLICT') {
      weekDots.push(<span className='week-dot-conflict' key={week}></span>)
    } else {
      weekDots.push(<span className='week-dot' style={{ backgroundColor: colorMapping[dot] }} key={week}></span>)
    }
  }
  return (<div className='small my-2'>
    <div>{weekDots}</div>
    {sortBy(keys(showLesson)).map(key => {
      const lesson = showLesson[key]
      return <div className='row mr-1' key={lesson.jxbmc}>
        <div className='col-auto p-0'>
          <span
            className='week-dot mr-1'
            style={{ backgroundColor: colorMapping[lesson.jxbmc] }}
          ></span>
        </div>
        <div className='col p-0'>
          <div>
            <span className={conflictLesson.includes(lesson.jxbmc) ? 'text-danger' : ''}>
              <span className='mr-1'>{lesson.kch}</span>
              <span>{lesson.kcmc}</span>
            </span>
            <br />
            <span className='mr-1'>{lesson.jszc}</span>
            <span>{lesson.xf} 学分</span>
            <br />
            {parseTimeLocationDay(lesson.sksj, lesson.jxdd, day)}
          </div>
        </div>
      </div>
    })}
  </div>
  )
}
