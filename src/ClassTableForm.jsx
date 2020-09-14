import sortBy from 'lodash/sortBy'
import sumBy from 'lodash/sumBy'
import uniqBy from 'lodash/uniqBy'
import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import { useParams } from 'react-router-dom'

import ExportICSForm from './ExportICS'
import { useLessonData } from './Utils'

export default ({ sjtuLesson, dataLoading, syncFromISJTU, colorMapping }) => {
  const { semester } = useParams()
  const { data: lessons } = useLessonData(semester)

  const onSyncClick = () => {
    syncFromISJTU(semester)
  }

  if (lessons) {
    const sjtuLessonObj = sortBy(
      lessons.filter((lesson) => sjtuLesson.has(lesson.jxbmc)),
      'kch'
    )

    return (
      <>
        <div className='mb-1 row'>
          <div className='col-12'>
            本学期课程 (共{' '}
            {sumBy(uniqBy(sjtuLessonObj, 'jxbmc').map((l) => parseFloat(l.xf)))}{' '}
            学分)
          </div>
          <div className='col-12'>
            <ul className='list-unstyled'>
              {uniqBy(sjtuLessonObj, 'jxbmc').map((lesson) => (
                <li className='d-flex flex-row' key={lesson.jxbmc}>
                  <div>
                    <span
                      className='course-square'
                      style={{ backgroundColor: colorMapping[lesson.jxbmc] }}
                    ></span>
                  </div>
                  <div>
                    <span className='ml-1 d-inline-block'>{lesson.kch}</span>
                    <span className='ml-2 d-inline-block'>{lesson.kcmc}</span>
                    <span className='ml-2 d-inline-block'>{lesson.jszc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Form.Row className='mb-1'>
          <div className='col-12'>
            <button
              type='button'
              className='btn btn-sm btn-outline-primary'
              onClick={onSyncClick}
              disabled={dataLoading}
            >
              {dataLoading ? (
                <div className='spinner-border spinner-border-sm mr-1 text-primary'></div>
              ) : (
                ''
              )}
              同步数据
            </button>
          </div>
        </Form.Row>
        <hr />
        <ExportICSForm
          semester={semester}
          selectedLessonObj={sjtuLessonObj}
        ></ExportICSForm>
      </>
    )
  } else {
    return <div></div>
  }
}
