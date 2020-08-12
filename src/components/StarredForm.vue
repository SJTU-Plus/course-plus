<template>
  <div>
    <div class="form-row">
      <label class="col-form-label"
        >星标课程 ({{ selectedScore }} / {{ totalScore }} 学分)</label
      >
      <div class="col-12">
        <div class="row">
          <span
            class="form-check col-12"
            v-for="lesson in allCourses"
            :key="lesson.row_id"
          >
            <input
              class="form-check-input"
              name="lesson.jxb_id"
              type="checkbox"
              :id="lesson.jxb_id"
              :value="lesson.jxb_id"
              v-model="selected"
            />
            <label class="form-check-label" :for="lesson.jxb_id">
              <span
                class="course-square"
                v-if="colorMapping[lesson.jxb_id]"
                v-bind:style="{
                  'background-color': colorMapping[lesson.jxb_id]
                }"
              ></span>
              {{ lesson.kch }}
              {{ lesson.kcmc }}
              {{ lesson.jszc }}
            </label>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Watch } from "vue-property-decorator";
import { Lesson } from "@/models";

@Component
export default class StarredForm extends Vue {
  @Prop() readonly allCourses!: Lesson[];

  @Model("change") selectedCourses!: string[];

  @Prop() private colorMapping!: { [id: string]: string };

  selected: string[] = [];

  created() {
    this.selected = this.selectedCourses;
  }

  @Watch("selectedCourses")
  onEvent() {
    this.selected = this.selectedCourses;
  }

  @Watch("selected")
  onSelectedChange(value: string[]) {
    this.$emit("change", value);
  }

  get totalScore() {
    const courses = this.allCourses;
    let score = 0;
    courses.forEach(course => {
      score += parseFloat(course.xf);
    });
    return score;
  }

  get selectedScore() {
    const courses = this.allCourses;
    let score = 0;
    courses.forEach(course => {
      if (this.selected.includes(course.jxb_id)) {
        score += parseFloat(course.xf);
      }
    });

    return score;
  }
}
</script>

<style scoped lang="scss">
.course-square {
  width: 8px;
  height: 8px;
  margin: 1px;
  display: inline-block;
}
</style>
