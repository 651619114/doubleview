// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import AgoraRTC from 'agora-rtc-sdk-ng';
import http from './network/request'
import { VueAwesomeSwiper } from 'vue-awesome-swiper'
import ElementUI from 'element-ui';
import Scroll from './components/chat/scroll.vue'
import { Swipe, SwipeItem, Lazyload, Button } from 'vant'
import axios from "axios";
Vue.prototype.$AgoraRTC = AgoraRTC;
Vue.config.productionTip = false
Vue.use(axios);
Vue.use(ElementUI);
Vue.use(http);
/* eslint-disable no-new */
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
