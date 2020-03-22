import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

let token = '';

if (localStorage.getItem('AUTH_TOKEN')) {
  token = localStorage.getItem('AUTH_TOKEN');
} else if (window.location.hash) {
  // Extract token from URL
  // Id_token=....
  [, token] = window.location.hash
    .split('&')
    .filter((el) => el.includes('id_token'))[0]
    // [id_token, <value>]
    .split('=');

  localStorage.setItem('AUTH_TOKEN', token);
} else {
  window.location.href = 'https://corona-cal.auth.eu-west-1.amazoncognito.com/login?response_type=token&client_id=osupm9rc8kv7jpnhjdtsqu7vj&redirect_uri=https://d30c8b2026z1gr.cloudfront.net';
}

const axiosInstance = axios.create({
  baseURL: 'https://e3bzj7x3ck.execute-api.eu-west-1.amazonaws.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('AUTH_TOKEN');
      window.location.href = 'https://corona-cal.auth.eu-west-1.amazoncognito.com/login?response_type=token&client_id=osupm9rc8kv7jpnhjdtsqu7vj&redirect_uri=https://d30c8b2026z1gr.cloudfront.net';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

Vue.prototype.$http = axiosInstance;

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
