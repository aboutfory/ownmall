import Vue from 'vue'
import Router from 'vue-router'
import goodslist from '@/views/goodslist.vue'
import cart from '@/views/cart.vue'
import order from '@/views/order.vue'
import address from '@/views/address.vue'
import rootlogin from '@/views/rootlogin.vue'
import roots from '@/views/roots.vue'
import jieqigushi from '@/views/jieqigushi.vue'
import nongchanpinjianjie from '@/views/nongchanpinjianjie.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'goodslist',
      component: goodslist
    },
    {
      path: '/cart',
      name: 'cart',
      component: cart
    },
    {
      path: '/order',
      name: 'order',
      component: order
    },
    {
      path: '/address',
      name: 'address',
      component: address
    },
    {
      path: '/rootlogin',
      name: 'rootlogin',
      component: rootlogin
    },
    {
      path: '/roots',
      name: 'roots',
      component: roots
    },
    {
      path: '/jieqigushi',
      name: 'jieqigushi',
      component: jieqigushi
    },
    {
      path: '/nongchanpinjianjie',
      name: 'nongchanpinjianjie',
      component: nongchanpinjianjie
    }
  ]
})
