<template>
    <div id="wrap" :class="'task-'+direction">
        <div class="desktop">
            <notifybar></notifybar>

            <div id="new-window1" style="background-color:blue; width:100px; height:100px;" v-on:click="tryOpen(1)">APP 1</div>
            <div id="new-window2" style="background-color:blue; width:100px; height:100px;" v-on:click="tryOpen(2)">APP 2</div>
            <div id="new-window3" style="background-color:blue; width:100px; height:100px;" v-on:click="tryOpen(3)">APP 3</div>
            <div id="new-window4" style="background-color:blue; width:100px; height:100px;" v-on:click="tryOpen(4)">APP 4</div>

            <component v-for="openedWindow in getAllTaskList" :is="openedWindow.appData" :key="openedWindow.appId" :app-id="openedWindow.appId"></component>
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
        'taskbar': taskbar
    },
    mounted: function() {
        this.$nextTick(function() {
            window.addEventListener('resize', this.resizeWindow);
        });
    },
    methods: {
        resizeWindow: function() {
            this.$store.commit('screenRecalculation');
        },
        tryOpen: function(appId) {
            if( this.getTaskByAppId(appId) ) {
                let a = this.getTaskByAppId(appId);
                //포커스 세팅 시도
                //로딩중 일 시 무시
            } else {
                this.addTask(appId);
                //임시 작업 객체 생성
                //창 생성
                //완료 시 임시 작업 객체 실객체로 치환
            }
            //console.log(this.getAllTaskList);

        },
        getTaskByAppId: function(appId) {
            return this.getAllTaskList[appId];
        },
        addTask: function(appId) {
            let vc = windows;
            this.$store.commit('addTask', {appId: appId, appData: vc});
        }
   },
   computed: {
       direction: function() {
           return this.$store.getters.getTaskbarDirection;
       },
       getAllTaskList: function() {
           //console.log("dd"+this.$store.getters.getAllTaskList[1]);
           return this.$store.getters.getAllTaskList;
       }
   },
   beforeDestroy: function() {
        window.addEventListener('resize', this.resizeWindow);
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


@keyframes button_out {
    0% { background-color: rgba(127,127,127,0.3);}
    100% {background-color: rgba(0,0,0,0);}
}
@keyframes button_in {
    0% { background-color: rgba(127,127,127,0.3);}
    100% { background-color: rgba(127,127,127,0.3);}
}


[data-component="taskbar"] {
    z-index: 999999;
    flex:none;
    color:white;
    overflow: hidden;
    position: relative;
    display: flex;
}

.start-btn {
    flex:none;
    background-image: url('./assets/images/taskbar/start_op0.png');
    background-position: center center;
    background-repeat: no-repeat;
    animation: button_out .2s;
}
.start-btn:hover {
    animation: button_in 1s;
    background-image: url('./assets/images/taskbar/start_op0_hover.png');
}


.search-bar {
    background-color: rgb(63,63,63);
    height: 100%;
    width: 344px;
    padding: 0 9px;
    box-sizing:border-box;
    color: rgb(159,159,159);
    font-size: 15px;
    line-height: 40px;
    flex:none;
    letter-spacing: 0.01em;
}

.search-btn {
    flex:none;
    background-image: url('./assets/images/taskbar/search.png');
    background-position: center center;
    background-repeat: no-repeat;
    animation: button_out .2s;
}
.search-btn:hover {
    animation: button_in 1s;
}

.task-view {
    flex:none;
    animation: button_out .2s;
    background-image: url('./assets/images/taskbar/task_view.png');
    background-position: center center;
    background-repeat: no-repeat;
}
.task-view:hover {
    animation: button_in 1s;
    background-image: url('./assets/images/taskbar/task_view_hover.png');
    background-position: center center;
    background-repeat: no-repeat;
}


.task {
    flex:none;
    animation: button_out .2s;
}
.task:hover {
    animation: button_in 1s;
}


.task-bar-drag {
    height: 100%;
    width: 100%;
    flex:initial;
}

.notify-btn {
    flex:none;
    animation: button_out .2s;
    background-image: url('./assets/images/taskbar/notify.png');
    background-position: center center;
    background-repeat: no-repeat;
}

.notify-btn:hover {
    animation: button_in 1s;

}

.clock-area {
    flex:none;
    animation: button_out .2s;
}


.clock-area div {
    font-size:0.788em;
    color:#dddddd;
    text-align:center;
}


.clock-area:hover {
    animation: button_in 1s;
}

.show-desktop{
    flex:none;
    animation: button_out .2s;
}
 .show-desktop:hover {
    animation: button_in 1s;
}


.taskbar-color {
    width:100%;
    height:100%;
    position:absolute;
    top: 0;
    left: 0;
    z-index:-2;
    background-color:#000000;
    opacity: 0.84;
    /*이 부분을 다시 주석하고 아래 주석을 해제하면 작업 표시줄 블러링이 구현됨.
    다만 표시줄 아래로 투영되는 창은 블러링은 커녕 보이지도 않는다.
    배경화면 이미지 용량만큼 트래픽이 파바박 늘어나는건 덤*/
}

.taskbar-gaussian-bg {
    width:100vw;
    height:100vh;

    z-index:-1;
/*      background-image: url('./assets/images/desktop/bg_gaussian55.jpg');
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
    opacity: 0.17;*/
}

.task-bottom .taskbar {
    height: 40px;
    width: 100vw;
    flex-direction : row;
}

.task-bottom .start-btn{
    height: 100%;
    width: 48px;
}
.task-bottom .search-btn {
    width: 0;

}

.task-bottom .task{
    height: 100%;
    width: 48px;
    margin-right: 1px;
}
.task-bottom .task-view{
    height: 100%;
    width: 48px;
    margin-right: 2px;
}

.task-bottom .notify-btn{
    height: 100%;
    width: 40px;
}
.task-bottom .clock-area {
    height: 100%;
    width: 80px;
    padding-top:1px;
    box-sizing:border-box;
    line-height: 20px;
}

.task-bottom .clock-area div:nth-of-type(2) {
    display: none;
}

.task-bottom .show-desktop{
    height: 100%;
    width: 4px;
    border-left: 1px solid #8a8a8a;
    margin-left: 8px;
}





.task-top .taskbar {
    height: 40px;
    width: 100vw;
    top: 0;
    flex-direction : row;
}
.task-top .start-btn{
    height: 100%;
    width: 48px;
}
.task-top .search-btn {
    display: block;
    height: 100%;
    width: 48px;
}
.task-top .search-bar {
    display: none;
}

.task-top .task{
    height: 100%;
    width: 48px;
    margin-right: 1px;
}
.task-top .task-view{
    height: 100%;
    width: 48px;
    margin-right: 2px;
}

.task-top .notify-btn{
    height: 100%;
    width: 40px;
}
.task-top .clock-area {
    height: 100%;
    width: 80px;
    padding-top:1px;
    box-sizing:border-box;
    line-height: 20px;
}
.task-top .clock-area div:nth-of-type(2) {
    display: none;
}

.task-top .show-desktop{
    height: 100%;
    width: 4px;
    border-left: 1px solid #8a8a8a;
    margin-left: 8px;
}






.task-left .taskbar {
    height: 100vh;
    width: 66px;
    min-width: 62px;
    left: 0;
    flex-direction : column;
}
.task-left .start-btn{
    height: 40px;
    width: 100%;
}

.task-left .search-btn {
    display: block;
    height: 40px;
    width: 100%;
}
.task-left .search-bar {
    display: none;
}

.task-left .task{
    height: 46px;
    width: 100%;
}
.task-left .task-view{
    height: 40px;
    width: 100%;
}

.task-left .notify-btn{
    height: 32px;
    width: 100%;
    margin: 0 auto;
}
.task-left .clock-area{
    height: 51px;
    width: 100%;
    margin: 11px 0;
}
.task-left .show-desktop{
    height: 4px;
    width: 100%;
    border-top: 1px solid #8a8a8a;
    margin-top: 8px;
}




.task-right .taskbar {
    height: 100vh;
    width: 66px;
    min-width: 62px;
    right: 0;
    flex-direction : column;
}
.task-right .start-btn{
    height: 40px;
    width: 100%;
}
.task-right .search-btn {
    display: block;
    height: 40px;
    width: 100%;
}
.task-right .search-bar {
    display: none;
}
.task-right .task{
    height: 46px;
    width: 100%;
}
.task-right .task-view{
    height: 40px;
    width: 100%;
}

.task-right .notify-btn{
    height: 32px;
    width: 100%;
    margin: 0 auto;
}
.task-right .clock-area{
    height: 51px;
    width: 100%;
    margin: 11px 0;
}
.task-right .show-desktop{
    height: 4px;
    width: 100%;
    border-top: 1px solid #8a8a8a;
    margin-top: 8px;
}


    @keyframes window_open_opacity {
        0%{opacity: 0;}
        100%{opacity: 1;}
    }
    @keyframes window_open_vertical {
        0%{margin-top:-2%;}
        100%{margin-top: 0;}
    }
     @keyframes window_open_horizontal {
        0%{margin-left:-2%;}
        100%{margin-left: 0;}
    }
    [data-component="window-border"] {
        display: flex;
        flex-direction: column;
        position: fixed;
        box-sizing:border-box;
        width: 300px;
        height: 200px;
        top: 120px;
        left: 100px;
        animation: window_open_opacity 0.2s;
    }
    .maximize-window {
        width: 100% !important;
        height: 100% !important;
        position:absolute;
        left: 0 !important;
        top: 0 !important;
    }
    .maximize-window .window-border-top{
        height: 0;
    }
    .maximize-window .window-border-bottom{
        height: 0;
    }
    .maximize-window .border-w{
        width: 0;
    }
    .maximize-window .border-e {
        width: 0;
    }
    .maximize-window .window-frame{
        border: 0 !important;
    }


    .invisible .window-border-top {
        padding-top: 2%;
        transition: padding 0.2s;
    }
    .invisible .border-w{
        padding-left: 2%;
        transition: padding 0.2s;
    }
    .invisible .border-e {
        padding-right: 2%;
        transition: padding 0.2s;
    }
    .invisible .window-border-bottom {
        padding-bottom: 2%;
        transition: padding 0.2s;
    }
    .invisible .window-frame {
        opacity: 0;
        transition: opacity 0.2s;
    }


    .window-border-top {
        flex:none;
        width: auto;
        height: 8px;
        display: flex;
        flex-direction: row;
        animation: window_open_vertical 0.2s;
    }
        .border-nw {
            cursor: nw-resize !important;
            flex: none;
            width: 8px;
            height: 100%;
           /*background-color: red;*/
        }
        .border-n {
            cursor: n-resize !important;
            width: auto;
            height: 100%;
            flex: auto;
            /*background-color: yellow;*/
        }
        .border-ne {
            cursor: ne-resize !important;
            flex: none;
            width: 8px;
            height: 100%;
            /*background-color: red;*/
        }

    .window-border-middle {
        flex: 1 0 auto;
        width: auto;
        height: auto;
        display: flex;
        flex-direction: row;
    }
        .border-w {
            cursor: w-resize !important;
            flex: none;
            width: 8px;
            height: auto;
            animation: window_open_horizontal 0.2s;
            /*background-color: yellow;*/
        }

        .window-frame {
            border: 1px solid rgba(0,0,0,0.2);
            -webkit-background-clip: padding-box; /* for Safari */
            background-clip: padding-box; /* for IE9+, Firefox 4+, Opera, Chrome */
            width: auto;
            height: auto;
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            background-color: white;
            -webkit-box-shadow: 3px 3px 20px 2px rgba(0,0,0,0.3);
            -moz-box-shadow: 3px 3px 20px 2px rgba(0,0,0,0.3);
            box-shadow: 3px 3px 20px 2px rgba(0,0,0,0.3);
        }
        .focused-window .window-frame {
            border: 1px solid #181818;
        }
            .title-bar {
                width:auto;
                height:30px;
                display: flex;
                padding: 0px;
                box-sizing: border-box;
                flex:none;
                background-color: white;
            }

            .maximize-window .title-bar {
                height:23px;
            }

                .title-bar-icon {
                    width: 16px;
                    height: 28px;
                    flex: none;
                    margin: 0 0 0 8px;
                    background-repeat: no-repeat;
                    background-position: center center;
                }
                .maximize-window .title-bar-icon {
                    width: 16px;
                    height: 22px;
                    margin: 0;
                }

                .window-title {
                    flex-grow: 1;
                    flex-shrink: 1;
                    flex-basis: 0;
                    width: 1px;
                    padding-left: 4px;
                    min-width: 0px;
                    display: block;
                    height: auto;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 0.74em;
                    line-height: 27px;
                }

                .maximize-window .window-title {
                    line-height: 23px;
                }

                @keyframes maximize_out {
                    0% {background-color: #e5e5e5;}
                    100% { background-color: inherit; }
                }
                @keyframes maximize_in {
                    0% {background-color: inherit;}
                    100% {background-color: #e5e5e5;}
                }


                .maximize-button {
                    width: 45px;
                    height: 29px;
                    margin-right: 1px;
                    flex: none;
                    background-image: url('./assets/images/window/mx.png');
                    background-repeat: no-repeat;
                    background-position: center center;
                }

                .maximize-window .maximize-button {
                    height: 21px;
                    background-image: url('./assets/images/window/mn.png');
                }


                .maximize-button-out{
                    animation: maximize_out .2s;
                }
                .maximize-button:hover {
                    /*background-image: url('./assets/images/window/mx.png');     */
                    animation : maximize_in .2s;
                    -webkit-animation-fill-mode: forwards;
                    animation-fill-mode: forwards;
                }

                @keyframes close_out {
                    0% {background-color: #E81123;}
                    100% {background-color: inherit;}
                }
                @keyframes close_in {
                    0% {background-color: inherit;}
                    100% {background-color: #E81123;}
                }


                .close-button {
                    width: 45px;
                    height: 29px;
                    flex: none;
                    background-image: url('./assets/images/window/xblack2.png');
                    background-repeat: no-repeat;
                    background-position: center center;
                }

                .maximize-window .close-button {
                    height: 21px;
                    margin-right: 2px;
                }

                .close-button-out{
                    animation: close_out .2s;
                }

                .close-button:hover {
                    background-image: url('./assets/images/window/xwhite.png');
                    animation : close_in .2s;
                    -webkit-animation-fill-mode: forwards;
                    animation-fill-mode: forwards;
                }

            .univ .title-bar {
                width:auto;
                height:31px;
                display: flex;
                padding: 0px;
                box-sizing: border-box;
                flex:none;
                background-color: white;
            }
            .maximize-window.univ .title-bar {
                height:32px;
            }

            .univ .window-title {
                padding-left: 12px;
            }
                .maximize-window.univ .window-title {
                    line-height: 23px;
                }
                .univ .maximize-button {
                    width: 46px;
                    height: 31px;
                    flex: none;
                    background-image: url('./assets/images/window/mx.png');
                    background-repeat: no-repeat;
                    background-position: center center;
                }
                .maximize-window.univ .maximize-button {
                    height: 32px;
                    background-image: url('./assets/images/window/mn.png');
                }
                .univ .maximize-button-out{
                    animation: maximize_out 0s;
                }
                .univ .maximize-button:hover {
                    /*background-image: url('./assets/images/window/mx.png');     */
                    animation : maximize_in 0s;
                    -webkit-animation-fill-mode: forwards;
                    animation-fill-mode: forwards;
                }
                .univ .close-button {
                    width: 46px;
                    height: 31px;
                    flex: none;
                    background-image: url('./assets/images/window/xblack2.png');
                    background-repeat: no-repeat;
                    background-position: center center;
                }
                .close-button-out{
                    animation: close_out 0s;
                }
                .close-button:hover {
                    background-image: url('./assets/images/window/xwhite.png');
                    animation : close_in 0s;
                    -webkit-animation-fill-mode: forwards;
                    animation-fill-mode: forwards;
                }
                .maximize-window.univ .close-button {
                    height: 32px;
                    margin-right: 0;
                }

            .main-panel {
                position: relative;
                overflow: hidden;
                width: auto;
                height: auto;

                box-sizing:border-box;
                /*border-top :1px solid #dadbdc;*/
                flex: auto;

            }

            .window-overlay{
                width: 100%;
                height: 100%;
                position: absolute;
                background-color: red;
                display: none;
            }

        .border-e {
            cursor: e-resize !important;
            flex: none;
            width: 8px;
            height: auto;
            animation: window_open_horizontal 0.2s;
            /*background-color: yellow;*/
        }
       .iframe-inner {background-color: blue; border: 0; padding:0; margin: 0; height:100%; width:100%; display:block; position: absolute;}

    .window-border-bottom {
        flex:none;
        width: auto;
        height: 8px;
        display: flex;
        flex-direction: row;
        animation: window_open_vertical 0.2s;
    }
        .border-sw {
            cursor: sw-resize !important;
            flex: none;
            width: 8px;
            height: 100%;
            /*background-color: red;*/
        }
        .border-s {
            cursor: s-resize !important;
            width: auto;
            height: 100%;
            flex: auto;
            /*background-color: yellow;*/
        }
        .border-se {
            cursor: se-resize !important;
            flex: none;
            width: 8px;
            height: 100%;
            /*background-color: red;*/
        }


#wrap {
    width: inherit;
    height: inherit;
    display: flex;
}
.task-bottom {
    flex-direction: column;
}
.task-top {
    flex-direction: column-reverse;
}
.task-left {
    flex-direction: row-reverse;
}
.task-right {
    flex-direction: row;

}
.desktop {
    position: relative;
    display: flex;
    flex:1;
    width:inherit;
    height:inherit;
    flex-direction: column;
}
.notifybar {

    position:absolute;
    right:-360px;
    z-index: 1000001;
    width:360px;
    height:100%;
    background-color:#000000;
    opacity: 0.95;
    transition: right .6s;
    transition-timing-function: cubic-bezier(.2,1.02,.31,.96);
}

.task-right .notifybar {
    position:fixed;
}
.notifybar-visible {
    position:absolute !important; /* !important 정말 쓰기 싫었는데 어쩔수가 없었다.. 젠장..*/
    right: 0 !important;
}
.notifybar-visible~.notify-cover {
    z-index: 1000000;
    position:fixed;
    left:0;
    top:0;
    width:100vw;
    height:100vh;
}

.notify-app{
    color:white;
    height: 56px;
    line-height:56px;
    font-size: 0.96em;
    text-indent: 11px;
}
.notify-app:hover{
    background-color: rgba(255,255,255,0.1);
}
.notify-app-title{
    float:left;
    height:56px;
    width:332px;
    overflow:hidden;
    word-break:break-all;
}
.notify-app:hover .close-notify{
    display: block;
    float:left;
    width: 16px;
    height: 12px;
    margin:22px 0;
    background-image: url('./assets/images/window/xwhite.png');
    background-repeat: no-repeat;
    background-position: center;
}
.notify-line{
    height:13px;
    background-image:url('./assets/images/taskbar/line.png');
    background-position: center;
    background-repeat: no-repeat;
}
</style>