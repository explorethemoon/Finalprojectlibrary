// import firebase from 'firebase/app'

// import Task from './task_help'
export default {
    state: {
        tags: [
            {
              title: 'WebDesign',
              use: false
            },
            {
              title: 'OOP',
              use: false
            },
            {
              title: 'Math',
              use: false
            }
          ] 
    },
    mutations: {
      newTag (state, payload) {
        state.tags.push(payload)
      }
    },
    actions: {
      newTag ({commit}, payload) {
        commit('newTag', payload)
      }
    },
    getters: {
      tags (state) {
        return state.tags
      }
    }
  }