import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

let token = '';

if (window.location.hash) {
  // Extract token from URL
  // Id_token=....
  [token] = window.location.hash
    .split('&')
    .filter((el) => el.includes('id_token'))[0]
    // [id_token, <value>]
    .split('=');
}

Vue.prototype.$http = axios.create({
  baseURL: 'https://e3bzj7x3ck.execute-api.eu-west-1.amazonaws.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
