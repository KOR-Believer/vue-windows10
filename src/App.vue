<template>
    <div id="wrap" :class="'task-'+direction">
        <div class="desktop">
            <notifybar></notifybar>
            <icongrid :icon-list="mockicons"></icongrid>
            <windows
                v-for="(openedWindow, index) in getAllTaskList"
                :key="index"
                :app-id="openedWindow.appId"
                ref="windowComp"
            ></windows>
        </div>
        <taskbar></taskbar>
    </div>
</template>

<script>
import notifybar from './components/notifybar.vue'
import taskbar   from './components/taskbar.vue'
import windows   from './components/windows.vue'
import icongrid  from './components/icongrid.vue'


export default {
    components: {
        'notifybar': notifybar,
        'taskbar': taskbar,
        'windows': windows,
        'icongrid':icongrid
    },
    data: function() {
        return {
            mockicons : [
                {
                    appId : 1,
                    title: "title is title",
                    iconImage: "/",
                    iconSelected: false,
                    iconFocused: false
                },
                {
                    appId : 2,
                    title: "title2 is title2",
                    iconImage: "/",
                    iconSelected: false,
                    iconFocused: false
                }
            ]
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            window.addEventListener('resize', this.resizeWindow);
            //this.tryOpen(1);
        });
    },
    beforeDestroy: function() {
        window.removeEventListener('resize', this.resizeWindow);
    },
    methods: {
        resizeWindow: function() {
            this.$store.commit('screenRecalculation');
        },
        tryOpen: function(appId) {
            if( this.getTaskByAppId(appId) ) {
                this.$refs.windowComp.forEach(element => {
                    if (element.id == appId) {
                        element.setFocus();
                        return;
                    }
                });
            } else {
                this.addTask(appId);
            }
        },
        getTaskByAppId: function(appId) {
            return this.getAllTaskList[appId];
        },
        addTask: function(appId) {
            this.$store.commit('addTask', {
                appId: appId,
                index: this.getZIndex,
                focused: true
            });
        }
   },
   computed: {
        direction: function() {
            return this.$store.getters.getTaskbarDirection;
        },
        getAllTaskList: function() {
            return this.$store.getters.getAllTaskList;
        },
        getZIndex() {
            return this.$store.getters.getMaxZIndex;
        }
   }
}
</script>
<style>
* {
    margin: 0;
    padding: 0;
    border: 0;
    min-height: 0;
    min-width: 0;
    font-family: 'Segoe UI', 'malgun gothic';
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
*:focus {
    outline: none
}
body {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #FFF;
    background-image: url('./assets/images/desktop/bg.jpg');
    background-size: cover;
    background-position: center;
}
.selection {
    background: rgba(0, 102, 204, 0.2745);
    border: 1px solid rgb(0, 120, 215);
    z-index: 4;
}
.overlay{
    filter: blur(25px);
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 1100;
    top: 0px;
    left: 0px;
    bottom: 0px;
}
</style>

<style scoped>
#wrap {
    width: inherit;
    height: inherit;
    display: flex;
}
.desktop {
    position: relative;
    display: flex;
    flex:1 0 0;
    /* margin-top:5px; */
    width:inherit;
    height:inherit;
    flex-direction: column;
}
</style>