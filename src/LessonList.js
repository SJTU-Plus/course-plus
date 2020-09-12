import React from 'react'
import {
  useParams
} from 'react-router-dom'

import { BreakLine, TimeLocation, useLessonData } from './Utils'

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

export default () => {
  const { semester } = useParams()
  const { data } = useLessonData(semester)

  if (data) {
    const lessons = data.slice(0, 100)
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
              {lessons.map(lesson =>
                <tr key={lesson.row_id}>
                  <th className='kcbm' scope='row'>
                    {lesson.kch}
                    {/* <button
                    type="button"
                    className="btn btn-link btn-sm star-btn"
                    @click="star(lesson.jxb_id)"
                  > */}
                    {/* <span
                      v-bind:className="{
                        'text-primary': isStarred(lesson.jxb_id),
                        'text-muted': !isStarred(lesson.jxb_id)
                      }"
                    >
                      <StarIcon size="1.5x"></StarIcon>
                      { lesson.kch }
                    </span> */}
                    {/* </button> */}
                    <br />
                    {/* <popper
                    trigger="hover"
                    :options="{
                      placement: 'right',
                      modifiers: { offset: { offset: '0,10px' } }
                    }"
                  > */}
                    {/* <LessonDetail
                      :lesson="lesson"
                      :lessonDetail="lessonDetail"
                    ></LessonDetail> */}
                    {/*
                    <button
                      type="button"
                      className="btn btn-link btn-sm text-muted"
                      slot="reference"
                    >
                      详情
                    </button> */}
                    {/* </popper> */}
                  </th>
                  <td className='yxmc'>{lesson.kkxy}</td>
                  <td className='xm'><BreakLine data={lesson.jszc} sep=','></BreakLine></td>
                  <td className='kcmc'>{lesson.kcmc}</td>
                  <td className='xsxf'>{lesson.rwzxs} / {lesson.xf}</td>
                  <td className='sksj'>
                    <TimeLocation time={lesson.sksj} location={lesson.jxdd}></TimeLocation>
                  </td>
                  <td className='bz'>{lesson.xkbz}</td>
                  <td className='nj'>{lesson.nj}</td>
                </tr>
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
      </div >)
  } else {
    return <div></div>
  }
}
