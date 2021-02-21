import chunk from 'lodash/chunk'
import flatMap from 'lodash/flatMap'
import keys from 'lodash/keys'
import map from 'lodash/map'
import max from 'lodash/max'
import sortBy from 'lodash/sortBy'
import React from 'react'
import { Tooltip } from 'react-tippy'

import LessonDetail from './LessonDetail'
import { checkBin, parseBin, parseTimeLocationDay } from './Utils'

function splitBy(elements, by) {
  return chunk(elements, by).map((chk, idx) => (
    <div className='d-block' key={idx}>
      {chk}
    </div>
  ))
}

function autoSplit(elements, chunkNumber) {
  return (
    <>
      <div className='d-md-none week-dot-wrapper'>
        {splitBy(elements, chunkNumber[0])}
      </div>
      <div className='d-none d-md-block d-xl-none week-dot-wrapper'>
        {splitBy(elements, chunkNumber[1])}
      </div>
      <div className='d-none d-xl-block week-dot-wrapper'>
        {splitBy(elements, chunkNumber[2])}
      </div>
    </>
  )
}

export default ({
  day,
  block,
  colorMapping,
  classTableConfig,
  selectedLesson,
}) => {
  const weekDots = []
  const maxWeek = max(flatMap(selectedLesson, (lesson) => parseBin(lesson.zcd)))
  const conflictLesson = []
  const showLesson = {}
  let showDots = false
  const maxDay = max(map(selectedLesson, 'xqj')) || 0
  const splitArray = maxDay <= 5 ? [8, 8, 16] : [4, 4, 8]

  for (let week = 0; week < maxWeek; week++) {
    let dot = ''
    selectedLesson.forEach((lesson) => {
      if (
        checkBin(lesson.zcd, week) &&
        checkBin(lesson.cdjc, block - 1) &&
        lesson.xqj === day
      ) {
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
      weekDots.push(
        <span className='week-dot week-dot-empty' key={week}></span>
      )
    } else if (dot === 'CONFLICT') {
      weekDots.push(
        <span className='week-dot week-dot-conflict' key={week}></span>
      )
      showDots = true
    } else {
      weekDots.push(
        <span
          className='week-dot week-dot-color'
          style={{ backgroundColor: colorMapping[dot] }}
          key={week}
        ></span>
      )
      showDots = true
    }
  }
  return (
    <div className='small my-2'>
      <div>{showDots ? autoSplit(weekDots, splitArray) : ''}</div>
      {sortBy(keys(showLesson)).map((key) => {
        const lesson = showLesson[key]
        return (
          <div className='row mr-1' key={lesson.jxbmc}>
            <div className='col-auto p-0'>
              <span
                className='week-dot week-dot-color mr-1'
                style={{ backgroundColor: colorMapping[lesson.jxbmc] }}
              ></span>
            </div>
            <div className='col p-0'>
              <div>
                <span
                  className={
                    conflictLesson.includes(lesson.jxbmc) ? 'text-danger' : ''
                  }
                >
                  <Tooltip
                    interactive
                    unmountHTMLWhenHide={true}
                    position='right'
                    html={
                      <LessonDetail
                        lesson={lesson}
                        color={colorMapping[lesson.jxbmc]}
                      ></LessonDetail>
                    }
                  >
                    <span className='mr-1'>{lesson.kch}</span>
                    <span>{lesson.kcmc}</span>
                  </Tooltip>
                </span>
                <br />
                <span className='mr-1'>{lesson.jszc}</span>
                <span>{lesson.xf} 学分</span>
                <br />
                {parseTimeLocationDay(lesson.sksj, lesson.jxdd, day)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
