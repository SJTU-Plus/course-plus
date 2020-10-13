import './App.scss'

import axios from 'axios'
import chroma from 'chroma-js'
import sortedBy from 'lodash/sortBy'
import React, { useReducer, useState } from 'react'
import GitHubButton from 'react-github-btn'
import {
  HashRouter as Router,
  matchPath,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom'

import ClassTable from './ClassTable'
import ClassTableForm from './ClassTableForm'
import FilterForm from './FilterForm'
import LessonList from './LessonList'
import LoginModal from './LoginModal'
import Navbar from './Navbar'
import PlanForm from './PlanForm'
import SemesterNav from './SemesterNav'
import ShowClassTable from './ShowClassTable'
import SyncButton from './SyncButton'
import { useLocalStorageSet } from './Utils'

function App() {
  const [filterFormState, setFilterFormState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      checkedNj: new Set(),
      checkedLx: new Set(),
      checkedYx: new Set(),
      scheduleKey: '',
      lecturerKey: '',
      placeKey: '',
      keywordType: 'kcmc',
      keyword: '',
      composition: '',
      notes: '',
    }
  )

  const [starLesson, setStarLesson] = useLocalStorageSet(
    'starLesson',
    new Set([])
  )
  const [selectedLesson, setSelectedLesson] = useLocalStorageSet(
    'selectedLesson',
    new Set([])
  )
  const [sjtuLesson, setSjtuLesson] = useLocalStorageSet(
    'sjtuLesson',
    new Set([])
  )
  const [sjtuLessonLoading, setSjtuLessonLoading] = useState(false)

  const [loginDialog, setLoginDialog] = useState(false)

  const syncFromISJTU = (semester) => {
    setSjtuLessonLoading(true)
    axios
      .get(`/api/course/lesson?term=${semester.replace('_', '-')}`)
      .then((resp) => {
        if (resp?.data?.error === 'success') {
          setSjtuLesson(new Set(resp.data.entities.map((x) => x.code)))
          setSjtuLessonLoading(false)
        } else {
          setSjtuLessonLoading(false)
          setLoginDialog(true)
        }
      })
      .catch((e) => {
        setLoginDialog(true)
        setSjtuLessonLoading(false)
      })
  }

  const handleLogin = (result) => {
    if (result) {
      window.location.href = '/login?app=course_plus'
    }
    setLoginDialog(false)
  }

  const colorize = (starLesson) => {
    const colorScale = chroma.scale('Spectral').gamma(0.5)
    // const colorScale = chroma.scale(['yellow', 'navy']).mode('lch');
    const starLessonArray = [...starLesson]
    const colors = colorScale.colors(starLessonArray.length)
    const result = {}
    sortedBy(starLessonArray).forEach((val, idx) => (result[val] = colors[idx]))
    return result
  }

  return (
    <Router>
      <LoginModal show={loginDialog} nextStep={handleLogin}></LoginModal>

      <div className='container-fluid h-100'>
        <div className='row h-100'>
          <div className='col-md-3 d-none d-md-block h-100 bg-light overflow-auto'>
            <Switch>
              <Route exact path='/'>
                <Navbar />
              </Route>
              <Route path='/:semester'>
                <Navbar />
              </Route>
            </Switch>

            <div className='container'>
              <Switch>
                <Route exact path='/'>
                  <SemesterNav />
                </Route>
                <Route path='/:semester/:path'>
                  <SemesterNav />
                  <hr />
                </Route>
              </Switch>
              <Switch>
                <Route path='/:semester/browse'>
                  <FilterForm
                    state={filterFormState}
                    setState={setFilterFormState}
                  />
                </Route>
                <Route path='/:semester/plan'>
                  <PlanForm
                    starLesson={starLesson}
                    state={selectedLesson}
                    setState={setSelectedLesson}
                    colorMapping={colorize(starLesson)}
                  />
                </Route>
                <Route path='/:semester/classtable'>
                  <ClassTableForm
                    sjtuLesson={sjtuLesson}
                    starLesson={starLesson}
                    setStarLesson={setStarLesson}
                    dataLoading={sjtuLessonLoading}
                    syncFromISJTU={syncFromISJTU}
                    colorMapping={colorize(sjtuLesson)}
                  />
                </Route>
              </Switch>

              <p className='text-muted my-3 small'>
                免责声明：本网站课程相关数据来自上海交通大学教学信息服务网。具体开课情况以教务网为准。
              </p>
              <p className='text-muted my-3 small'>
                隐私政策：访问本网站，即代表您同意本网站使用“站长统计”收集您的访问信息。根据相关法律法规，本站不对欧盟用户提供服务。
              </p>
              <div className='row'>
                <div className='col d-flex d-row align-items-center'>
                  <p className='text-muted my-3 small'>
                    <a href='https://github.com/SJTU-Plus/course-plus'>
                      本项目
                    </a>{' '}
                    由 <a href='https://sjtu-plus.github.io/'>SJTU-Plus</a>{' '}
                    维护。
                  </p>
                </div>
                <div className='col-auto m-0 p-0 d-flex d-row align-items-center'>
                  <GitHubButton
                    href='https://github.com/sjtu-plus/course-plus'
                    data-show-count
                    data-size='large'
                  >
                    Star
                  </GitHubButton>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-9 h-100 classtable-wrapper'>
            <div className='mb-3'>
              <Switch>
                <Route path='/:semester/browse'>
                  <ShowClassTable></ShowClassTable>
                </Route>
                <Route path='/:semester/plan'>
                  <ShowClassTable></ShowClassTable>
                </Route>
                <Route path='/:semester/classtable'>
                  <SyncButton
                    syncFromISJTU={syncFromISJTU}
                    dataLoading={sjtuLessonLoading}
                  ></SyncButton>
                </Route>
              </Switch>
            </div>
            <div className='classtable-frame w-100'>
              <Switch>
                <Route path='/:semester/browse'>
                  <LessonList
                    filterData={filterFormState}
                    state={starLesson}
                    setState={setStarLesson}
                  />
                </Route>
                <Route path='/:semester/plan'>
                  <ClassTable
                    selectedLesson={selectedLesson}
                    colorMapping={colorize(starLesson)}
                  />
                </Route>
                <Route path='/:semester/classtable'>
                  <ClassTable
                    selectedLesson={sjtuLesson}
                    colorMapping={colorize(sjtuLesson)}
                  />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
