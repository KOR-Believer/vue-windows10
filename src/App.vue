<template>
    <div class="wrapper" :class="'task-'+direction">
        <div class="desktop">
            <notifybar></notifybar>
            <icongrid :icon-list="mockicons"></icongrid>
            <windows
                v-for="(app) in getAppList"
                :key="app.processId"
                :argv="app.argv"
                :process-id="app.processId"
                :z-index="app.zIndex"
                :focused="app.focused"
                :minimized="app.minimized"
                :width="app.width"
                :height="app.height"
                :title="app.title"
                :iconImage="app.iconImage"
            ></windows>
        </div>
        <taskbar></taskbar>
    </div>
</template>

<script>
import notifybar  from './components/notifybar.vue'
import taskbar    from './components/taskbar.vue'
import windows    from './components/windows.vue'
import icongrid   from './components/icongrid.vue'
import screenfull from 'screenfull'
export default {
    components: {
        'notifybar': notifybar,
        'taskbar': taskbar,
        'windows': windows,
        'icongrid': icongrid
    },
    data: function() {
        return {
            mockicons : [
                {
                    title: "SOCC - Study\n Oriented Coding Club",
                    iconImage: "./images/icongrid/socc_character_256.png",
                    width:'980px',
                    height:'630px',
                    argv: {
                        appId: 1,
                        mode: 'iframe',
                        src: 'https://socc-io.github.io/home'
                    }
                },
                {
                    title: "네이버",
                    iconImage: "./images/icongrid/naver.png",
                    width:'400px',
                    height:'700px',
                    argv: {
                        appId: 1,
                        mode: 'iframe',
                        src: 'https://believer-cors-proxy.herokuapp.com/?https://m.naver.com'
                    }
                },
                {
                    title: "OpenTutorials",
                    iconImage: "./images/icongrid/opentutorials.png",
                    width:'1098px',
                    height:'680px',
                    argv: {
                        appId: 1,
                        mode: 'iframe',
                        src: 'https://opentutorials.org/'
                    }
                },
                {
                    title: "명령\n프롬프트",
                    iconImage: "./images/icongrid/console.png",
                    width:'600px',
                    height:'400px',
                    argv: {
                        appId: 1,
                        mode: 'iframe',
                        src: 'https://rocky-basin-3981.herokuapp.com/app/cmd'
                    }
                }


            ]
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            window.addEventListener('resize', this.resizeWindow);
            if (screenfull.isEnabled) {
                screenfull.request();
            }
        });
    },
    beforeDestroy: function() {
        window.removeEventListener('resize', this.resizeWindow);
    },
    methods: {
        resizeWindow: function() {
            this.$store.commit('screenRecalculation');
        }
   },
   computed: {
        direction: function() {
            return this.$store.getters.getTaskbarDirection;
        },
        getAllTaskList: function() {
            return this.$store.getters.getAllTaskList;
        },

        getAppList: function(){
            return this.$store.getters.getAppList
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
.wrapper {
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