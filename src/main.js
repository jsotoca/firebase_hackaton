import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'

Vue.config.productionTip = false
 // Your web app's Firebase configuration
 const firebaseConfig = {
  apiKey: "AIzaSyAM0_zIvlhNrJl5ak-KEJlx4nAjttqViA8",
  authDomain: "hackaton-55a74.firebaseapp.com",
  databaseURL: "https://hackaton-55a74.firebaseio.com",
  projectId: "hackaton-55a74",
  storageBucket: "gs://hackaton-55a74.appspot.com/",
  messagingSenderId: "101026409437",
  appId: "1:101026409437:web:5e62ed251955fb2c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
