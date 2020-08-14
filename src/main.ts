import Vue from "vue";
import App from "./App.vue";

import "bootstrap/dist/css/bootstrap.css";
import "vue-popperjs/dist/vue-popper.css";
import "vue-github-buttons/dist/vue-github-buttons.css"; // Stylesheet
import "@/assets/main.scss";

import VueGitHubButtons from "vue-github-buttons";
Vue.use(VueGitHubButtons);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
