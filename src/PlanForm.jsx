import sortBy from 'lodash/sortBy'
import uniqBy from 'lodash/uniqBy'
import React from 'react'
import Form from 'react-bootstrap/Form'
import { useParams } from 'react-router-dom'

import { useLessonData } from './Utils'

export default ({ state, setState, starLesson, colorMapping }) => {
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
    return (
      <Form.Row className='mb-3'>
        <Form.Label>星标课程</Form.Label>
        <div className='col-12'>
          {uniqBy(
            sortBy(
              lessons.filter((lesson) => starLesson.has(lesson.jxbmc)),
              'kch'
            ),
            'jxbmc'
          ).map((lesson) => (
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
                <span className='ml-1 d-inline-block'>{lesson.kcmc}</span>
                <span className='ml-1 d-inline-block'>{lesson.jszc}</span>
              </Form.Check.Label>
            </Form.Check>
          ))}
        </div>
      </Form.Row>
    )
  } else {
    return <div></div>
  }
}
