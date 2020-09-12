import React from 'react'

import { BreakLine, TimeLocation } from './Utils'

export default function LessonRow (props) {
  const lesson = props.lesson
  return <tr key={lesson.row_id}>
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
}
