import countBy from 'lodash/countBy'
import flatMap from 'lodash/flatMap'
import keys from 'lodash/keys'
import sortBy from 'lodash/sortBy'
import React, { useReducer } from 'react'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import {
  useParams,
  withRouter
} from 'react-router-dom'

import { useLessonData } from './Utils'

export default withRouter(({ history, state, setState }) => {
  const { semester } = useParams()
  const { data: lessons } = useLessonData(semester)
  const handleStateChange = e => {
    const value = e.target.value
    const name = e.target.name
    setState({ [name]: value })
  }
  const handleCheckChange = e => {
    const name = e.target.name
    const checked = e.target.checked
    const value = e.target.value
    const set = new Set(state[name])
    if (checked) {
      set.add(value)
    } else {
      set.delete(value)
    }
    setState({ [name]: set })
  }
  const dataNj = countBy(flatMap(lessons, lesson => lesson.nj.split(',')))
  const dataLx = countBy(lessons, 'kcxzmc')
  const dataYx = countBy(lessons, 'kkxy')
  if (lessons) {
    return (
      <div>
        <Form.Row>
          <Form.Group className='col mb-3'>
            <Form.Label>检索方式</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <Form.Control as='select' name='keywordType' value={state.keywordType} onChange={handleStateChange} custom>
                  <option value='kcmc'>课程名称</option>
                  <option value='kch'>课号</option>
                </Form.Control>
              </InputGroup.Prepend>
              <Form.Control placeholder='不限' name='keyword' value={state.keyword} onChange={handleStateChange} />
            </InputGroup>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group className='col-md-4 mb-3'>
            <Form.Label>上课时间</Form.Label>
            <Form.Control placeholder='不限' name='scheduleKey' value={state.scheduleKey} onChange={handleStateChange} />
          </Form.Group>
          <Form.Group className='col-md-4 mb-3'>
            <Form.Label>教师</Form.Label>
            <Form.Control placeholder='不限' name='lecturerKey' value={state.lecturerKey} onChange={handleStateChange} />
          </Form.Group>
          <Form.Group className='col-md-4 mb-3'>
            <Form.Label>地点</Form.Label>
            <Form.Control placeholder='不限' name='placeKey' value={state.placeKey} onChange={handleStateChange} />
          </Form.Group>
        </Form.Row>
        <hr />
        <Form.Row className='mb-3'>
          <Form.Label>年级</Form.Label>
          <div className='col-12'>
            {sortBy(keys(dataNj)).map(key =>
              <Form.Check type='checkbox' key={key} id={key} custom>
                <Form.Check.Input type='checkbox' name='checkedNj' checked={state.checkedNj.has(key)} onChange={handleCheckChange} value={key} />
                <Form.Check.Label>
                  {key}
                  <Badge pill variant='secondary' className='ml-1'>{dataNj[key]}</Badge>
                </Form.Check.Label>
              </Form.Check>)}
          </div>
        </Form.Row>
        <Form.Row className='mb-3'>
          <Form.Label>课程类型</Form.Label>
          <div className='col-12'>
            {sortBy(keys(dataLx)).map(key =>
              <Form.Check type='checkbox' key={key} id={key} custom>
                <Form.Check.Input type='checkbox' name='checkedLx' checked={state.checkedLx.has(key)} onChange={handleCheckChange} value={key} />
                <Form.Check.Label>
                  {key}
                  <Badge pill variant='secondary' className='ml-1'>{dataLx[key]}</Badge>
                </Form.Check.Label>
              </Form.Check>)}
          </div>
        </Form.Row>
        <Form.Row className='mb-3'>
          <Form.Label>开课院系</Form.Label>
          <div className='col-12'>
            {sortBy(keys(dataYx)).map(key =>
              <Form.Check type='checkbox' key={key} id={key} custom>
                <Form.Check.Input type='checkbox' name='checkedYx' checked={state.checkedYx.has(key)} onChange={handleCheckChange} value={key} />
                <Form.Check.Label>
                  {key}
                  <Badge pill variant='secondary' className='ml-1'>{dataYx[key]}</Badge>
                </Form.Check.Label>
              </Form.Check>)}
          </div>
        </Form.Row>
      </div>
    )
  } else {
    return (
      <div className='d-flex align-items-center'>
        <div className='spinner-border spinner-border-sm mr-3 text-info' />
        <span className='text-info'>正在加载数据……</span>
      </div>
    )
  }
})
