<template>
  <div class="h-100 overflow-auto">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col" v-for="(n, lessonCol) in allCol" :key="lessonCol">
            {{ dayName[lessonCol] }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lessonRow in 14" :key="lessonRow">
          <th scope="row">{{ lessonRow }}</th>
          <td v-for="lessonCol in allCol" :key="lessonCol">
            <ClassBlock
              :day="lessonCol"
              :block="lessonRow"
              :lessonData="lessons"
              :mappingData="allMapping"
              :colorMapping="colorMapping"
            ></ClassBlock>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Lesson, ClassTableMapping, idOf } from "@/models";
import ClassBlock from "./ClassBlock.vue";

@Component({
  components: { ClassBlock }
})
export default class ClassTable extends Vue {
  dayName = [
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
    "星期日"
  ];

  @Prop() lessons!: Lesson[];

  @Prop() private colorMapping!: { [id: string]: string };

  parseWeek(data: string): number[] {
    const res = data.match(/^(\d+)-(\d+)周(\((单|双)\))?$/);
    const result: number[] = [];
    if (res) {
      const begin = parseInt(res[1]);
      const end = parseInt(res[2]);
      const step = res[3] ? 2 : 1;
      for (let i = begin; i <= end; i += step) {
        result.push(i);
      }
    } else {
      data.split(",").forEach(d => {
        const res = d.match(/^(\d+)周$/);
        if (res) {
          result.push(parseInt(res[1]));
        }
      });
    }
    return result;
  }

  parseBlock(data: string) {
    const res = data.match(/^(\d+)-(\d+)节$/);
    const result: number[] = [];
    if (res) {
      const begin = parseInt(res[1]);
      const end = parseInt(res[2]);
      for (let i = begin; i <= end; i += 1) {
        result.push(i);
      }
    }
    return result;
  }

  mappingOf(course: Lesson): ClassTableMapping {
    const mapping: ClassTableMapping = {};
    this.parseWeek(course.qsjsz).forEach(week => {
      this.parseBlock(course.skjc).forEach(block => {
        mapping[idOf(week, course.xqj, block)] = true;
      });
    });
    return mapping;
  }

  get allMapping() {
    const mm: { [id: string]: ClassTableMapping } = {};
    this.lessons.forEach(lesson => {
      const mapping = this.mappingOf(lesson);
      if (!(lesson.jxb_id in mm)) mm[lesson.jxb_id] = {};
      for (const key in mapping) {
        mm[lesson.jxb_id][key] = mm[lesson.jxb_id][key] || mapping[key];
      }
    });

    return mm;
  }

  get allCol() {
    let result = 5;
    this.lessons.forEach(lesson => {
      if (lesson.xqj > 5) {
        result = 7;
      }
    });
    return result;
  }
}
</script>

<style scoped lang="scss">
.classtable-row {
  min-height: 6.5vh;
  border-bottom: 0.1px dashed grey;
}
</style>
