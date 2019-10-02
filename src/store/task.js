import firebase from 'firebase/app'

import Task from './task_help'


export default {
    state: {
      tasks: [
        {
          'id': 1,
          'title': 'Ruby Garage Web test Project',
          'description': 'Use the powerful debugger with a graphical UI for Ruby, JavaScript, and CoffeeScript. Set breakpoints, run your code step by step and make use of all the available information at your fingertips.Create and run RSpec, Cucumber, Shoulda, MiniTest & Test::Unit tests with coding assistance and a GUI-based test runner.',
          'whatOpen': 'Project',
          'completed': false,
          'editing': false
        },
        {
          'id': 2,
          'title': 'Main page',
          'description': 'How to write a simple web page with HTML (hypertext markup language). HTML is one of the core components of the World Wide Web, making up the structure of web pages. Once you created your web page, you can save it as an HTML document and view it in your web browser. Creating an HTML page is possible using basic text editors found on both Windows and Mac computers.',
          'whatOpen ': 'Task',
          'completed': true,
          'editing': false
        }
      ]
     
      
    },
    mutations: {
      loadTasks (state, payload) {
        state.tasks = payload
      },
      newTask (state, payload) {
        state.tasks.push(payload)
      },
      editTask (state, {id, title, description}) {
        const task = state.tasks.find(t => {
          return t.id === id
        })
        task.title = title
        task.description = description
      }
    },
    actions: {
      // newTask ({commit}, payload) {
      //   payload.id = Math.random()
      //   commit('newTask', payload)
      // Load all Tasks
    async loadTasks ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const task = await firebase.database().ref('tasks').once('value')
        // Get value
        const tasks = task.val()
        // New array
        const tasksArray = []
        // Get task key (id)
        Object.keys(tasks).forEach(key => {
          const t = tasks[key]
          tasksArray.push(
            new Task(
              t.title,
              t.description,
              t.whatOpen,
              t.time,
              t.tags,
              t.completed,
              t.editing,
              t.user,
              key
            )
          )
        })
        // Send mutation
        commit('loadTasks', tasksArray)

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    // Create new Task
    async newTask ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Use helped class
        const newTask = new Task(
          payload.title,
          payload.description,
          payload.whatOpen,
          payload.time,
          payload.tags,
          payload.completed,
          payload.editing,
          getters.user.id
        )
        const task = await firebase.database().ref('tasks').push(newTask)
        // Send mutation
        commit('newTask', {
          ...newTask,
          id: task.key
        })

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    // Edit Task (popup)
    async editTask ({commit}, {id, title, description}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Update title & descr
        await firebase.database().ref('tasks').child(id).update({
          title,
          description
        })
        // Send mutation
        commit('editTask', {id, title, description})

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    // Edit Task (button)
    async deleteTask ({commit}, id) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('tasks').child(id).remove()

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
      }
    },
    getters: {
      // tasks (state) {
      //   return state.tasks
      // },
      // taskCompleted (state) {

        // Get user All Tasks
    tasks (state, getters) {
        return state.tasks.filter(task => {
          return task.user === getters.user.id
        })
      },
      // Get user Completed Tasks
      taskCompleted (state, getters) {
        return getters.tasks.filter(task => {
          return task.completed
        })
      },
      // taskNotCompleted (state) {
      //   return state.tasks.filter(task => {
      // Get user Active Tasks
    taskNotCompleted (state, getters) {
      return getters.tasks.filter(task => {  
          return task.completed === false
        })
      }
    }
  }