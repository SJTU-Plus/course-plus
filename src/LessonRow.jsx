import React, { useState } from 'react'

import { BreakLine, TimeLocation } from './Utils'

function StarSvg({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 16 16'
      className='bi bi-star'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        d='M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z'
      />
    </svg>
  )
}

function StarSvgColor({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 16 16'
      className='bi bi-star'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient id='gradient' gradientTransform='rotate(45)'>
          <stop offset='0%' stopColor='#24C6DC' />
          <stop offset='100%' stopColor='#514A9D' />
        </linearGradient>
      </defs>
      <path
        fillRule='evenodd'
        fill='url(#gradient)'
        d='M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z'
      />
    </svg>
  )
}

function StarFillSvg({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 16 16'
      className='bi bi-star-fill'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient id='gradient' gradientTransform='rotate(45)'>
          <stop offset='0%' stopColor='#24C6DC' />
          <stop offset='100%' stopColor='#514A9D' />
        </linearGradient>
      </defs>
      <path
        fill='url(#gradient)'
        d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'
      />
    </svg>
  )
}

function Star({ size, state, hover }) {
  if (state) {
    return StarFillSvg({ size })
  } else {
    if (hover) {
      return StarSvgColor({ size })
    }
    return StarSvg({ size })
  }
}

export default function LessonRow({ lesson, name, state, setState }) {
  const [onHover, setOnHover] = useState(false)

  return (
    <tr key={lesson.jxbmc}>
      <th className='kcbm' scope='row'>
        <a
          className='btn btn-link btn-sm text-reset p-0'
          onClick={() => setState({ name, value: !state })}
          onMouseEnter={() => setOnHover(true)}
          onMouseLeave={() => setOnHover(false)}
        >
          <span>
            <Star size='1rem' state={state} hover={onHover}></Star>
          </span>
          <span className='ml-1'>{lesson.kch}</span>
        </a>
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
      <td className='xm'>
        <BreakLine data={lesson.jszc} sep=','></BreakLine>
      </td>
      <td className='kcmc'>{lesson.kcmc}</td>
      <td className='xsxf'>
        {lesson.rwzxs} / {lesson.xf}
      </td>
      <td className='sksj'>
        <TimeLocation time={lesson.sksj} location={lesson.jxdd}></TimeLocation>
      </td>
      <td className='bz'>{lesson.xkbz}</td>
      <td className='nj'>{lesson.nj}</td>
      <td className='jxbzc'>
        <BreakLine data={lesson.jxbzc} sep=';'></BreakLine>
      </td>
    </tr>
  )
}
