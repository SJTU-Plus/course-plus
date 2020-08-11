<template>
  <div>
    <div class="form-row">
      <div class="col-12 mb-3">
        <label for="inputKeyword">搜索方式</label>
        <div id="searchBox" class="input-group">
          <div class="input-group-prepend">
            <select
              class="form-control custom-select"
              id="keyword-type"
              v-model="value.keyword.keywordType"
            >
              <option value="kcmc">课程名称</option>
              <option value="kch">课号</option>
            </select>
          </div>
          <input
            type="text"
            id="inputKeyword"
            class="form-control"
            v-model="value.keyword.keyword"
          />
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <label for="inputTime">上课时间</label>
        <input
          type="text"
          class="form-control"
          placeholder="不限时间"
          id="inputTime"
          v-model="value.scheduleKey"
        />
      </div>
      <div class="col-md-4 mb-3">
        <label for="inputLecturer">教师</label>
        <input
          type="text"
          class="form-control"
          placeholder="不限教师"
          id="inputLecturer"
          v-model="value.lecturerKey"
        />
      </div>
      <div class="col-md-4 mb-3">
        <label for="inputPlace">地点</label>
        <input
          type="text"
          id="inputPlace"
          class="form-control"
          placeholder="不限地点"
          v-model="value.placeKey"
        />
      </div>
    </div>
    <div class="form-row">
      <label class="col-form-label">年级</label>
      <div class="col-12">
        <div class="row">
          <span
            class="form-check col-lg-6"
            v-for="nj in njOptionList"
            :key="nj"
          >
            <input
              class="form-check-input"
              name="nj"
              type="checkbox"
              :id="nj"
              :value="nj"
              v-model="value.checkedNj"
            />
            <label class="form-check-label" :for="nj">
              {{ nj }}
              <span class="badge badge-pill badge-secondary">
                {{ filterDataLength(dataAfterKeyword, "nj", nj) }}
              </span>
            </label>
          </span>
        </div>
      </div>
    </div>

    <div class="form-row">
      <label class="col-form-label">课程类型</label>
      <div class="col-12">
        <div class="row">
          <span class="form-check col-12" v-for="lx in lxOptionList" :key="lx">
            <input
              class="form-check-input"
              name="lx"
              type="checkbox"
              :id="lx"
              :value="lx"
              v-model="value.checkedLx"
            />
            <label class="form-check-label" :for="lx">
              {{ lx }}
              <span class="badge badge-pill badge-secondary">
                {{ filterDataLength(dataAfterKeyword, "kcxzmc", lx) }}
              </span>
            </label>
          </span>
        </div>
      </div>
    </div>
    <div class="form-row">
      <label class="col-form-label">开课院系</label>

      <div class="col-12">
        <div class="row">
          <div class="form-check col-12" v-for="yx in yxOptionList" :key="yx">
            <input
              class="form-check-input"
              name="yx"
              type="checkbox"
              :id="yx"
              :value="yx"
              v-model="value.checkedYx"
            />
            <label class="form-check-label" :for="yx">
              {{ yx }}
              <span class="badge badge-pill badge-secondary">
                {{ filterDataLength(dataAfterKeyword, "kkxy", yx) }}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop } from "vue-property-decorator";
import { Lesson, SearchFilter } from "./models";
import { cmpChs } from "./utils";

@Component
export default class FilterForm extends Vue {
  @Model("input") value!: SearchFilter;

  @Prop() dataAfterKeyword!: Lesson[];

  concatUnique<T>(a: T[], b: T[]): T[] {
    const vals: Set<T> = new Set();
    a.forEach(item => vals.add(item));
    b.forEach(item => vals.add(item));
    return [...vals];
  }

  optionGenerator(data: Lesson[], attr: string): string[] {
    const attrVals: Set<string> = new Set();
    data.forEach((item: Lesson) => {
      // eslint-disable-next-line
      const itemAny = item as any;
      attrVals.add(itemAny[attr]);
    });
    return [...attrVals];
  }

  get optionRange() {
    return this.dataAfterKeyword;
  }

  get yxOptionList() {
    return this.concatUnique(
      this.optionGenerator(this.optionRange, "kkxy"),
      this.value.checkedYx
    );
  }

  get lxOptionList() {
    return this.concatUnique(
      this.optionGenerator(this.optionRange, "kcxzmc"),
      this.value.checkedLx
    );
  }

  get njOptionList() {
    return this.concatUnique(
      this.optionGenerator(this.optionRange, "nj"),
      this.value.checkedNj
    )
      .sort(cmpChs)
      .filter(function(option) {
        return option.indexOf(",") == -1;
      })
      .sort(cmpChs);
  }

  filterDataLength(data: Lesson[], field: string, value: string): number {
    return data.filter((lesson: Lesson) => {
      // eslint-disable-next-line
      const lessonAny = lesson as any;
      return lessonAny[field] == value;
    }).length;
  }
}
</script>

<style lang="scss"></style>
