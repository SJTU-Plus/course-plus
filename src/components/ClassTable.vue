<template>
  <div class="h-100 overflow-auto">
    <table class="table classtable-table">
      <thead>
        <tr>
          <th scope="col" class="classtable-first-col">#</th>
          <th scope="col" v-for="(n, lessonCol) in allCol" :key="lessonCol">
            {{ dayName[lessonCol] }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lessonRow in 14" :key="lessonRow">
          <th scope="row" class="classtable-first-col p-1">{{ lessonRow }}</th>
          <td v-for="lessonCol in allCol" :key="lessonCol" class="p-1">
            <ClassBlock
              :day="lessonCol"
              :block="lessonRow"
              :lessonData="lessons"
              :mappingData="allMapping"
              :colorMapping="colorMapping"
              :classTableConfig="classTableConfig"
              :lessonDetail="lessonDetail"
            ></ClassBlock>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  Lesson,
  ClassTableMapping,
  idOf,
  ClassTableConfig,
  dayName,
  LessonDetail
} from "@/models";
import ClassBlock from "@/components/ClassBlock.vue";

@Component({
  components: { ClassBlock }
})
export default class ClassTable extends Vue {
  dayName = dayName;

  @Prop() lessons!: Lesson[];

  @Prop() private lessonDetail!: { [id: string]: LessonDetail };

  @Prop() classTableConfig!: ClassTableConfig;

  @Prop() private colorMapping!: { [id: string]: string };

  parseBin(data: number): number[] {
    const result = [];
    let i = 1;
    while (data > 0) {
      if (data % 2 == 1) result.push(i);
      i += 1;
      data = data >> 1;
    }
    return result;
  }

  mappingOf(course: Lesson): ClassTableMapping {
    const mapping: ClassTableMapping = {};
    this.parseBin(course.zcd).forEach(week => {
      this.parseBin(course.cdjc).forEach(block => {
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

.classtable-table {
  table-layout: fixed;
}

.classtable-first-col {
  width: 2rem !important;
}
</style>
