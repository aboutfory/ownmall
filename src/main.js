// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueCarousel from 'vue-carousel'
import VueLazyLoad from 'vue-lazyload'
/*import hello from './components/HelloWorld.vue'
import goodslist from './views/goodslist.vue'*/
Vue.config.devtools = true;
Vue.use(VueCarousel);
Vue.use(VueLazyLoad, {
  loading:"../../static/loadingPic/loading-bars.svg"
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})



/*Vue.use(router);
export default new router({
  routes: [
    {
      path: '/',
      name: 'goodslist',
      component:goodslist
    }
   ]
})*/

