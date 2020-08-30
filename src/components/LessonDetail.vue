<template>
  <div class="card lesson-detail-card shadow-sm font-weight-normal">
    <div class="card-body">
      <h5 class="card-title">
        <span
          class="lesson-dot"
          v-if="color"
          v-bind:style="{ 'background-color': color }"
        ></span>
        {{ lesson.kch }} {{ lesson.kcmc }}
      </h5>
      <h6 class="card-subtitle mb-2 text-muted">
        <span>{{ lesson.jszc }}</span>
        <span v-if="lesson.jszc != lesson.zjs"
          >(上课教师: {{ lesson.zjs }})</span
        >
        <span class="ml-1">{{ lesson.kkxy }}</span>
      </h6>

      <p class="card-text">
        <span class="mr-1">{{ lesson.kklx }}</span>
        <span class="mr-1">{{ lesson.zhxs }}</span>
        <span class="mr-1">{{ lesson.rwzxs }} 学时</span>
        <span class="mr-1">{{ lesson.kcxzmc }}</span>
      </p>
      <p class="card-text">备注：{{ lesson.xkbz }}</p>
      <span class="card-text">班级组成</span>
      <ul class="list-group list-group-flush border-top border-bottom mb-3">
        <li
          class="list-group-item py-1"
          v-for="(item, idx) in split(lesson.jxbzc, ';')"
          :key="idx"
        >
          {{ item }}
        </li>
      </ul>
      <span class="card-text">时间地点</span>
      <ul class="list-group list-group-flush border-top border-bottom mb-3">
        <li
          class="list-group-item py-1"
          v-for="(data, idx) in parseTimeLocation(lesson.sksj, lesson.jxdd)"
          :key="idx"
        >
          <div class="row">
            <div class="col-7">{{ data.time }}</div>
            <div class="col-5">{{ data.location }}</div>
          </div>
        </li>
      </ul>
      <Loading :ready="lessonDetail"></Loading>
      <p v-if="lessonDetail">
        {{
          (((lessonDetail || {})[lesson.kch] || {}).profile || {}).chineseIntro
        }}
      </p>
      <p v-if="lessonDetail">
        {{
          (((lessonDetail || {})[lesson.kch] || {}).profile || {}).englishIntro
        }}
      </p>
      <p class="card-text text-muted pb-3">
        <span class="mr-1">{{ lesson.jxbmc }}</span>
        <br />
        <span class="mr-1">{{ lesson.nj }} 年级,</span>
        <span class="mr-1">{{ lesson.xn }} 学年 {{ lesson.xq }} 学期</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  Lesson,
  LessonTimeLocation,
  LessonDetail as LessonDetailModel
} from "@/models";
import { parseTimeLocation } from "@/utils";
import Loading from "@/components/Loading.vue";

@Component({ components: { Loading } })
export default class LessonDetail extends Vue {
  @Prop() private lesson!: Lesson;

  @Prop() private color!: string;

  @Prop() private lessonDetail!: { [id: string]: LessonDetailModel };

  parseTimeLocation(time: string, location: string): LessonTimeLocation[] {
    return parseTimeLocation(time, location);
  }

  split(data: string, by: string): string[] {
    return data.split(by);
  }
}
</script>

<style scoped lang="scss">
.lesson-detail-card {
  width: 25rem;
  max-height: 40rem;
  overflow-y: auto;
  z-index: 999;
}

.lesson-dot {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  border-radius: 50%;
  display: inline-block;
}
</style>
