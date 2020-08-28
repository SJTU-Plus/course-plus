<template>
  <div>
    <span
      v-for="(n, week) in 16"
      :key="week"
      v-bind:class="{
        'week-dot': isWeekDotVisible(weekPoints[week]),
        'week-dot-conflict': isWeekDotConflict(weekPoints[week]),
        'week-dot-empty': isWeekDotEmpty(weekPoints[week])
      }"
      v-bind:style="{ 'background-color': colorMapping[weekPoints[week]] }"
    ></span>
    <div v-if="!classTableConfig.simpleMode">
      <div
        v-for="lesson in shownCourses"
        :key="lesson.row_id"
        class="small my-2"
      >
        <div class="row mr-1">
          <div class="col-auto p-0">
            <span
              class="week-dot mr-1"
              v-if="colorMapping[lesson.jxb_id]"
              v-bind:style="{
                'background-color': colorMapping[lesson.jxb_id]
              }"
            ></span>
          </div>
          <div class="col p-0">
            <popper
              trigger="hover"
              :options="{
                placement: 'right',
                modifiers: { offset: { offset: '0,10px' } }
              }"
            >
              <LessonDetail
                :lesson="lesson"
                :color="colorMapping[lesson.jxb_id]"
                :lessonDetail="lessonDetail"
              ></LessonDetail>

              <span
                slot="reference"
                v-bind:class="{ 'text-danger': conflicts[lesson.jxb_id] }"
              >
                <span class="mr-1">{{ lesson.kch }}</span>
                <span>{{ lesson.kcmc }}</span>
              </span>
            </popper>

            <span>
              <br />
              <span class="mr-1">{{ lesson.jszc }}</span>
              <span>{{ lesson.xf }} 学分</span>
              <br />
              <!-- <div
            class="col p-0"
            v-for="(data, idx) in parseTimeLocation(lesson.sksj, lesson.jxdd)"
            :key="idx"
              >{{ data.time }}@{{ data.location }}</div>-->
              {{ parseTimeLocationDay(lesson.sksj, lesson.jxdd, day) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  Lesson,
  ClassTableMapping,
  idOf,
  ClassTableConfig,
  parseTimeLocationDay
} from "@/models";

import LessonDetail from "@/components/LessonDetail.vue";
import Popper from "vue-popperjs";

@Component({ components: { LessonDetail, Popper } })
export default class ClassBlock extends Vue {
  parseTimeLocationDay = parseTimeLocationDay;

  @Prop() private lessonData!: Lesson[];

  @Prop() private lessonDetail!: { [id: string]: LessonDetail };

  @Prop() private mappingData!: { [id: string]: ClassTableMapping };

  @Prop() private colorMapping!: { [id: string]: string };

  @Prop() private day!: number;

  @Prop() private block!: number;

  @Prop() classTableConfig!: ClassTableConfig;

  get weekPoints() {
    const result: string[] = [];
    for (let week = 1; week <= 16; week++) {
      const id = idOf(week, this.day, this.block);
      let course = "";
      for (const key in this.mappingData) {
        if (this.mappingData[key][id]) {
          if (course != "") {
            course = "conflict";
            break;
          } else {
            course = key;
          }
        }
      }
      result.push(course);
    }
    return result;
  }

  get uniqueLessonData() {
    const result: Lesson[] = [];
    const keys: { [id: string]: boolean } = {};
    this.lessonData.forEach(val => {
      const key = val.jxb_id;
      if (!(key in keys)) {
        keys[key] = true;
        result.push(val);
      }
    });
    result.sort((a, b) => (a.kch < b.kch ? -1 : a.kch > b.kch ? 1 : 0));
    return result;
  }

  get courses(): Lesson[] {
    return this.uniqueLessonData.filter(lesson => {
      for (let week = 1; week <= 16; week++) {
        const id = idOf(week, this.day, this.block);
        if (this.mappingData[lesson.jxb_id][id]) return true;
      }
      return false;
    });
  }

  get shownCourses(): Lesson[] {
    return this.courses.filter(lesson => !this.simpleMode[lesson.jxb_id]);
  }

  get simpleMode(): { [id: string]: boolean } {
    const result: { [id: string]: boolean } = {};
    this.courses.forEach(lesson => {
      let isSimple = false;
      for (let week = 1; week <= 16; week++) {
        if (this.block - 1 >= 1) {
          const id = idOf(week, this.day, this.block - 1);
          if (this.mappingData[lesson.jxb_id][id]) isSimple = true;
        }
      }
      result[lesson.jxb_id] = isSimple;
    });
    return result;
  }

  get conflicts(): { [id: string]: boolean } {
    const conflicts: { [id: string]: boolean } = {};
    for (let week = 1; week <= 16; week++) {
      const id = idOf(week, this.day, this.block);
      let course = "";
      for (const key in this.mappingData) {
        if (this.mappingData[key][id]) {
          if (course != "") {
            conflicts[key] = true;
            conflicts[course] = true;
          } else {
            course = key;
          }
        }
      }
    }
    return conflicts;
  }

  isWeekDotVisible(data: string) {
    return data != "conflict" && data != "";
  }

  isWeekDotConflict(data: string) {
    return data == "conflict";
  }

  isWeekDotEmpty(data: string) {
    return data == "";
  }
}
</script>

<style scoped lang="scss">
.week-dot {
  width: 6px;
  height: 6px;
  margin: 1px;
  border-radius: 50%;
  display: inline-block;
}
.week-dot-conflict {
  width: 6px;
  height: 6px;
  margin: 1px;
  display: inline-block;
  border: 0.5px solid #000000 !important;
}
.week-dot-empty {
  width: 6px;
  height: 6px;
  margin: 1px;
  border-radius: 50%;
  display: inline-block;
  border: 0.5px solid #dee2e6 !important;
}
</style>
