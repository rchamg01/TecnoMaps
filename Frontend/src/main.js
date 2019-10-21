import Vue from "vue";
import Vuetify from "vuetify";
import VueResource from "vue-resource";
import App from "./App";
import VueSidebarMenu from "vue-sidebar-menu";
import router from "./router";
import "./plugins/vuetify";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import store from "./store";
import VueLayers from "vuelayers";
import "vuelayers/lib/style.css";

Vue.use(VueLayers);
Vue.use(VueResource);
Vue.use(VueSidebarMenu);
Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");