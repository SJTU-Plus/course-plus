import 'moment/locale/zh-cn'

import axios from 'axios'
import concat from 'lodash/concat'
import find from 'lodash/find'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'

import { generateICS } from './calendar'
import { dayName } from './Utils'

function downloadFile(filename, data, mediaType) {
  const link = document.createElement('a')
  link.download = filename
  const blob = new Blob([data], { type: mediaType })
  link.href = window.URL.createObjectURL(blob)
  link.click()
}

const allFixtures = [
  {
    name: '2020 新生教学安排',
    rules: [
      { week: 1, day: 1, on: null },
      { week: 1, day: 2, on: null },
      { week: 1, day: 3, on: moment('2020-09-19', 'YYYY-MM-DD') },
      { week: 1, day: 4, on: moment('2020-10-17', 'YYYY-MM-DD') },
      { week: 1, day: 5, on: moment('2020-10-24', 'YYYY-MM-DD') },
    ],
  },
  {
    name: '2020 国庆节',
    rules: [
      { week: 4, day: 4, on: null },
      { week: 4, day: 5, on: null },
      { week: 5, day: 1, on: moment('2020-10-10', 'YYYY-MM-DD') },
      { week: 5, day: 2, on: moment('2020-09-27', 'YYYY-MM-DD') },
      { week: 5, day: 3, on: null },
      { week: 5, day: 4, on: null },
    ],
  },
  {
    name: '2021 春季学期 (清明节+劳动节+端午节)',
    rules: [
      { week: 7, day: 1, on: null },
      { week: 11, day: 2, on: moment('2021-04-25', 'YYYY-MM-DD') },
      { week: 11, day: 1, on: moment('2021-05-08', 'YYYY-MM-DD') },
      { week: 11, day: 3, on: null },
      { week: 17, day: 1, on: null },
    ],
  },
  {
    name: '2021 中秋+国庆',
    rules: [
      { week: 2, day: 1, on: moment('2021-09-18', 'YYYY-MM-DD') },
      { week: 2, day: 2, on: null },
      { week: 4, day: 2, on: moment('2021-09-26', 'YYYY-MM-DD') },
      { week: 4, day: 4, on: moment('2021-10-09', 'YYYY-MM-DD') },
      { week: 3, day: 5, on: null },
      { week: 4, day: 1, on: null },
      { week: 4, day: 3, on: null },
    ],
  },
]

export default function ({ semester, selectedLessonObj }) {
  const [firstDayDate, setFirstDayDate] = useState('')
  const [fixtures, setFixtures] = useState(new Set([]))

  useEffect(() => {
    const getLessonIndex = async () => {
      const semesterIndex = (
        await axios.get('/course-plus-data/lessonData_index.json')
      ).data
      const index = find(
        semesterIndex,
        (index) => semester === `${index.year}_${index.semester}`
      )
      setFirstDayDate((index || {}).first_day || '2021-01-01')
    }

    getLessonIndex().then()
  }, [semester])

  const getFixtures = () => {
    let result = []
    const selectedFixtures = allFixtures.filter((x) => fixtures.has(x.name))
    selectedFixtures.forEach((x) => {
      result = concat(result, x.rules)
    })
    return result
  }

  const downloadAsICS = () => {
    downloadFile(
      `classtable-${semester}.ics`,
      generateICS(
        selectedLessonObj,
        moment(firstDayDate),
        semester,
        getFixtures()
      ),
      'text/calendar'
    )
  }

  const handleCheckChange = (e) => {
    const checked = e.target.checked
    const value = e.target.value
    const set = new Set(fixtures)
    if (checked) {
      set.add(value)
    } else {
      set.delete(value)
    }
    setFixtures(set)
  }

  return (
    <Form.Row>
      <Form.Group className='col-12 mb-1'>
        <Form.Label className='small'>本学期第一天</Form.Label>
        <Form.Control
          name='firstDayDate'
          value={firstDayDate}
          onChange={(e) => setFirstDayDate(e.target.value)}
        />
      </Form.Group>
      <div className='col-12 mb-1'>
        {allFixtures.map((key) => (
          <Form.Check type='checkbox' key={key.name} id={key.name} custom>
            <Form.Check.Input
              type='checkbox'
              checked={fixtures.has(key.name)}
              onChange={handleCheckChange}
              value={key.name}
            />
            <Form.Check.Label>{key.name}</Form.Check.Label>
          </Form.Check>
        ))}
        <ul className='list-unstyled small'>
          {getFixtures().map((fixture, idx) => (
            <li key={idx}>
              第 {fixture.week} 周{dayName[fixture.day - 1]} (
              {moment(firstDayDate)
                .locale('zh-cn')
                .add((fixture.week - 1) * 7 + fixture.day - 1, 'day')
                .format('YYYY-MM-DD')}
              ){' '}
              {fixture.on
                ? fixture.on.format('[调至] YYYY-MM-DD (dddd)')
                : '不上课'}
            </li>
          ))}
        </ul>
      </div>
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
  )
}
