import flatMap from 'lodash/flatMap'
import map from 'lodash/map'
import sortedBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'
import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import Form from 'react-bootstrap/Form'
import {
  useParams,
  withRouter
} from 'react-router-dom'

import { useLessonData } from './Utils'

export default withRouter(({ history }) => {
  const { semester } = useParams()
  const { data: lessons } = useLessonData(semester)
  const [lecturer, setLecturer] = useState([])
  const [location, setLocation] = useState([])
  const [time, setTime] = useState('')
  if (lessons) {
    return (
      <Form.Row>
        <Form.Group className='col-md-4 mb-3'>
          <Form.Label>上课时间</Form.Label>
          <Form.Control placeholder='不限' value={time} onChange={event => setTime(event.target.value)} />
        </Form.Group>
        <Form.Group className='col-md-4 mb-3'>
          <Form.Label>教师</Form.Label>
          <Typeahead
            id='lecturer'
            allowNew={() => true}
            onChange={x => setLecturer(x)}
            options={sortedBy(uniq(flatMap(map(lessons, lesson => lesson.jszc?.split(',') || []))))}
            placeholder='不限'
            selected={lecturer}
          />
        </Form.Group>
        <Form.Group className='col-md-4 mb-3'>
          <Form.Label>地点</Form.Label>
          <Typeahead
            id='location'
            allowNew={() => true}
            onChange={x => setLocation(x)}
            options={sortedBy(uniq(flatMap(map(lessons, lesson => lesson.jxdd?.split(';') || []))))}
            placeholder='不限'
            selected={location}
          />
        </Form.Group>
      </Form.Row>
    )
  } else {
    return (
      <div className='d-flex align-items-center'>
        <div className='spinner-border spinner-border-sm mr-3 text-info'/>
        <span className='text-info'>正在加载数据……</span>
      </div>
    )
  }
})
