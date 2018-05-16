import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        screenWidth: window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth,
        screenHeight: window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight,
        maxZIndexValue: 1
    },
    getters: {
        getMaxZIndex: function (state) {
            return state.maxZIndexValue;
        },
        getScreenWidth: function (state) {
            return state.screenWidth;
        },
        getScreenHeight: function (state) {
            return state.screenHeight;
        }
    },
    mutations: {
        screenRecalculation: function (state, payload) {
            state.screenWidth = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;
            state.screenHeight = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;
        },
        setMaxZIndex: function (state, payload) {
            return state.maxZIndexValue++;
        }
    }
});
