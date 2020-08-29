<template>
  <div id="app" class="vh-100">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <div class="col-3 h-100 bg-light overflow-auto">
          <nav class="navbar navbar-light mb-3">
            <span class="navbar-brand mb-0" v-if="route == 'search'"
              >SJTU 学期开课表 · 搜索</span
            >
            <a
              class="small text-muted"
              v-if="route == 'search'"
              @click="route = 'arrange'"
              href="javascript:"
              >切换到排课</a
            >
            <span class="navbar-brand mb-0" v-if="route == 'arrange'"
              >SJTU 学期开课表 · 排课</span
            >
            <a
              class="small text-muted"
              v-if="route == 'arrange'"
              @click="route = 'search'"
              href="javascript:"
              >切换到搜索</a
            >
          </nav>
          <div class="container">
            <form name="LessonFilter">
              <div class="form-row">
                <div class="col-md-6 mb-3">
                  <label for="inputYear">学年</label>
                  <select
                    class="form-control custom-select"
                    id="inputYear"
                    v-model="selectedYear"
                  >
                    <option
                      v-for="year in availableYear"
                      :key="year"
                      :value="year"
                      >{{ year }}</option
                    >
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="inputSemester">学期</label>
                  <select
                    class="form-control custom-select"
                    id="inputSemester"
                    v-model="selectedSemester"
                  >
                    <option
                      v-for="semester in availableSemester"
                      :key="semester"
                      :value="semester"
                      >{{ semester | semesterCode2name }}</option
                    >
                  </select>
                </div>
                <div class="col-12 mb-3">
                  <Loading :ready="dataLoaded"></Loading>
                  <hr />
                </div>
                <FilterForm
                  v-if="route == 'search'"
                  v-model="formData"
                  :dataAfterKeyword="dataAfterKeyword"
                ></FilterForm>
                <StarredForm
                  v-if="route == 'arrange'"
                  :allCourses="uniqueStarredCourses"
                  v-bind:selectedCourses="selectedStarredCourses"
                  v-on:change="saveSelectedCourse($event)"
                  :colorMapping="colorMapping"
                ></StarredForm>

                <div v-if="route == 'arrange'">
                  <div class="form-row my-3">
                    <div class="col-12">
                      <div class="row">
                        <span class="form-check col-12">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            name="classTableConfig.simpleMode"
                            id="classTableConfig.simpleMode"
                            v-model="classTableConfig.simpleMode"
                          />
                          <label
                            class="form-check-label"
                            for="classTableConfig.simpleMode"
                            >简洁模式</label
                          >
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="form-row my-3">
                    <div class="col-12">
                      <div class="row">
                        <div class="form-group col-12">
                          <label for="firstDayDate">本学期第一天</label>
                          <input
                            type="date"
                            class="form-control"
                            id="firstDayDate"
                            v-model="firstDayDate"
                          />
                        </div>
                        <div class="col-12">
                          <button
                            type="button"
                            class="btn btn-outline-primary"
                            @click="downloadAsICS"
                          >
                            导出到 iCalendar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <p class="text-muted my-3 small">
              免责声明：本网站课程相关数据来自上海交通大学教学信息服务网。
              本网站所展示的数据更新于 {{ selectedUpdatedAt }}，
              可能不是最新版本。具体开课情况以教务网为准。
            </p>
            <p class="text-muted my-3 small">
              隐私政策：访问本网站，即代表您同意本网站使用“站长统计”收集您的访问信息。根据相关法律法规，本站不对欧盟用户提供服务。
            </p>
            <div class="row">
              <div class="col d-flex d-row align-items-center">
                <p class="text-muted my-3 small">
                  本项目由
                  <a href="https://sjtu-plus.github.io/">SJTU-Plus</a>
                  团队开发。
                </p>
              </div>
              <div class="col-auto m-0 p-0 d-flex d-row align-items-center">
                <gh-btns-star slug="sjtu-plus/course-plus" show-count />
              </div>
            </div>
          </div>
        </div>
        <div class="col-9 h-100">
          <LessonList
            v-if="route == 'search'"
            :data="uniqueLessons(dataFiltered)"
            :lessonDetail="lessonDetail"
            :tableHeader="tableHeader"
            v-bind:starredCourses="starredCourses"
            @change="saveStarredCourse($event)"
          ></LessonList>
          <ClassTable
            v-if="route == 'arrange'"
            :lessonDetail="lessonDetail"
            :lessons="selectedArrangeCourse"
            :colorMapping="colorMapping"
            :classTableConfig="classTableConfig"
          ></ClassTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
  LessonIndex,
  Lesson,
  SearchFilter,
  ClassTableConfig,
  LessonDetail,
  generateICS
} from "./models";
import chroma from "chroma-js";
import LessonList from "./components/LessonList.vue";
import ClassTable from "./components/ClassTable.vue";
import FilterForm from "./components/FilterForm.vue";
import StarredForm from "./components/StarredForm.vue";
import Loading from "./components/Loading.vue";
import { fieldDict } from "./data";
import { toChsDate, uniqueLessons, downloadFile } from "./utils";

const dataURL = "/course-plus-data/";
@Component({
  components: {
    LessonList,
    Loading,
    FilterForm,
    StarredForm,
    ClassTable
  },
  filters: {
    semesterCode2name(semesterCode: string) {
      switch (semesterCode) {
        case "1":
          return "秋季";
        case "2":
          return "春季";
        case "3":
          return "夏季";
        default:
          return "未知";
      }
    }
  }
})
export default class App extends Vue {
  selectedYear = "";

  selectedSemester = "";

  selectedUpdatedAt = "";

  fieldDict = fieldDict;

  tableHeader = [
    "课号",
    "开课院系",
    "教师姓名",
    "课程",
    "学时/学分",
    "上课时间地点",
    "备注",
    "年级"
  ];

  dataLoaded = false;

  dataLoadLock = false;

  dataIndex: LessonIndex[] = [];

  dataRaw: Lesson[] = [];

  formData: SearchFilter = {
    checkedNj: [],
    checkedLx: [],
    checkedYx: [],
    scheduleKey: "",
    lecturerKey: "",
    placeKey: "",
    keyword: {
      keywordType: "kcmc",
      keyword: ""
    },
    composition: ""
  };

  classTableConfig: ClassTableConfig = {
    simpleMode: false
  };

  // route = "arrange";
  route = "search";

  starredCourses: string[] = [];

  selectedStarredCourses: string[] = [];

  lessonDetail: { [id: string]: LessonDetail } = {};

  uniqueLessons = uniqueLessons;

  firstDayDate = "2020-09-07";

  created() {
    fetch(`${dataURL}lessionData_index.json`)
      .then(res => res.json())
      .then(data => {
        this.dataIndex = data;
        this.selectedYear = this.dataIndex[this.dataIndex.length - 1]["year"];
        this.selectedSemester = this.dataIndex[this.dataIndex.length - 1][
          "semester"
        ];
        this.selectedUpdatedAt = toChsDate(
          this.dataIndex[this.dataIndex.length - 1]["updated_at"]
        );
      });
    fetch(`${dataURL}lesson_description_2019.json`)
      .then(res => res.json())
      .then(data => {
        const lessonDetail: { [id: string]: LessonDetail } = {};
        for (const key in data) {
          lessonDetail[key] = {
            profile: {
              chineseIntro: data[key]["profile"]["中文课程简介"],
              englishIntro: data[key]["profile"]["英文课程简介"]
            }
          };
        }
        this.lessonDetail = lessonDetail;
      });
  }

  get availableYear(): string[] {
    const yearSet: Set<string> = new Set();
    this.dataIndex.forEach(item => {
      yearSet.add(item.year);
    });
    return [...yearSet];
  }

  get availableSemester(): string[] {
    const selectedYear = this.selectedYear;
    const newIndex = this.dataIndex.filter(item => {
      return item.year == selectedYear;
    });
    const semesterSet: Set<string> = new Set();
    newIndex.forEach(function(item) {
      semesterSet.add(item.semester);
    });
    return [...semesterSet];
  }

  get dataAfterKeyword() {
    if (!this.dataLoaded) {
      return [];
    } else {
      let filteringData = [];
      const keyword = this.formData.keyword["keyword"];
      const keywordType = this.formData.keyword["keywordType"];
      const scheduleKey = this.formData.scheduleKey;
      const lecturerKey = this.formData.lecturerKey;
      const placeKey = this.formData.placeKey;

      if (keyword) {
        filteringData = this.dataRaw.filter((lesson: Lesson) => {
          // eslint-disable-next-line
          const lessonAny = lesson as any;
          if (lessonAny[keywordType]) {
            return (
              lessonAny[keywordType]
                .toLowerCase()
                .search(keyword.toLowerCase()) > -1
            );
          } else {
            return false;
          }
        });
      } else {
        filteringData = this.dataRaw;
      }

      if (scheduleKey) {
        filteringData = filteringData.filter((lesson: Lesson) => {
          return lesson.sksj.search(scheduleKey) > -1;
        });
      }
      if (lecturerKey) {
        filteringData = filteringData.filter((lesson: Lesson) => {
          return lesson.jsxx.search(lecturerKey) > -1;
        });
      }
      if (placeKey) {
        filteringData = filteringData.filter((lesson: Lesson) => {
          return (lesson.jxdd ? lesson.jxdd : "").search(placeKey) > -1;
        });
      }
      return filteringData;
    }
  }

  get dataFiltered() {
    let filteringData = this.dataAfterKeyword;
    const checkedNj = this.formData.checkedNj;
    const checkedLx = this.formData.checkedLx;
    const checkedYx = this.formData.checkedYx;
    const composition = this.formData.composition;

    if (checkedNj.length) {
      filteringData = filteringData.filter((lesson: Lesson) =>
        checkedNj.find(x => x == lesson.nj)
      );
    }

    if (checkedLx.length) {
      filteringData = filteringData.filter((lesson: Lesson) =>
        checkedLx.find(x => x == lesson.kcxzmc)
      );
    }

    if (checkedYx.length) {
      filteringData = filteringData.filter((lesson: Lesson) =>
        checkedYx.find(x => x == lesson.kkxy)
      );
    }

    if (composition.length) {
      filteringData = filteringData.filter((lesson: Lesson) =>
        lesson.jxbzc.split(";").some(x => x == composition)
      );
    }
    return filteringData;
  }

  @Watch("selectedYear")
  onSelectedYearChanged() {
    this.updateSrcData();
  }

  @Watch("selectedSemester")
  onSelectedSemesterChanged() {
    this.updateSrcData();
  }

  get semesterID(): string {
    return `${this.selectedYear}-${this.selectedSemester}`;
  }

  updateSrcData() {
    if (this.dataLoadLock) return;
    this.dataLoadLock = true;
    setTimeout(() => (this.dataLoadLock = false), 100);

    this.dataLoaded = false;
    //先检查数据是否有效
    let foundFlag = false;
    this.dataIndex.forEach(x => {
      //woc 还有这种语法？？nb！
      if (this.selectedYear == x.year && this.selectedSemester == x.semester) {
        foundFlag = true;
      }
    });
    //再获取数据
    if (foundFlag) {
      fetch(
        `${dataURL}lessionData_${this.selectedYear}_${this.selectedSemester}.json`
      )
        .then(res => res.json())
        .then(data => {
          // eslint-disable-next-line
          data.forEach((item: any) => {
            if (!item.kcxzmc) {
              item.kcxzmc = "undefined";
            }
          });
          this.dataRaw = data;
          this.dataLoaded = true;

          this.starredCourses = this.getFromLocalStorage(
            `starred-${this.semesterID}`
          );
          this.selectedStarredCourses = this.getFromLocalStorage(
            `selected-${this.semesterID}`
          );
        });
    } else {
      this.selectedSemester = this.availableSemester[
        this.availableSemester.length - 1
      ];
    }
  }

  getFromLocalStorage(key: string) {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    } else {
      return [];
    }
  }

  saveStarredCourse(data: string[]) {
    this.starredCourses = data;
    localStorage.setItem(
      `starred-${this.semesterID}`,
      JSON.stringify(this.starredCourses)
    );
  }

  saveSelectedCourse(data: string[]) {
    this.selectedStarredCourses = data;
    localStorage.setItem(
      `selected-${this.semesterID}`,
      JSON.stringify(this.selectedStarredCourses)
    );
  }

  get starredAllCourses(): Lesson[] {
    return this.dataRaw.filter(lesson =>
      this.starredCourses.includes(lesson.jxb_id)
    );
  }

  get selectedArrangeCourse(): Lesson[] {
    return this.dataRaw.filter(lesson =>
      this.selectedStarredCourses.includes(lesson.jxb_id)
    );
  }

  get uniqueStarredCourses() {
    return uniqueLessons(this.starredAllCourses);
  }

  get colorMapping(): { [id: string]: string } {
    const colorScale = chroma.scale("Spectral").gamma(0.5);
    // const colorScale = chroma.scale(['yellow', 'navy']).mode('lch');
    const colors = colorScale.colors(this.uniqueStarredCourses.length);
    const result: { [id: string]: string } = {
      conflict: "red",
      "": "white"
    };
    this.uniqueStarredCourses.forEach(
      (val, idx) => (result[val.jxb_id] = colors[idx])
    );
    return result;
  }

  downloadAsICS() {
    downloadFile(
      `classtable-${this.selectedYear}-${this.selectedSemester}.ics`,
      generateICS(this.selectedArrangeCourse, new Date(this.firstDayDate))
    );
  }
}
</script>

<style lang="scss"></style>
