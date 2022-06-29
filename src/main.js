import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Croppa from 'vue-croppa'
import 'vue-croppa/dist/vue-croppa.css';
import VueLoading from 'vuejs-loading-plugin';

Vue.use(Croppa)
Vue.config.productionTip = false


 
// Vue-loading component - using default options
Vue.use(VueLoading, {
  dark: true, 
  text: 'Validating', 
  loading: false, 
  background: 'rgb(255,255,255)', 
  classes: ['myclass'] 
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')




