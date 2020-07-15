<template>
  <div id="app">
    <nav class="navbar navbar-light bg-light mb-3">
      <span class="navbar-brand mb-0">SJTU 学期开课表</span>
    </nav>
    <div class="container">
      <form name="LessonFilter">
        <div class="form-row">
          <div class="col-md-3 mb-3">
            <label for="inputYear">学年</label>
            <select
              class="form-control form-control-sm"
              id="inputYear"
              v-model="selectedYear"
            >
              <option v-for="year in availableYear" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div class="col-md-3 mb-3">
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
          <div class="col-md-6 mb-3">
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
        </div>
        <div class="form-row">
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

        <div class="form-group row">
          <label class="col-md-2 col-sm-12 col-form-label">年级</label>
          <div class="col-md-10 col-sm-12 container">
            <div class="row">
              <span
                class="form-check col-lg-4 col-md-6 col-sm-12"
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
        <div class="form-group row">
          <label class="col-md-2 col-sm-12 col-form-label">课程类型</label>
          <div class="col-md-10 col-sm-12 container">
            <div class="row">
              <span
                class="form-check col-lg-4 col-md-6 col-sm-12"
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
        <div class="form-group row">
          <label class="col-md-2 col-sm-12 col-form-label">开课院系</label>
          <div class="col-md-10 col-sm-12 container">
            <div class="row">
              <div
                class="form-check col-lg-4 col-md-6 col-sm-12"
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
    <div class="container-fluid">
      <LessonList
        :dataPaged="dataPaged"
        :tableHeader="tableHeader"
      ></LessonList>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { LessonIndex, Lesson } from "./models";
import { cmpChs, range } from "./utils";
import LessonList from "./components/LessonList.vue";

const dataURL = "course-plus-data/";
@Component({
  components: { LessonList },
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

  pageNow = 1;
  pageMaxItemCount = 3;
  pageMaxItemCountBeforeChange = 3;
  pageMaxItemCountList = [1, 3, 5, 10, 20, 30, 50, 80, 100, 150, 200, 250, 300];

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
  get dataPaged() {
    const dataOffset = this.pageMaxItemCount * (this.pageNow - 1);
    return this.dataFiltered.slice(
      dataOffset,
      this.pageMaxItemCount + dataOffset
    );
  }
  get pageShowRange() {
    //共显示九个项目
    //示例格式：
    //            < 1 > < 2 > < 3 > < 4 > < 5 >              当前可能页：< 1 > - < 5 >
    //< 1 > < 2 > < 3 > < 4 > < 5 > < 6 > < 7 > < 8 > < 9 >  当前可能页：< 1 > - < 9 >
    //< 1 > <···> < 4 > < 5 > < 6 > < 7 > < 8 > <···> <11 >  当前可能页：< 6 >
    //< 1 > <···> < 4 > < 5 > < 6 > < 7 > < 8 > < 9 > <10 >  当前可能页：< 6 > - <10 >
    //< 1 > < 2 > < 3 > < 4 > < 5 > < 6 > < 7 > <···> <10 >  当前可能页：< 1 > - < 5 >
    const midPartCount = 5;

    if (this.pageCount <= 2 * midPartCount - 1) {
      return range(this.pageCount, 1);
    }

    const omittedFlagL = this.pageNow >= 1 + midPartCount;
    const omittedFlagR = this.pageNow <= this.pageCount - midPartCount;

    let midPage;
    if (omittedFlagL && !omittedFlagR) {
      midPage = this.pageCount - midPartCount + 1;
    } else if (omittedFlagR && !omittedFlagL) {
      midPage = midPartCount;
    } else {
      midPage = this.pageNow;
    }

    return (omittedFlagL ? [1, "···"] : [1, 2])
      .concat(range(midPartCount, midPage - midPartCount + 3))
      .concat(
        omittedFlagR
          ? ["···", this.pageCount]
          : [this.pageCount - 1, this.pageCount]
      );
  }
  get pageCount() {
    return Math.ceil(this.dataFiltered.length / this.pageMaxItemCount);
  }

  @Watch("selectedYear")
  onSelectedYearChanged() {
    this.updateSrcData();
  }
  @Watch("selectedSemester")
  onSelectedSemesterChanged() {
    this.updateSrcData();
  }
  @Watch("formData.keyword", { deep: true })
  onFormDataChanged() {
    this.clearInvalidFormSelections();
  }

  @Watch("dataRaw")
  onDataRawChanged() {
    this.clearInvalidFormSelections();
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
      fetch(
        `${dataURL}lessionData_${this.selectedYear}_${this.selectedSemester}.json`
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

  clearInvalidFormSelections() {
    console.log("!");
  }

  @Watch("dataFiltered")
  onDataFilteredChanged() {
    this.pageNow = 1;
  }

  @Watch("pageMaxItemCount")
  onPageMaxItemCountChanged() {
    this.pageNow =
      1 +
      Math.floor(
        ((this.pageNow - 1) * this.pageMaxItemCountBeforeChange) /
          this.pageMaxItemCount
      );
    console.log(this.pageNow);
    this.pageMaxItemCountBeforeChange = this.pageMaxItemCount;
  }
}
</script>

<style lang="scss"></style>
