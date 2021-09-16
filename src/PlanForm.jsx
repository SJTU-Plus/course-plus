import sortBy from 'lodash/sortBy'
import sumBy from 'lodash/sumBy'
import uniqBy from 'lodash/uniqBy'
import React from 'react'
import Form from 'react-bootstrap/Form'
import { useParams } from 'react-router-dom'

import ExportICSForm from './ExportICS'
import { useLessonData } from './Utils'

export default ({
  state,
  setState,
  starLesson,
  removeStarLesson,
  colorMapping,
}) => {
  const { semester } = useParams()
  const { data: lessons } = useLessonData(semester)

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

    return (
      <>
        <Form.Row className='mb-3'>
          <Form.Label>
            星标课程 (
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
                <Form.Check.Input
                  type='checkbox'
                  checked={state.has(lesson.jxbmc)}
                  onChange={handleCheckChange}
                  value={lesson.jxbmc}
                />
                <Form.Check.Label>
                  <span
                    className='course-square'
                    style={{ backgroundColor: colorMapping[lesson.jxbmc] }}
                  ></span>
                  <span className='ml-1 d-inline-block'>{lesson.kch}</span>
                  <span className='ml-2 d-inline-block'>{lesson.kcmc}</span>
                  <span className='ml-2 d-inline-block'>{lesson.jszc}</span>
                  <a
                    className='ml-2 small'
                    onClick={() => removeStarLesson(lesson.jxbmc)}
                  >
                    移除
                  </a>
                </Form.Check.Label>
              </Form.Check>
            ))}
          </div>
        </Form.Row>

        <button
          type='button'
          className='btn btn-sm btn-outline-primary'
          onClick={() => setState(new Set())}
        >
          全部取消选中
        </button>

        <hr />

        <ExportICSForm
          semester={semester}
          selectedLessonObj={selectedLessonObj}
        ></ExportICSForm>
      </>
    )
  } else {
    return <div></div>
  }
}
