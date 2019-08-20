import Vue from 'vue'
import Vuex from 'vuex'
import util from './util/util'

Vue.use(Vuex)
export const store = new Vuex.Store({
    state: {
        screenWidth: window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth,

        screenHeight: window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight,

        maxZIndexValue: 25,
        processCount: 0,
        taskbarDirection: 'bottom',
        appList: [
            // {
            //     'processId': processId,
            //     'processHash': processHash,
            //     'focused': false,
            //     'minimized': false,
            //     'zIndex': zValue,
            //     'argv': appInfo.argv,
            //     'width': appInfo.width,
            //     'height': appInfo.height,
            //     'iconImage': appInfo.iconImage
            // }
        ]
    },
    getters: {
        getScreenWidth: function (state) {
            return state.screenWidth
        },
        getScreenHeight: function (state) {
            return state.screenHeight
        },
        getZIndex: function (state) {
            return state.maxZIndexValue
        },
        getProcessCount: function (state) {
            return state.processCount
        },
        getTaskbarDirection: function (state) {
            return state.taskbarDirection
        },
        getAllTaskList: function (state) {
            return state.taskList
        },

        getAppList: function (state) {
            return state.appList
        }
    },
    mutations: {
        screenRecalculation: function (state) {
            state.screenWidth = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth

            state.screenHeight = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight
        },
        incrementZIndex: function (state) {
            state.maxZIndexValue++
        },
        incrementProcessCount: function (state) {
            state.processCount++
        },
        setTaskbarDirection: function (state, payload) {
            state.taskbarDirection = payload.direction
        },
        setFocus: function (state, process) {

            Vue.set(
                state,
                'appList',
                state.appList.map(
                    app => {
                        if (app.processId === process.processId) {
                            if (process.focused) {
                                store.commit('incrementZIndex')
                                let zValue = this.getters.getZIndex
                                return ({ ...app, focused: true, zIndex: zValue })
                            } else {
                                return ({ ...app, focused: false })
                            }
                        } else {
                            if (process.focused) {
                                return ({ ...app, focused: !process.focused})
                            } else {
                                return ({ ...app})
                            }
                        }
                    }
                )
            )
        },
        addApp: function (state, appInfo) {
            let processHash = util.hashCode(JSON.stringify(appInfo.argv))
            store.commit('incrementProcessCount')
            let processId = this.getters.getProcessCount
            store.commit('incrementZIndex')
            let zValue = this.getters.getZIndex
            let process = {
                'processId': processId,
                'processHash': processHash,
                'focused': false,
                'minimized': false,
                'zIndex': zValue,
                'argv': appInfo.argv,
                'width': appInfo.width,
                'height': appInfo.height,
                'iconImage': appInfo.iconImage,
                'title':appInfo.title
            }
            state.appList.push(process)
            this.commit('setFocus', { processId: processId, focused: true})

        },
        deleteApp: function (state, processId) {
            let index = state.appList.findIndex(app => app.processId === processId)
            Vue.delete(state.appList, index)

            //active window list
            let currentActive = state.appList.filter(
                app => !app.minimized
            )

            //maxZindex
            let nextFocusZIndex = Math.max.apply(Math, currentActive.map(
                process => process.zIndex
            ))

            //maxZindex's index
            index = currentActive.findIndex(app => app.zIndex === nextFocusZIndex)

            //to get maxZIndex's processId
            if (index != -1) {
                let focusTargetId = currentActive[index].processId || 0
                let nextFocusStatus = state.appList.map(
                    app => {
                        if (app.processId === focusTargetId) {
                            store.commit('incrementZIndex')
                            let zValue = this.getters.getZIndex
                            return ({ ...app, focused: true, zIndex: zValue })
                        } else {
                            return ({ ...app, focused: false })
                        }
                    }
                )
                Vue.set(state,'appList',nextFocusStatus)
            }
        },
        minimize: function (state, processId) {
            //minimize
            let toMminimize = state.appList.map(
                app => {
                    if (app.processId === processId) {
                        return ({ ...app, minimized: true, focused: false })
                    } else {
                        return ({ ...app })
                    }
                }
            )
            //active window list
            let currentActive = toMminimize.filter(
                app => !app.minimized
            )

            //maxZindex
            let nextFocusZIndex = Math.max.apply(Math, currentActive.map(
                process => process.zIndex
            ))

            //maxZindex's index
            let index = currentActive.findIndex(app => app.zIndex === nextFocusZIndex)
            //to get maxZIndex's processId
            if (index != -1) {
                let focusTargetId = currentActive[index].processId || 0
                toMminimize = toMminimize.map(
                    app => {
                        if (app.processId === focusTargetId) {
                            store.commit('incrementZIndex')
                            let zValue = this.getters.getZIndex
                            return ({ ...app, focused: true, zIndex: zValue })
                        } else {
                            return ({ ...app, focused: false })
                        }
                    }
                )
            }

            //set next focus to maxZIndex's window
            Vue.set(
                state,
                'appList',
                toMminimize
            )
        },
        unMinimize: function (state, processId) {
            Vue.set(
                state,
                'appList',
                state.appList.map(
                    app => {
                        if (app.processId === processId) {
                            store.commit('incrementZIndex')
                            let zValue = this.getters.getZIndex
                            return ({ ...app,minimized:false, focused: true, zIndex: zValue })
                        } else {
                            return ({ ...app, focused: false })
                        }
                    }
                )
            )
        }
    }
})
