import sortBy from 'lodash/sortBy'
import sumBy from 'lodash/sumBy'
import uniqBy from 'lodash/uniqBy'
import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import { useParams } from 'react-router-dom'

import { generateICS } from './calendar'
import { useLessonData } from './Utils'

function downloadFile(filename, data) {
  const link = document.createElement('a')
  link.download = filename
  const blob = new Blob([data], { type: 'text/plain' })
  link.href = window.URL.createObjectURL(blob)
  link.click()
}

export default ({
  state,
  setState,
  starLesson,
  colorMapping,
  classTableMode,
  syncFromISJTU,
}) => {
  const { semester } = useParams()
  const { data: lessons } = useLessonData(semester)
  const [firstDayDate, setFirstDayDate] = useState('2020-09-07')

  const handleCheckChange = (e) => {
    const checked = e.target.checked
    const value = e.target.value
    const set = new Set(state)
    if (checked) {
      set.add(value)
    } else {
      set.delete(value)
    }
    setState(set)
  }

  if (lessons) {
    const starLessonObj = sortBy(
      lessons.filter((lesson) => starLesson.has(lesson.jxbmc)),
      'kch'
    )

    const selectedLessonObj = sortBy(
      lessons.filter((lesson) => state.has(lesson.jxbmc)),
      'kch'
    )

    const downloadAsICS = () => {
      downloadFile(
        `classtable-${semester}.ics`,
        generateICS(selectedLessonObj, new Date(firstDayDate))
      )
    }

    return (
      <div>
        <Form.Row className='mb-3'>
          <Form.Label>
            {classTableMode ? '已选课程' : '星标课程'} (
            {sumBy(
              uniqBy(selectedLessonObj, 'jxbmc').map((l) => parseFloat(l.xf))
            )}{' '}
            /{' '}
            {sumBy(uniqBy(starLessonObj, 'jxbmc').map((l) => parseFloat(l.xf)))}{' '}
            学分)
          </Form.Label>
          <div className='col-12'>
            {uniqBy(starLessonObj, 'jxbmc').map((lesson) => (
              <Form.Check
                type='checkbox'
                key={lesson.jxbmc}
                id={lesson.jxbmc}
                custom
              >
                {classTableMode ? (
                  ''
                ) : (
                  <Form.Check.Input
                    type='checkbox'
                    checked={state.has(lesson.jxbmc)}
                    onChange={handleCheckChange}
                    value={lesson.jxbmc}
                  />
                )}
                <Form.Check.Label>
                  <span
                    className='course-square'
                    style={{ backgroundColor: colorMapping[lesson.jxbmc] }}
                  ></span>
                  <span className='ml-1 d-inline-block'>{lesson.kch}</span>
                  <span className='ml-2 d-inline-block'>{lesson.kcmc}</span>
                  <span className='ml-2 d-inline-block'>{lesson.jszc}</span>
                </Form.Check.Label>
              </Form.Check>
            ))}
          </div>
        </Form.Row>

        <Form.Row className='mb-1'>
          {classTableMode ? (
            <div className='col-12 mb-5'>
              <button
                type='button'
                className='btn btn-sm btn-outline-primary'
                onClick={() => syncFromISJTU(semester)}
              >
                从教学信息服务网同步
              </button>
            </div>
          ) : (
            ''
          )}
          <Form.Group className='col-12 mb-1'>
            <Form.Label>本学期第一天</Form.Label>
            <Form.Control
              name='firstDayDate'
              value={firstDayDate}
              onChange={(e) => setFirstDayDate(e.target.value)}
            />
          </Form.Group>
          <div className='col-12 mb-1'>
            <button
              type='button'
              className='btn btn-sm btn-outline-primary'
              onClick={downloadAsICS}
            >
              导出到 iCalendar
            </button>
          </div>
        </Form.Row>
      </div>
    )
  } else {
    return <div></div>
  }
}
