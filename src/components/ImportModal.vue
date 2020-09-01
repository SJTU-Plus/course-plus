<template>
  <div class="import-modal-mask">
    <div class="import-modal-wrapper">
      <div class="import-modal-container">
        <div class="import-modal-header">
          <h3>
            导入您的课程
          </h3>
        </div>

        <div class="import-modal-body">
          <p>
            1. 访问 <a href="https://i.sjtu.edu.cn">https://i.sjtu.edu.cn</a>
          </p>
          <p>
            2. 信息查询 - 学生课表查询
          </p>
          <p>
            3. 在 开发者工具 - 网络 中，找到形似
            http://kbcx.sjtu.edu.cn/kbcx/xskbcx_cxXsKb.html 的请求。
          </p>
          <p>
            4. 右键 复制 - 复制响应，并粘贴到下方文本框中。
          </p>
          <textarea class="form-control" v-model="inputJsonData" />
        </div>

        <div class="import-modal-footer">
          <slot name="footer">
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary import-button"
              @click="$emit('cancel')"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-primary import-button"
              @click="$emit('confirm')"
            >
              导入
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
@Component
export default class ImportModal extends Vue {
  @PropSync("jsonData", { type: String }) private inputJsonData!: string;
}
</script>

<style scoped>
.import-modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.import-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.import-modal-container {
  width: 600px;
  margin: 0 auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.import-modal-header h3 {
  margin-top: 0;
}

.import-modal-body {
  margin: 20px 0;
  display: grid;
}

.import-modal-footer {
  display: flex;
  justify-content: flex-end;
}

.import-button {
  margin-left: 5px;
}

.import-modal-enter {
  opacity: 0;
}

.import-modal-leave-active {
  opacity: 0;
}

.import-modal-enter .import-modal-container,
.import-modal-leave-active .import-modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
