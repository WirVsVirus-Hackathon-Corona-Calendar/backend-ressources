import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

Vue.prototype.$URL = 'https://e3bzj7x3ck.execute-api.eu-west-1.amazonaws.com/v1';

if (window.location.hash) {
  // Extract token from URL
  // Id_token=....
  const token = window.location.hash
    .split('&')
    .filter((el) => el.includes('id_token'))[0]
  // [id_token, <value>]
    .split('=')[1];

  Vue.prototype.$token = token;
}


new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
