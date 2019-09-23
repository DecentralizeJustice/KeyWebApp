import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage
})

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    incrementCounter (state, payload) {
      state.count += payload
    }
  },
  actions: {
    inrementAction ({ commit }, payload) {
      commit('incrementCounter', payload)
    }
  },
  plugins: [vuexLocalStorage.plugin]
})
