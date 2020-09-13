import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import {
  useLocation,
  useParams,
  withRouter
} from 'react-router-dom'

export default withRouter(({ history }) => {
  const [lessonList, setLessonList] = useState([])
  const location = useLocation()
  const { semester, path } = useParams()

  useEffect(() => {
    const getLessonIndex = async () => {
      const response = (await axios.get('/course-plus-data/lessonData_index.json')).data
      const lastIndex = response[response.length - 1]
      if (path) {
        history.push(`/${lastIndex.year}_${lastIndex.semester}/${path}`)
      } else {
        history.push(`/${lastIndex.year}_${lastIndex.semester}/browse`)
      }
      setLessonList(response)
    }

    getLessonIndex().then()
  }, [history])

  const onPathChange = event => {
    history.push(`/${event.target.value}/${path}`)
  }

  return (<div className='form-row'>
    <Form.Group className='col mb-3'>
      <Form.Label>学年学期</Form.Label>
      <Form.Control as='select' custom
        onChange={onPathChange}>

        {lessonList.map(option =>
          <option value={`${option.year}_${option.semester}`} key={`${option.year}_${option.semester}`}>
            {option.year} 学年,
            第 {option.semester} 学期
            (更新于 {option.updated_at})
          </option>
        ).reverse()}
      </Form.Control>
    </Form.Group>
  </div>)
})
