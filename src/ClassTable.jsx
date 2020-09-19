import range from 'lodash/range'
import React from 'react'
import { useParams } from 'react-router-dom'

import ClassBlock from './ClassBlock'
import { dayName, useLessonData } from './Utils'

export default ({ selectedLesson, colorMapping }) => {
  const { semester } = useParams()
  const { data: lessons } = useLessonData(semester)
  if (lessons) {
    const selectedLessonObjects = lessons.filter((lesson) =>
      selectedLesson.has(lesson.jxbmc)
    )
    let colMax = 5
    selectedLessonObjects.forEach((lesson) => {
      if (lesson.xqj > 5) {
        colMax = 7
      }
    })
    const allCol = range(1, colMax + 1)
    return (
      <table className='table classtable-table'>
        <thead>
          <tr>
            <th scope='col' className='classtable-first-col'>
              #
            </th>
            {allCol.map((n, lessonCol) => (
              <th scope='col' key={lessonCol} className='classtable-col'>
                {dayName[lessonCol]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {range(1, 15).map((lessonRow) => (
            <tr v-for='lessonRow in 14' key={lessonRow}>
              <th scope='row' className='classtable-first-col p-1'>
                {lessonRow}
              </th>
              {allCol.map((lessonCol) => (
                <td scope='col' key={lessonCol} className='p-1'>
                  <ClassBlock
                    day={lessonCol}
                    block={lessonRow}
                    selectedLesson={selectedLessonObjects}
                    colorMapping={colorMapping}
                  ></ClassBlock>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  } else {
    return <div></div>
  }
}
