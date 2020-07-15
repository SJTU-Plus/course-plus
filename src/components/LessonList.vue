<template>
  <div>
    <div class="table-responsive-md">
      <table class="table table-sm">
        <thead>
          <tr>
            <th
              scope="col"
              class="table-header"
              v-for="header in tableHeader"
              :key="header"
            >{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lesson in pagedData" :key="lesson.row_id">
            <th class="kcbm" scope="row">{{ lesson.kch }}</th>
            <td class="yxmc">{{ lesson.kkxy }}</td>
            <td class="xm" v-html="b(lesson.jszc, ',')"></td>
            <td class="kcmc">{{ lesson.kcmc }}</td>
            <td class="xsxf">{{ lesson.rwzxs }} / {{ lesson.xf }}</td>
            <td class="sksj" v-html="b(lesson.sksj, ';')"></td>
            <td class="jxdd" v-html="b(lesson.jxdd, ';')"></td>
            <td class="bz">{{ lesson.xkbz }}</td>
            <td class="nj">{{ lesson.nj }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-center">共 {{ data | length }} 条记录</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Lesson } from "@/models";

@Component({
  filters: {
    length(data: any[]) {
      return data.length;
    }
  }
})
export default class LessonList extends Vue {
  @Prop() private data!: Lesson[];
  @Prop() private tableHeader!: string[];

  b(s: string, sep: string) {
    if (!s) return "";
    return s.split(sep).join("<br>");
  }

  get pagedData() {
    return this.data.slice(0, 10);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
