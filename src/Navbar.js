import React from 'react';
import {
  Link,
  useLocation,
  useParams,
  matchPath,
} from "react-router-dom";

function CoursePlusSvg() {
  return <svg
    width="1.25rem"
    height="1.25rem"
    viewBox="0 0 16 16"
    className="bi bi-calendar-plus mr-1"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="gradient" gradientTransform="rotate(45)">
        <stop offset="0%" stopColor="#24C6DC" />
        <stop offset="100%" stopColor="#514A9D" />
      </linearGradient>
    </defs>
    <path
      fillRule="evenodd"
      fill="url(#gradient)"
      d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"
    />
    <path
      fillRule="evenodd"
      fill="url(#gradient)"
      d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"
    />
  </svg>
}

export default () => {
  const { pathname } = useLocation();
  const { semester } = useParams();
  const links = [
    { path: "/browse", text: "搜索", match: "/:semester/browse" },
    { path: "/plan", text: "排课", match: "/:semester/plan" }
  ]
  const match_links = links.map(link => ({
    path: link.path,
    text: link.text,
    match: matchPath(pathname, {
      path: link.match,
    })
  }))
  const linksComponent = match_links.map(link => <li key={link.path} className={`nav-item${link.match ? " active" : ""}`}>
    <Link to={`/${semester}${link.path}`} className="nav-link">{link.text}</Link>
  </li>)

  return (
    <nav className="navbar navbar-light navbar-expand course-navbar mb-3">
      <span className="navbar-brand mb-0"><CoursePlusSvg></CoursePlusSvg> Course+</span>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          {semester ? linksComponent : null}
        </ul>
      </div>
    </nav>
  );
}