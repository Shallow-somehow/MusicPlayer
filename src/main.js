import Vue from 'vue'
import App from './App.vue'

import './assets/style/index.css'

import VueRouter from 'vue-router'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import discovery from './components/03.discovery.vue';
import playList from './components/04.playList.vue';
import songs from './components/05.songs.vue';
import mv from './components/06.mv.vue';
import result from './components/06.result.vue';
import playListsDetail from './components/playListsDetail.vue'
import mvDetail from './components/mvDetail.vue';


Vue.config.productionTip = false




Vue.use(ElementUI);
Vue.use(VueRouter)


let router = new VueRouter({
  routes: [
    {
      path: '/',
      component: discovery
    }, {
      path: '/discovery',
      component: discovery
    }, {
      path: '/playList',
      component: playList
    }, {
      path: '/songs',
      component: songs
    }, {
      path: '/mv',
      component: mv
    }, {
      path: '/result',
      component: result
    }, {
      path: '/playListsDetail',
      component: playListsDetail
    }, {
      path: '/mvDetail',
      component: mvDetail
    }
  ]
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
