import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function () {
  const { semester } = useParams()
  return (
    <div>
      <Link
        to={`/${semester}/classtable`}
        className='row text-reset jumbotron jumbotron-fluid d-block d-md-none px-1 py-3 text-center my-0 course-button'
      >
        <span className='h4'>显示本学期课表</span>
      </Link>
      <p className="text-muted small text-center d-md-none">请使用 PC 访问以使用完整功能。</p>
    </div>
  )
}
