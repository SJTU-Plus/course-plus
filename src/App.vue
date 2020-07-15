<template>
  <div id="app" class="vh-100">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <div class="col-3 h-100 bg-light overflow-auto">
          <nav class="navbar navbar-light mb-3">
            <span class="navbar-brand mb-0">SJTU 学期开课表</span>
          </nav>
          <div class="container">
            <form name="LessonFilter">
              <div class="form-row">
                <div class="col-md-6 mb-3">
                  <label for="inputYear">学年</label>
                  <select
                    class="form-control form-control-sm"
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
                    class="form-control form-control-sm"
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
                  <Loading :ready="dataLoaded" :message="message"></Loading>
                </div>
                <div class="col-12 mb-3">
                  <label for="inputKeyword">搜索方式</label>
                  <div id="searchBox" class="input-group">
                    <div class="input-group-prepend">
                      <select
                        class="form-control form-control-sm"
                        id="keyword-type"
                        v-model="formData.keyword.keywordType"
                      >
                        <option value="kcmc">课程名称</option>
                        <option value="kch">课号</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      id="inputKeyword"
                      class="form-control form-control-sm"
                      v-model="formData.keyword.keyword"
                    />
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <label for="inputTime">上课时间</label>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="不限时间"
                    id="inputTime"
                    v-model="formData.scheduleKey"
                  />
                </div>
                <div class="col-md-4 mb-3">
                  <label for="inputLecturer">教师</label>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="不限教师"
                    id="inputLecturer"
                    v-model="formData.lecturerKey"
                  />
                </div>
                <div class="col-md-4 mb-3">
                  <label for="inputPlace">地点</label>
                  <input
                    type="text"
                    id="inputPlace"
                    class="form-control form-control-sm"
                    placeholder="不限地点"
                    v-model="formData.placeKey"
                  />
                </div>
              </div>
              <div class="form-row">
                <label class="col-form-label">年级</label>
                <div class="col-12">
                  <div class="row">
                    <span
                      class="form-check col-lg-6"
                      v-for="nj in njOptionList"
                      :key="nj"
                    >
                      <input
                        class="form-check-input"
                        name="nj"
                        type="checkbox"
                        :id="nj"
                        :value="nj"
                        v-model="formData.checkedNj"
                      />
                      <label class="form-check-label" :for="nj">{{ nj }}</label>
                    </span>
                  </div>
                </div>
              </div>
              <div class="form-row">
                <label class="col-form-label">课程类型</label>
                <div class="col-12">
                  <div class="row">
                    <span
                      class="form-check col-lg-6"
                      v-for="lx in lxOptionList"
                      :key="lx"
                    >
                      <input
                        class="form-check-input"
                        name="lx"
                        type="checkbox"
                        :id="lx"
                        :value="lx"
                        v-model="formData.checkedLx"
                      />
                      <label class="form-check-label" :for="lx">{{ lx }}</label>
                    </span>
                  </div>
                </div>
              </div>
              <div class="form-row">
                <label class="col-form-label">开课院系</label>

                <div class="col-12">
                  <div class="row">
                    <div
                      class="form-check col-12"
                      v-for="yx in yxOptionList"
                      :key="yx"
                    >
                      <input
                        class="form-check-input"
                        name="yx"
                        type="checkbox"
                        :id="yx"
                        :value="yx"
                        v-model="formData.checkedYx"
                      />
                      <label class="form-check-label" :for="yx">{{ yx }}</label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="col-9 h-100">
          <LessonList
            :data="dataFiltered"
            :tableHeader="tableHeader"
          ></LessonList>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { LessonIndex, Lesson } from "./models";
import { cmpChs } from "./utils";
import LessonList from "./components/LessonList.vue";
import Loading from "./components/Loading.vue";
import fetchProgress from "fetch-progress";

const dataURL = "/course-plus-data/";
@Component({
  components: { LessonList, Loading },
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
  fieldDict = {
    xn: "学年",
    xq: "学期",
    xqj: "星期几",
    skjc: "上课节次",
    qsjsz: "起始周",
    kch: "课程号",
    cdbh: "场地编号",
    kcmc: "课程名称",
    cdmc: "场地名称",
    cdlbmc: "场地类别名称",
    cdqsjsz: "场地上课起始周",
    cdskjc: "场地上课节次",
    xqmc: "校区",
    jxbrs: "教学班人数",
    jxbzc: "教学班组成",
    jxbmc: "选课课号",
    xf: "学分",
    rwzxs: "总学时",
    kkxy: "开课学院",
    xkrs: "选课人数",
    zhxs: "周学时",
    sksj: "上课时间",
    jxdd: "上课地点",
    xkbz: "选课备注",
    kcxzmc: "课程性质",
    kklx: "开课类型",
    nj: "年级",
    zjs: "上课教师",
    zws: "座位数",
    jxlmc: "教学楼",
    jszc: "教师组成"
  };
  tableHeader = [
    "课号",
    "开课院系",
    "教师姓名",
    "课程",
    "学时/学分",
    "上课时间",
    "上课地点",
    "备注",
    "年级"
  ];
  dataLoaded = false;
  message = "";

  dataIndex: LessonIndex[] = [];
  dataRaw: Lesson[] = [];
  formData = {
    checkedNj: [],
    checkedLx: [],
    checkedYx: [],
    scheduleKey: "",
    lecturerKey: "",
    placeKey: "",
    keyword: {
      keywordType: "kcmc",
      keyword: ""
    }
  };

  created() {
    fetch(`${dataURL}lessionData_index.json`)
      .then(res => res.json())
      .then(data => {
        this.dataIndex = data;
        this.selectedYear = this.dataIndex[this.dataIndex.length - 1]["year"];
        this.selectedSemester = this.dataIndex[this.dataIndex.length - 1][
          "semester"
        ];
      });
  }

  optionGenerator(data: Lesson[], attr: string): string[] {
    const attrVals: Set<string> = new Set();
    data.forEach((item: Lesson) => {
      // eslint-disable-next-line
      const itemAny = item as any;
      attrVals.add(itemAny[attr]);
    });
    return [...attrVals];
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
  get optionRange() {
    if (this.formData.keyword["keyword"] != "") {
      return this.dataAfterKeyword;
    } else {
      return this.dataRaw;
    }
  }
  get yxOptionList() {
    return this.optionGenerator(this.optionRange, "kkxy");
  }
  get lxOptionList() {
    return this.optionGenerator(this.optionRange, "kcxzmc");
  }
  get njOptionList() {
    return this.optionGenerator(this.optionRange, "nj")
      .sort(cmpChs)
      .filter(function(option) {
        return option.indexOf(",") == -1;
      })
      .sort(cmpChs);
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
            return lessonAny[keywordType].search(keyword) > -1;
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

    if (checkedNj.length) {
      filteringData = filteringData.filter((lesson: Lesson) => {
        return checkedNj.find(function(x) {
          return x == lesson.nj;
        });
      });
    }
    if (checkedLx.length) {
      filteringData = filteringData.filter((lesson: Lesson) => {
        return checkedLx.find(function(x) {
          return x == lesson.kcxzmc;
        });
      });
    }
    if (checkedYx.length) {
      filteringData = filteringData.filter((lesson: Lesson) => {
        return checkedYx.find(function(x) {
          return x == lesson.kkxy;
        });
      });
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

  updateSrcData() {
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
      this.message = "";
      fetch(
        `${dataURL}lessionData_${this.selectedYear}_${this.selectedSemester}.json`
      )
        .then(
          fetchProgress({
            // eslint-disable-next-line
            onProgress: (progress: any) => {
              let { transferred, total } = progress;
              transferred = Math.round(transferred / 1024);
              total = Math.round(total / 1024);
              setTimeout(() => (this.message = `${transferred}/${total}KB`), 0);
            }
          })
        )
        .then(res => res.json())
        .then(data => {
          this.dataRaw = data;
          this.dataLoaded = true;
        });
    } else {
      this.selectedSemester = this.availableSemester[
        this.availableSemester.length - 1
      ];
    }
  }
}
</script>

<style lang="scss"></style>
