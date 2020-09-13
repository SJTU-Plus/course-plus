import React from 'react'
import {
  Link,
  matchPath,
  useLocation,
  useParams
} from 'react-router-dom'

function CoursePlusSvg () {
  return <svg
    width='1.25rem'
    height='1.25rem'
    viewBox='0 0 16 16'
    className='bi bi-calendar-plus mr-1'
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
  >
    <defs>
      <linearGradient id='gradient' gradientTransform='rotate(45)'>
        <stop offset='0%' stopColor='#24C6DC' />
        <stop offset='100%' stopColor='#514A9D' />
      </linearGradient>
    </defs>
    <path fillRule='evenodd' fill='url(#gradient)' d='M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM8.5 8.5a.5.5 0 0 0-1 0V10H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V11H10a.5.5 0 0 0 0-1H8.5V8.5z' />
  </svg>
}

export default () => {
  const { pathname } = useLocation()
  const { semester } = useParams<{ semester?: string }>()
  const links = [
    { path: '/browse', text: '搜索', match: '/:semester/browse' },
    { path: '/plan', text: '排课', match: '/:semester/plan' }
  ]
  const match_links = links.map(link => ({
    path: link.path,
    text: link.text,
    match: matchPath(pathname, {
      path: link.match
    })
  }))
  const linksComponent = match_links.map(link => <li key={link.path} className={`nav-item${link.match ? ' active' : ''}`}>
    <Link to={`/${semester}${link.path}`} className='nav-link'>{link.text}</Link>
  </li>)

  return (
    <nav className='navbar navbar-light navbar-expand course-navbar mb-3'>
      <span className='navbar-brand mb-0'><CoursePlusSvg /> Course+</span>
      <div className='collapse navbar-collapse'>
        <ul className='navbar-nav ml-auto'>
          {semester ? linksComponent : null}
        </ul>
      </div>
    </nav>
  )
}
