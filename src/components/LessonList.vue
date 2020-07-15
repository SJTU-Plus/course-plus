<template>
  <div>
    <div class="table-responsive-md" v-if="dataPaged != 0">
      <table class="table">
        <thead>
          <tr>
            <th
              scope="col"
              class="table-header"
              v-for="header in tableHeader"
              :key="header"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lesson in dataPaged" :key="lesson.jxbmc">
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Lesson } from "@/models";

@Component
export default class LessonList extends Vue {
  @Prop() private dataPaged!: Lesson[];
  @Prop() private tableHeader!: string[];

  b(s: string, sep: string) {
    if (!s) return "";
    return s.split(sep).join("<br>");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
