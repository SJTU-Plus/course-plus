import React from 'react'

import {
  parseTimeLocation,
  useLessonConversion,
  useLessonDetail,
} from './Utils'

function ArrowRightSvg({ size }) {
  return (
    <svg
      width={size}
      height={size}
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      className='bi bi-arrow-right-short'
      viewBox='0 0 16 16'
    >
      <path
        fillRule='evenodd'
        d='M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z'
      />
    </svg>
  )
}

function ConversionInfo({ lessonConversion, kch }) {
  if (lessonConversion) {
    if (lessonConversion.to_new[kch]) {
      return (
        <span className='mr-1'>
          <b>{kch}</b>
          <ArrowRightSvg size='1rem'></ArrowRightSvg>
          {lessonConversion.to_new[kch]}
        </span>
      )
    }
    if (lessonConversion.to_old[kch]) {
      return (
        <span className='mr-1'>
          {lessonConversion.to_old[kch]}
          <ArrowRightSvg size='1rem'></ArrowRightSvg>
          <b>{kch}</b>
        </span>
      )
    }
  }
  return <></>
}

function parseProfile(lessonDetail, lessonConversion, kch) {
  if (lessonDetail) {
    if (lessonDetail[kch]) {
      return lessonDetail[kch].profile
    }
    if (lessonConversion) {
      let try_kch = lessonConversion.to_new[kch]
      if (try_kch) {
        if (lessonDetail[try_kch]) {
          return lessonDetail[try_kch].profile
        }
      }
      try_kch = lessonConversion.to_old[kch]
      if (try_kch) {
        if (lessonDetail[try_kch]) {
          return lessonDetail[try_kch].profile
        }
      }
    }
  }
  return {}
}

export default function LessonDetail({ lesson, color }) {
  const { data: lessonDetail } = useLessonDetail()
  const { data: lessonConversion } = useLessonConversion()

  return (
    <>
      <div className='card lesson-detail-card shadow-sm font-weight-normal small'>
        <div className='card-body'>
          <h5 className='card-title'>
            {color ? (
              <span
                className='lesson-dot'
                style={{ backgroundColor: color }}
              ></span>
            ) : (
              <></>
            )}
            {lesson.kch} {lesson.kcmc}
          </h5>
          <h6 className='card-subtitle mb-2 text-muted'>
            <ConversionInfo
              kch={lesson.kch}
              lessonConversion={lessonConversion}
            ></ConversionInfo>
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
          {lesson.kzmc ? (
            <p className='card-text'>通识课模块：{lesson.kzmc}</p>
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
              parseProfile(lessonDetail, lessonConversion, lesson.kch)[
                '中文课程简介'
              ]
            }
          </p>
          <p>
            {
              parseProfile(lessonDetail, lessonConversion, lesson.kch)[
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
