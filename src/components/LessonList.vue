<template>
  <div class="h-100 overflow-auto" ref="self">
    <p class="text-center mt-3">共 {{ data | length }} 条记录</p>
    <div class="table-responsive-md">
      <table class="table table-sm small sjtu-table">
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
      <div
        class="d-flex align-items-center justify-content-center mb-3"
        v-if="pagedSize < data.length"
      >
        <div class="spinner-border spinner-border-sm mr-3 text-muted"></div>
        <span class="text-muted">正在加载数据……</span>
      </div>
      <div
        class="d-flex align-items-center justify-content-center mb-3"
        v-if="pagedSize >= data.length"
      >
        <span class="text-muted">以上为全部 {{ data | length }} 条记录</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Ref } from "vue-property-decorator";
import { Lesson } from "@/models";
import Loading from "./Loading.vue";

@Component({
  components: { Loading },
  filters: {
    length(data: Lesson[]) {
      return data.length;
    }
  }
})
export default class LessonList extends Vue {
  @Prop() private data!: Lesson[];

  @Prop() private tableHeader!: string[];

  @Ref("self") readonly selfDiv!: HTMLDivElement;

  bottom = false;

  increasement = 20;

  pagedSize = 0;

  b(s: string, sep: string) {
    if (!s) return "";
    return s.split(sep).join("<br>");
  }

  get pagedData() {
    return this.data.slice(0, this.pagedSize);
  }

  bottomVisible() {
    const scrollY = Math.ceil(this.selfDiv.scrollTop); // ceil it for compatibility
    const visible = Math.ceil(this.selfDiv.clientHeight + 1); // ceil it for compatibility
    const pageHeight = this.selfDiv.scrollHeight;
    const bottomOfPage = visible + scrollY >= pageHeight;
    return bottomOfPage || pageHeight < visible;
  }

  moreElements() {
    this.pagedSize = Math.min(
      this.pagedSize + this.increasement,
      this.data.length
    );
  }

  @Watch("bottom")
  onBottomChanged(bottom: boolean) {
    if (bottom) {
      this.moreElements();
    }
  }

  @Watch("data")
  onDataChanged() {
    this.pagedSize = this.increasement;
    this.selfDiv.scrollTop = 0;
  }

  mounted() {
    this.selfDiv.addEventListener("scroll", () => {
      this.bottom = this.bottomVisible();
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.sjtu-table {
  table-layout: fixed;
}
</style>
