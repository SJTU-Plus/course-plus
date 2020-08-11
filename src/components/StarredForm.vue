<template>
  <div>
    <div class="form-row">
      <label class="col-form-label">星标课程</label>
      <div class="col-12">
        <div class="row">
          <span
            class="form-check col-12"
            v-for="lesson in allCourses"
            :key="lesson.row_id"
          >
            <input
              class="form-check-input"
              name="lesson.row_id"
              type="checkbox"
              :id="lesson.row_id"
              :value="lesson.row_id"
              v-model="selected"
            />
            <label class="form-check-label" :for="lesson.row_id">
              {{ lesson.kch }}
              {{ lesson.kcmc }}
            </label>
          </span>
        </div>
      </div>
    </div>
    <p></p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Watch } from "vue-property-decorator";
import { Lesson } from "@/models";

@Component
export default class StarredForm extends Vue {
  @Prop() readonly allCourses!: Lesson[];

  @Model("change") selectedCourses!: number[];

  selected: number[] = [];

  created() {
    this.selected = this.selectedCourses;
  }

  @Watch("selected")
  onSelectedChange(value: number[]) {
    this.$emit("change", value);
  }
}
</script>

<style scoped lang="scss"></style>
