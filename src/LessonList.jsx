import React from 'react'
import {
  useParams
} from 'react-router-dom'

import LessonRow from './LessonRow'
import { useLessonData } from './Utils'

const tableHeader = [
  '课号',
  '开课院系',
  '教师姓名',
  '课程',
  '学时/学分',
  '上课时间地点',
  '备注',
  '年级'
]

export default ({ filterData }) => {
  const { semester } = useParams()
  const { data: lessons } = useLessonData(semester)

  if (lessons) {
    return (
      <div>
        <p className='text-center mt-3'>共 {lessons.length} 条记录</p>
        <div className='table-responsive-md'>
          <table className='table table-sm small sjtu-table'>
            <thead>
              <tr>
                {tableHeader.map(header => <th
                  scope='col'
                  className='table-header'
                  key={header}
                >
                  {header}
                </th>)}

              </tr>
            </thead>
            <tbody>
              {lessons.slice(0, 100).map(lesson =>
                <LessonRow lesson={lesson} key={lesson.row_id}></LessonRow>
              )}
            </tbody>
          </table>
          <div
            className='d-flex align-items-center justify-content-center mb-3'
          >
            <div className='spinner-border spinner-border-sm mr-3 text-muted'></div>
            <span className='text-muted'>正在加载数据……</span>
          </div>
          <div
            className='d-flex align-items-center justify-content-center mb-3'
          >
            <span className='text-muted'>以上为全部 {lessons.length} 条记录</span>
          </div>
        </div>
      </div>)
  } else {
    return <div></div>
  }
}
