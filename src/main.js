// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Uimini from 'uimini/dist/css/uimini.css'
import App from './App'
import router from './router'
import store from './store'

import firebase  from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'
import 'firebase/storage'

Vue.use(
  Vuelidate,
  Uimini
  )

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    // Configuration
    var config = {
      apiKey: "AIzaSyD4xN1h1rjuv_0ci075SnBu-6aU7-8QA-g",
      authDomain: "projectlibrary-fd088.firebaseapp.com",
      databaseURL: "https://projectlibrary-fd088.firebaseio.com",
      projectId: "projectlibrary-fd088",
      storageBucket: "projectlibrary-fd088.appspot.com",
      messagingSenderId: "68111809899",
      appId: "1:68111809899:web:709b4b501f46e16139202e"
    }
    // Firebase Initialize
    firebase.initializeApp(config)

    // Auth Check
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // Check Logged
        this.$store.dispatch('loggedUser', user)
      }
      // Loading All Tasks
      this.$store.dispatch('loadTasks')
    })
  }
  
})
