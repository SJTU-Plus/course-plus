import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function () {
  const { semester } = useParams()
  return (
    <Link
      to={`/${semester}/classtable`}
      className='row text-reset jumbotron jumbotron-fluid d-block d-md-none px-1 py-3 text-center my-0'
    >
      <span className='h4'>显示本学期课表</span>
    </Link>
  )
}
