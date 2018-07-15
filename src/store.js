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

        currentTopWindowId: 0,

        temporaryWindowId: 0, //for set re-link of windows's next focus

        taskbarDirection: 'bottom',

        taskList: {}
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
        getCurrentTopWindowId: function (state) {
            return state.currentTopWindowId;
        },
        getTemporaryWindowId: function (state) {
            return state.temporaryWindowId;
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
        setCurrentTopWindowId: function (state, payload) {
            //console.log('vuex set top',payload.appId);
            state.currentTopWindowId = payload.appId;
        },
        setTemporaryWindowId: function (state, payload) {
            state.temporaryWindowId = payload.beforeNext;
        },

        setTaskbarDirection: function (state, payload) {
            state.taskbarDirection = payload.direction;
        },
        addTask: function (state, payload) {
            Vue.set(state.taskList, payload.appId, payload);
        },
        deleteTask: function (state, payload) {
            Vue.delete(state.taskList, payload.appId);
            state.currentTopWindowId = payload.next;
        },
        setFocus: function (state, payload) {
            Vue.set(
                state.taskList[payload.appId],
                'focused',
                payload.focused
            );
        }

    }
});
