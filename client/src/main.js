import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Buefy from 'buefy'
import VueApexCharts from 'vue-apexcharts'
import 'buefy/dist/buefy.css'

Vue.use(VueApexCharts)
Vue.use(Buefy)
Vue.config.productionTip = false;
Vue.component('apexchart', VueApexCharts)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
