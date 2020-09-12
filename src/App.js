import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './App.scss';

import Navbar from './Navbar'
import SemesterNav from './SemesterNav'


function App() {
  return (
    <Router>
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col-3 h-100 bg-light overflow-auto">

            <Switch>
              <Route exact path="/">
                <Navbar />
              </Route>
              <Route path="/:semester">
                <Navbar />
              </Route>
            </Switch>
            

            <Switch>
              <Route path="/:semester">

              </Route>
            </Switch>
            <div className="container">
            <SemesterNav/>
              <p className="text-muted my-3 small">
                免责声明：本网站课程相关数据来自上海交通大学教学信息服务网。
                本网站所展示的数据更新于，
                可能不是最新版本。具体开课情况以教务网为准。
              </p>
              <p className="text-muted my-3 small">
                隐私政策：访问本网站，即代表您同意本网站使用“站长统计”收集您的访问信息。根据相关法律法规，本站不对欧盟用户提供服务。
              </p>
              <div className="row">
                <div className="col d-flex d-row align-items-center">
                  <p className="text-muted my-3 small">
                    <a href="https://github.com/SJTU-Plus/course-plus">
                      本项目
                  </a>
                  由
                  <a href="https://sjtu-plus.github.io/">SJTU-Plus</a>
                  团队开发。
                </p>
                </div>
                <div className="col-auto m-0 p-0 d-flex d-row align-items-center">
                  {/* <gh-btns-star slug="sjtu-plus/course-plus" show-count /> */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-9 h-100">

          </div>
        </div>
      </div>
    </Router>
  );
}



export default App;