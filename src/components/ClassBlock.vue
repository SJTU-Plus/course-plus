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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Lesson, ClassTableMapping, idOf } from "@/models";

@Component
export default class ClassBlock extends Vue {
  @Prop() private lessonData!: Lesson[];

  @Prop() private mappingData!: { [id: string]: ClassTableMapping };

  @Prop() private colorMapping!: { [id: string]: string };

  @Prop() private day!: number;

  @Prop() private block!: number;

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
