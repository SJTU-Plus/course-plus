import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ({ syncFromISJTU, dataLoading }) {
  const { semester } = useParams()
  return (
    <a
      className='row text-reset jumbotron jumbotron-fluid d-block d-md-none px-1 py-3 text-center my-0'
      onClick={() => syncFromISJTU(semester)}
    >
      {dataLoading ? (
        <div className='spinner-border mr-1 align-middle'></div>
      ) : (
        ''
      )}{' '}
      <span className='h4 align-middle'>同步数据</span>
    </a>
  )
}
