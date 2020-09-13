import './App.scss'

import chroma from 'chroma-js'
import sortedBy from 'lodash/sortBy'
import React, { useReducer } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import ClassTable from './ClassTable'
import FilterForm from './FilterForm'
import LessonList from './LessonList'
import Navbar from './Navbar'
import PlanForm from './PlanForm'
import SemesterNav from './SemesterNav'
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
      <div className='container-fluid h-100'>
        <div className='row h-100'>
          <div className='col-3 h-100 bg-light overflow-auto'>
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
                    </a>
                    由<a href='https://sjtu-plus.github.io/'>SJTU-Plus</a>
                    团队开发。
                  </p>
                </div>
                <div className='col-auto m-0 p-0 d-flex d-row align-items-center'>
                  {/* <gh-btns-star slug="sjtu-plus/course-plus" show-count /> */}
                </div>
              </div>
            </div>
          </div>
          <div className='col-9 h-100 overflow-auto' id='scrollArea'>
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
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
