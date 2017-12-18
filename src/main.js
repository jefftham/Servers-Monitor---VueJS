// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueLogger from 'vuejs-logger';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import VueMarkdown from 'vue-markdown';
import axios from 'axios';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';
import store from './store/store';

Vue.config.productionTip = false;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

Vue.use(VueMarkdown);
Vue.use(VueLogger, process.env.logOptions);
Vue.use(ElementUI, { locale });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
