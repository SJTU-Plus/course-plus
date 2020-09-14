import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'

import { generateICS } from './calendar'

function downloadFile(filename, data, mediaType) {
  const link = document.createElement('a')
  link.download = filename
  const blob = new Blob([data], { type: mediaType })
  link.href = window.URL.createObjectURL(blob)
  link.click()
}

export default function ({ semester, selectedLessonObj }) {
  const [firstDayDate, setFirstDayDate] = useState('2020-09-07')
  const downloadAsICS = () => {
    downloadFile(
      `classtable-${semester}.ics`,
      generateICS(selectedLessonObj, new Date(firstDayDate)),
      'text/calendar'
    )
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
