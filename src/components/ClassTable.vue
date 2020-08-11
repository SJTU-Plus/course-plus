<template>
  <div class="h-100 overflow-auto">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col" v-for="(n, lessonCol) in 7" :key="lessonCol">
            {{ dayName[lessonCol] }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(n, lessonRow) in 14" :key="lessonRow">
          <th scope="row">{{ n }}</th>
          <td v-for="(n, lessonCol) in 7" :key="lessonCol">
            {{ dataOf(lessonCol, lessonRow) }}
          </td>
        </tr>
      </tbody>
    </table>
    {{ lessons }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Lesson } from "@/models";

@Component
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

  dataOf(col: number, row: number) {
    return `${col}, ${row}`;
  }
}
</script>

<style scoped lang="scss">
.classtable-row {
  min-height: 6.5vh;
  border-bottom: 0.1px dashed grey;
}
</style>
