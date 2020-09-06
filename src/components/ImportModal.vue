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
          <p>步骤如下：</p>
          <ol>
            <li>
              将链接直接拖拽至书签栏或在右键菜单选择保存至书签栏：
              <a :href="importBookmark" target="_blank">
                读取iSJTU页面上的课表
              </a>
              ，本链接包含JavaScript代码，能够运行于教学信息服务网页面上。
            </li>
            <li>
              访问
              <a href="https://i.sjtu.edu.cn" target="_blank">
                https://i.sjtu.edu.cn
              </a>
              ，并进入 信息查询-学生课表查询
            </li>
            <li>
              点击刚刚保存的书签，您的课表信息将被复制到剪贴板。
            </li>
            <li>
              将其粘贴到下方文本框中，本页面能够智能读取课表信息。
            </li>
          </ol>

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

  importBookmark =
    'javascript:(function(){const e=(t="/html/body/div[1]/div/div/div[5]/div[1]/table/tbody/tr[1]/td/div[1]/h6[2]",document.evaluate(t,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue).textContent.match(/\\d+/g)[0];var t;fetch("https://i.sjtu.edu.cn/kbcx/xskbcx_cxXsKb.html?gnmkdm=N2151&su="+e,{method:"POST",credentials:"same-origin",body:"xnm=2020&xqm=3",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then(e=>e.json()).then(e=>(function(e){const t=document.createElement("div"),n=document.createElement("span");t.style="position:fixed;top:0;left:0;width:100vw;height:100vh;display:flex;justify-content:center;align-items:center;background:#FFF;z-index:999999",n.textContent="点击此处复制课表",t.append(n),t.onclick=(n=>{const d=document.createElement("textarea"),o=document.getSelection();d.textContent=e,document.body.appendChild(d),o.removeAllRanges(),d.select(),document.execCommand("copy"),o.removeAllRanges(),document.body.removeChild(d),document.body.removeChild(t)}),document.body.append(t)})(JSON.stringify(e)))})();';
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
