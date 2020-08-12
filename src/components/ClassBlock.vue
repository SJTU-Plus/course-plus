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
      <div v-for="lesson in courses" :key="lesson.row_id" class="small my-1">
        <span
          class="week-dot"
          v-if="colorMapping[lesson.jxb_id]"
          v-bind:style="{
            'background-color': colorMapping[lesson.jxb_id]
          }"
        ></span>
        {{ lesson.kch }}
        <br />
        {{ lesson.kcmc }}
        <br />
        {{ lesson.jszc }}
        <br />
        {{ lesson.jxbmc }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Lesson, ClassTableMapping, idOf, ClassTableConfig } from "@/models";

@Component
export default class ClassBlock extends Vue {
  @Prop() private lessonData!: Lesson[];

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
