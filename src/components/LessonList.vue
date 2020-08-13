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
            <th class="kcbm" scope="row">
              <button
                type="button"
                class="btn btn-link btn-sm star-btn"
                @click="star(lesson.jxb_id)"
              >
                <span
                  v-bind:class="{
                    'text-primary': isStarred(lesson.jxb_id),
                    'text-muted': !isStarred(lesson.jxb_id)
                  }"
                >
                  <StarIcon size="1.5x"></StarIcon>
                  {{ lesson.kch }}
                </span>
              </button>
              <br />
              <popper
                trigger="hover"
                :options="{
                  placement: 'right',
                  modifiers: { offset: { offset: '0,10px' } }
                }"
              >
                <LessonDetail
                  :lesson="lesson"
                  :lessonDetail="lessonDetail"
                ></LessonDetail>

                <button
                  type="button"
                  class="btn btn-link btn-sm text-muted"
                  slot="reference"
                >
                  <MessageSquareIcon size="1.5x"></MessageSquareIcon>&nbsp; 详情
                </button>
              </popper>
            </th>
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
        v-observe-visibility="onBottomVisibilityChanged"
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
import {
  Component,
  Prop,
  Vue,
  Watch,
  Ref,
  Model
} from "vue-property-decorator";
import VueObserveVisibility from "vue-observe-visibility";
import { Lesson } from "@/models";
import Loading from "@/components/Loading.vue";
import { StarIcon, MessageSquareIcon } from "vue-feather-icons";
import Popper from "vue-popperjs";
import LessonDetail from "@/components/LessonDetail.vue";

Vue.use(VueObserveVisibility);

@Component({
  components: { Loading, StarIcon, Popper, MessageSquareIcon, LessonDetail },
  filters: {
    length(data: Lesson[]) {
      return data.length;
    }
  }
})
export default class LessonList extends Vue {
  @Prop() private data!: Lesson[];

  @Prop() private lessonDetail!: { [id: string]: LessonDetail };

  @Prop() private tableHeader!: string[];

  @Ref("self") readonly selfDiv!: HTMLDivElement;

  @Model("change") starredCourses!: string[];

  increasement = 20;

  pagedSize = 0;

  b(s: string, sep: string) {
    if (!s) return "";
    return s.split(sep).join("<br>");
  }

  get pagedData() {
    return this.data.slice(0, this.pagedSize);
  }

  moreElements() {
    this.pagedSize = Math.min(
      this.pagedSize + this.increasement,
      this.data.length
    );
  }

  onBottomVisibilityChanged(bottomVisible: boolean) {
    if (bottomVisible) {
      setTimeout(() => this.moreElements(), 200); // you should be patient
    }
  }

  @Watch("data")
  onDataChanged() {
    this.pagedSize = this.increasement;
    this.selfDiv.scrollTop = 0;
  }

  star(id: string) {
    if (this.starredCourses.includes(id)) {
      this.$emit(
        "change",
        this.starredCourses.filter(d => d != id)
      );
    } else {
      this.starredCourses.push(id);
      this.$emit("change", this.starredCourses);
    }
  }

  isStarred(id: string) {
    return this.starredCourses.includes(id);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.sjtu-table {
  table-layout: fixed;
}

.star-btn:focus {
  outline: 0 !important;
}
</style>
