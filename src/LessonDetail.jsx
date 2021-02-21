import React from 'react'

import { parseTimeLocation, useLessonDetail } from './Utils'

export default function LessonDetail({ lesson, color }) {
  const { data: lessonDetail } = useLessonDetail()
  return (
    <>
      <div className='card lesson-detail-card shadow-sm font-weight-normal small'>
        <div className='card-body'>
          <h5 className='card-title'>
            {color ? (
              <span
                className='lesson-dot'
                style={{ 'background-color': color }}
              ></span>
            ) : (
              <></>
            )}
            {lesson.kch} {lesson.kcmc}
          </h5>
          <h6 className='card-subtitle mb-2 text-muted'>
            <span>{lesson.jszc}</span>
            {lesson.jszc !== lesson.zjs ? (
              <span>(上课教师: {lesson.zjs})</span>
            ) : (
              <></>
            )}
          </h6>

          <p className='card-text'>
            <span className='mr-1'>{lesson.kkxy}</span>
            <span className='mr-1'>{lesson.skyy}</span>
            <span className='mr-1'>{lesson.kklx}</span>
            <span className='mr-1'>{lesson.zhxs}</span>
            <span className='mr-1'>{lesson.rwzxs} 学时</span>
            <span className='mr-1'>{lesson.kcxzmc}</span>
          </p>
          {lesson.xkbz ? (
            <p className='card-text'>备注：{lesson.xkbz}</p>
          ) : (
            <></>
          )}
          <span className='card-text'>班级组成</span>
          <ul className='list-group list-group-flush border-top border-bottom mb-3'>
            {lesson.jxbzc.split(';').map((item, idx) => (
              <li className='list-group-item py-1' key={idx}>
                {item}
              </li>
            ))}
          </ul>
          <span className='card-text'>时间地点</span>
          <ul className='list-group list-group-flush border-top border-bottom mb-3'>
            {parseTimeLocation(lesson.sksj, lesson.jxdd).map(
              ({ time, location }, idx) => (
                <li className='list-group-item py-1' key={idx}>
                  <div className='row'>
                    <div className='col-7'>{time}</div>
                    <div className='col-5'>{location}</div>
                  </div>
                </li>
              )
            )}
          </ul>
          <p>
            {
              (((lessonDetail || {})[lesson.kch] || {}).profile || {})[
                '中文课程简介'
              ]
            }
          </p>
          <p>
            {
              (((lessonDetail || {})[lesson.kch] || {}).profile || {})[
                '英文课程简介'
              ]
            }
          </p>
          <p className='card-text text-muted pb-3'>
            <span className='mr-1'>{lesson.jxbmc}</span>
            <br />
            <span className='mr-1'>{lesson.nj} 年级,</span>
            <span className='mr-1'>
              {lesson.xn} 学年 {lesson.xq} 学期
            </span>
          </p>
        </div>
      </div>
    </>
  )
}
