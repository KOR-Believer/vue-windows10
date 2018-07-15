<template>
    <div id="wrap" :class="'task-'+direction">
        <div class="desktop">
            <notifybar></notifybar>
            <div id="new-window1" style="background-color:blue; width:100px; height:100px;" @click="tryOpen(1)">APP 1</div>
            <div id="new-window2" style="background-color:blue; width:100px; height:100px;" @click="tryOpen(2)">APP 2</div>
            <div id="new-window3" style="background-color:blue; width:100px; height:100px;" @click="tryOpen(3)">APP 3</div>
            <div id="new-window4" style="background-color:blue; width:100px; height:100px;" @click="tryOpen(4)">APP 4</div>

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

export default {
    components: {
        'notifybar': notifybar,
        'taskbar': taskbar,
        'windows': windows
    },
    data: function() {
        return {
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            window.addEventListener('resize', this.resizeWindow);
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
    font-family: 'Segoe UI', 'malgun gothic';
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
body {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-image: url('./assets/images/desktop/bg_normal.jpg');
    background-size: cover;
    background-position: center;
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
    flex:1;
    width:inherit;
    height:inherit;
    flex-direction: column;
}
</style>