<template>
  <div>
    <transition name="fade">
      <div class="d-flex align-items-center p-3">
        <div class="spinner-border spinner-border-sm mx-3" v-if="!ready"></div>
        <span class="text-info" v-if="!ready">正在加载数据...</span>
        <span class="text-success" v-if="ready">数据已加载</span>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Loading extends Vue {
  @Prop() private ready!: boolean;
}
</script>

<style scoped lang="scss">
</style>
