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

        maxZIndexValue: 0,

        taskbarDirection: 'bottom',

        taskList: { }
    },
    getters: {
        getScreenWidth: function (state) {
            return state.screenWidth;
        },
        getScreenHeight: function (state) {
            return state.screenHeight;
        },
        getMaxZIndex: function (state) {
            return state.maxZIndexValue;
        },
        getTaskbarDirection: function (state) {
            return state.taskbarDirection;
        },
        getAllTaskList: function (state) {
            return state.taskList;
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
            state.maxZIndexValue++;
        },
        setTaskbarDirection: function (state, payload) {
            state.taskbarDirection = payload.direction;
        },
        addTask: function (state, payload) {
            Vue.set(state.taskList, payload.appId, payload);
        },
        deleteTask: function (state, payload) {
            Vue.delete(state.taskList, payload.appId);
        }
    }
});
