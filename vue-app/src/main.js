import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
Vue.component("LoaderDialog", () =>
  import(/* webpackChunkName: "loaderDialog" */ "@/subcomponents/LoaderDialog")
);
Vue.component("BooleanFilterSelect", () =>
  import(
    /* webpackChunkName: "booleanFilterSelect" */ "@/subcomponents/BooleanFilterSelect"
  )
);
Vue.prototype.ajaxUrls = window.ajaxUrls;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
