<template>
<div
    class="window-body"
    :class="{
        'focused-window': focused,
        'maximize-window': isMaximized,
        'invisible': invisible
    }"
    @mousedown="inside"
    v-mousedown-outside="outside"
    :style="windowStyle"
>
    <div class="window-border-top">
        <div
            class="border-nw"
            @mousedown="dragStart('nw-resize', $event)"
            @touchstart="dragStart('nw-resize', $event)"
        ></div>
        <div
            class="border-n"
            @mousedown="dragStart('n-resize',  $event)"
            @touchstart="dragStart('n-resize',  $event)"
        ></div>
        <div
            class="border-ne"
            @mousedown="dragStart('ne-resize', $event)"
            @touchstart="dragStart('ne-resize', $event)"
        ></div>
    </div>
    <div class="window-border-middle">
        <div
            class="border-w"
            @mousedown="dragStart('w-resize',  $event)"
            @touchstart="dragStart('w-resize',  $event)"
        ></div>
        <div class="window-frame">
            <div class="title-bar">
                <div
                    class="title-bar-icon"
                    :style="{backgroundImage: 'url('+iconImages(this.iconImage)+')'}"
                ></div>
                <div
                    class="window-title"
                    @mousedown="dragStart('title-bar', $event)"
                    @touchstart="dragStart('title-bar', $event)"
                    @dblclick="toggleMaximizeWindow"
                >
                    {{title}}
                </div>
                <div
                    class="minimize-button"
                    :class="minimizeButtonOut"
                    @mouseover.once="minimizeButtonOut='minimize-button-out'"
                    @click="toggleMinimizeWindow"
                ></div>
                <div
                    class="maximize-button"
                    :class="maximizeButtonOut"
                    @mouseover.once="maximizeButtonOut='maximize-button-out'"
                    @click="toggleMaximizeWindow"
                ></div>
                <div
                    class="close-button"
                    :class="closeButtonOut"
                    @mouseover.once="closeButtonOut='close-button-out'"
                    @click="close"
                ></div>
            </div>
            <div class="main-panel">
                <template v-if="mode=='iframe'">
                    <spinning-loader v-show="!loaded"></spinning-loader>
                    <iframe v-show="loaded" :src="extra.src" class="iframe-inner" @load="loaded=true"></iframe>
                    <div class="iframe-cover" v-show="!focused"></div>
                </template>
                <template  v-else>
                <div class="iframe-inner">

                </div>
                </template>
                <div class="window-overlay" :style="{display: overlayDisplay, cursor: overlayCursor}"></div>
            </div>
        </div>
        <div class="border-e" @mousedown="dragStart('e-resize', $event)" @touchstart="dragStart('e-resize', $event)" ></div>
    </div>
    <div class="window-border-bottom">
        <div class="border-sw" @mousedown="dragStart('sw-resize', $event)" @touchstart="dragStart('sw-resize', $event)"></div>
        <div class="border-s"  @mousedown="dragStart('s-resize',  $event)" @touchstart="dragStart('s-resize',  $event)"></div>
        <div class="border-se" @mousedown="dragStart('se-resize', $event)" @touchstart="dragStart('se-resize', $event)"></div>
    </div>
</div>
</template>

<script>
import Velocity from 'velocity-animate'
import spinningLoader  from './spinningLoader.vue'
export default {
    props: [
        'processId',
        'argv',
        'minimized',
        'focused',
        'zIndex',
        'width',
        'height',
        'iconImage',
        'title'
    ],
     components: {
        'spinningLoader': spinningLoader,
    },
    data () {
        return {
            id: this.processId,
            minWidth : 190,
            minHeight: 46,
            loaded: false,
            isDrag: false,
            chromeIgnore: false,
            windowsAction: 'none',
            overlayDisplay: 'none',
            overlayCursor: '',
            invisible: false,
            isMaximized: false,
            windowStyle: {
                width:  '400px',
                height: '300px',
                top: 0,
                left:0,
                zIndex: this.zIndex,
                transform: 'inherit'
            },
            temporaryStyle: {
                refMouseX: 0,
                refMouseY: 0,
                refWidth : 0,
                refHeight: 0,
                refLeft  : 0,
                refTop   : 0
            },
            minimizeButtonOut:'',
            maximizeButtonOut:'',
            closeButtonOut:'',
            mode:'',
            extra: {
            }
        }
    },
    created: function() {
        if (this.argv.mode == 'iframe') {
            this.mode = 'iframe'
            this.$set(this.extra,"src",this.argv.src)
        }
        this.windowStyle.height = this.height
        this.windowStyle.width = this.width
    },
    mounted: function() {
        this.windowStyle.top  = ((this.getScreenHeight-parseInt(this.windowStyle.height,10))/2)+'px'
        this.windowStyle.left = ((this.getScreenWidth-parseInt(this.windowStyle.width,10))/2)+'px'
        if(this.minimized) this.minimizeWindow()

    },
    beforeDestroy: function() {
        window.removeEventListener('mouseup', this.dragEnd)
        window.removeEventListener('mousemove', this.drag)
        window.removeEventListener('touchend',this.dragEnd)
        window.removeEventListener('touchmove',this.drag)
    },
    methods: {
        inside: function() {
            if (!this.focused) {
                this.setFocus(true)
            }
        },
        outside: function () {
            if (this.focused) {
                this.setFocus(false)
            }
        },
        setFocus: function(focus){
            this.$store.commit('setFocus', {processId:this.processId, focused: focus})
        },
        toggleMinimizeWindow: function(){
            if ( this.minimized ) {
                this.$store.commit('unMinimize', this.processId)
            } else {
                this.$store.commit('minimize', this.processId)
            }
        },
        toggleMaximizeWindow: function(){
            this.isMaximized = !this.isMaximized
        },
        dragStart: function(action, e) {
            let clientX = (e.clientX) ? e.clientX : e.touches[0].clientX
            let clientY = (e.clientY) ? e.clientY : e.touches[0].clientY
            this.temporaryStyle.refMouseX = clientX
            this.temporaryStyle.refMouseY = clientY
            this.windowsAction            = action
            this.temporaryStyle.refWidth  = parseInt(this.windowStyle.width,  10)
            this.temporaryStyle.refHeight = parseInt(this.windowStyle.height, 10)
            this.temporaryStyle.refLeft   = parseInt(this.windowStyle.left,   10)
            this.temporaryStyle.refTop    = parseInt(this.windowStyle.top,    10)
            this.isDrag = true
            this.chromeIgnore = true
            window.addEventListener('mouseup', this.dragEnd)
            window.addEventListener('mousemove', this.drag)
            window.addEventListener('touchend',this.dragEnd)
            window.addEventListener('touchmove',this.drag)
        },
        drag : function(e) {

            //bug fix: chrome trigger mousemove event on mousedown
            if (this.chromeIgnore) {
                this.chromeIgnore = false
                return
            }
            if (this.isDrag) {
                if (this.overlayDisplay == 'none') {
                    this.overlayDisplay = 'block'
                }
                let clientX = (e.clientX) ? e.clientX : e.touches[0].clientX
                let clientY = (e.clientY) ? e.clientY : e.touches[0].clientY

                let offsetX = clientX - this.temporaryStyle.refMouseX
                let offsetY = clientY - this.temporaryStyle.refMouseY
                let nWidth, nHeight
                if (clientX || clientY) {
                    switch (this.windowsAction) {
                        case "title-bar":
                            if (this.isMaximized) {
                                this.windowStyle.top       = '-16px'
                                this.temporaryStyle.refTop = -16
                                this.isMaximized = false
                                let windowWidth  = parseInt(this.windowStyle.width)
                                let leftClip     = this.temporaryStyle.refMouseX - (windowWidth / 2)
                                let rightClip    = this.temporaryStyle.refMouseX + (windowWidth / 2)
                                if (leftClip < -8) {
                                    leftClip = -8
                                }

                                if (rightClip > this.getScreenWidth) {
                                    leftClip = this.getScreenWidth - windowWidth + 8
                                }
                                this.temporaryStyle.refLeft = leftClip
                                this.windowStyle.left = leftClip+'px'
                                break
                            }
                            this.windowStyle.left = this.temporaryStyle.refLeft + offsetX + 'px'
                            this.windowStyle.top  = this.temporaryStyle.refTop  + offsetY + 'px'
                            break

                        case "se-resize":
                            nWidth  = this.temporaryStyle.refWidth  + offsetX
                            nHeight = this.temporaryStyle.refHeight + offsetY
                            if (nWidth > this.minWidth)
                                this.windowStyle.width  = nWidth  + 'px'
                            if (nHeight > this.minHeight)
                                this.windowStyle.height = nHeight + 'px'
                            break

                        case "e-resize":
                            nWidth = this.temporaryStyle.refWidth + offsetX
                            if (nWidth > this.minWidth)
                                this.windowStyle.width = nWidth + 'px'
                            break

                        case "s-resize":
                            nHeight = this.temporaryStyle.refHeight + offsetY
                            if (nHeight > this.minHeight)
                                this.windowStyle.height = nHeight + 'px'
                            break

                        case "w-resize":
                            nWidth = this.temporaryStyle.refWidth - offsetX
                            if (nWidth > this.minWidth) {
                                this.windowStyle.left  = this.temporaryStyle.refLeft + offsetX + 'px'
                                this.windowStyle.width = nWidth + 'px'
                            }
                            break

                        case "n-resize":
                            nHeight = this.temporaryStyle.refHeight - offsetY
                            if (nHeight > this.minHeight) {
                                this.windowStyle.top    = this.temporaryStyle.refTop + offsetY + 'px'
                                this.windowStyle.height = nHeight +'px'
                            }
                            break

                        case "nw-resize":
                            nHeight = this.temporaryStyle.refHeight - offsetY
                            nWidth  = this.temporaryStyle.refWidth  - offsetX
                            if (nHeight > this.minHeight) {
                                this.windowStyle.top    = this.temporaryStyle.refTop + offsetY + 'px'
                                this.windowStyle.height = nHeight +'px'
                            }
                            if (nWidth > this.minWidth) {
                                this.windowStyle.left  = this.temporaryStyle.refLeft + offsetX + 'px'
                                this.windowStyle.width = nWidth + 'px'
                            }
                            break

                        case "ne-resize":
                            nHeight = this.temporaryStyle.refHeight - offsetY
                            nWidth  = this.temporaryStyle.refWidth  + offsetX
                            if (nHeight > this.minHeight) {
                                this.windowStyle.top    = this.temporaryStyle.refTop + offsetY + 'px'
                                this.windowStyle.height = nHeight + 'px'
                            }
                            if (nWidth > this.minWidth)
                                this.windowStyle.width = nWidth + 'px'
                            break

                        case "sw-resize":
                            nHeight = this.temporaryStyle.refHeight + offsetY
                            nWidth  = this.temporaryStyle.refWidth  - offsetX
                            if(nHeight > this.minHeight)
                                this.windowStyle.height = nHeight +'px'
                            if (nWidth > this.minWidth) {
                                this.windowStyle.left  = this.temporaryStyle.refLeft + offsetX + 'px'
                                this.windowStyle.width = nWidth + 'px'
                            }
                            break
                        // default:
                    }
                    if (this.windowsAction != 'title-bar') {
                        this.overlayCursor = this.windowsAction
                    }
                }
            }
        },
        dragEnd: function() {
            this.isDrag         = false
            this.overlayDisplay = 'none'
            this.overlayCursor  = 'default'
            if(parseInt(this.windowStyle.top) < -8){
                this.windowStyle.top = "-8px"
            }
            window.removeEventListener('mouseup', this.dragEnd)
            window.removeEventListener('mousemove', this.drag)
            window.removeEventListener('touchend',this.dragEnd)
            window.removeEventListener('touchmove',this.drag)
        },
        close: function() {
            this.invisible = true
            setTimeout(() => {
                this.$store.commit('deleteApp', this.processId)
            }, 150)
        },
        // animation
        minimizeWindow: function() {
            let icon = this.getTaskBarIconPosition()
            let windowX = 0
            let windowY = 0
            if (this.isMaximized) {
                let desktopArea = this.getFullScreenPosition()
                windowX = desktopArea.x
                windowY = desktopArea.y
            } else {
                windowX = parseInt(this.windowStyle.left,10) + (parseInt(this.windowStyle.width,10) / 2)
                windowY = parseInt(this.windowStyle.top,10) + (parseInt(this.windowStyle.height,10) / 2)
            }
            let posX = icon.x - windowX
            let posY = icon.y - windowY
            this.windowStyle.zIndex = 2147483647
            if( this.$el ) {
                let el = this.$el
                Velocity(el, 'stop')
                Velocity(
                    el,
                    {
                        translateX: posX+'px',
                        translateY: posY+'px',
                        opacity: -0.4,
                        scale: 0.0
                    },
                    {
                        duration: 200,
                        easing: [0.420, 0.000, 1.000, 1.000], //'ease-out',
                        complete: function () {

                        }
                    }
                )
            }

        },
        // animation
        unMinimizeWindow: function() {
            let icon = this.getTaskBarIconPosition()
            let windowX = 0
            let windowY = 0
            if (this.isMaximized) {
                let desktopArea = this.getFullScreenPosition()
                windowX = desktopArea.x
                windowY = desktopArea.y
            } else {
                windowX = parseInt(this.windowStyle.left,10) + (parseInt(this.windowStyle.width,10) / 2)
                windowY = parseInt(this.windowStyle.top,10) + (parseInt(this.windowStyle.height,10) / 2)
            }
            let posX = icon.x - windowX
            let posY = icon.y - windowY

            if( this.$el ) {
                let el = this.$el
                Velocity(el, 'stop')
                this.windowStyle.transform = "none"
                Velocity(
                    el,
                    {
                        translateX: posX+'px',
                        translateY: posY+'px',
                        opacity: -0.4,
                        scale:0.0
                    },
                    {
                        duration: 0,
                        easing: 'ease',
                        complete: () => {
                            Velocity(
                                el,
                                {
                                    translateX: '0px',
                                    translateY: '0px',
                                    opacity: 1,
                                    scale:1
                                },
                                {
                                    duration: 200,
                                    easing: [0.420, 0.000, 1.000, 1.000], //'ease-in',
                                    complete: () => {
                                        this.windowStyle.transform = "inherit"
                                    }
                                }
                            )
                        }
                    }
                )
            }
        },

        getTaskBarIconPosition: function(){
            let tasks = document.getElementsByClassName('task')
            let i = 0
            let ob = {}
            for (i = 0; i < tasks.length; i++) {
                let k = tasks[i].getAttribute("task-process-id")
                let v = tasks[i].getBoundingClientRect()
                ob[k] = {
                    x: v.left + (v.width/2),
                    y: v.top + (v.height/2)
                }
            }
            return ob[this.processId]
        },

        getFullScreenPosition: function() {
            let d = document.getElementsByClassName('desktop')[0]
            d = d.getBoundingClientRect()
            return {
                x: d.left + (d.width / 2),
                y: d.top + (d.height / 2)
            }
        },
        iconImages: require.context('../assets/', true, /\.png$/)
    },
    computed: {
        getScreenWidth() {
            return this.$store.getters.getScreenWidth
        },
        getScreenHeight() {
            return this.$store.getters.getScreenHeight
        }
    },
    watch: {
        zIndex: function () {
            this.windowStyle.zIndex = this.zIndex
        },
        minimized: function() {
            this.minimized ? this.minimizeWindow() : this.unMinimizeWindow()
        }
    }
}
</script>

<style scoped>
@keyframes open-window {
    0%{
        opacity: 0;
        transform: scale(0.95);
    }
    100%{
        opacity: 1;
        transform: scale(1.0);
    }
}

.window-body {
    display: flex;
    flex-direction: column;
    position: fixed;
    box-sizing:border-box;
    /* width: 300px;
    height: 200px;
    top: 120px;
    left: 100px; */
    animation: open-window 0.15s ease-out;
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

.invisible {
    transition: all .15s ease-out !important;
    transform: scale(0.95) !important;
    opacity: 0 !important;
}

.window-border-top {
    flex: none;
    width: auto;
    height: 8px;
    display: flex;
    flex-direction: row;
}
    .border-nw {
        cursor: nwse-resize;
        flex: none;
        width: 8px;
        height: 100%;
    }
    .border-n {
        cursor: ns-resize;
        width: auto;
        height: 100%;
        flex: auto;
    }
    .border-ne {
        cursor: nesw-resize;
        flex: none;
        width: 8px;
        height: 100%;
    }

.window-border-middle {
    flex: 1 0 auto;
    width: auto;
    height: auto;
    display: flex;
    flex-direction: row;
}
    .border-w {
        cursor: ew-resize;
        flex: none;
        width: 8px;
        height: auto;
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
        /* background-color: white; */

        -webkit-box-shadow: 3px 3px 20px 2px rgba(0,0,0,0.3);
        -moz-box-shadow: 3px 3px 20px 2px rgba(0,0,0,0.3);
        box-shadow: 3px 3px 20px 2px rgba(0,0,0,0.3);
    }
    .show-desktop .window-frame{
        border: 1px solid rgba(0,0,0,0);
    }
    .show-desktop .window-frame > div{
        opacity: 0;
    }

    .focused-window .window-frame {
        border: 1px solid #807ed6;
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
                /* background-size: cover; */
                background-position: center center;
                background-size: 16px 16px;
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
            @keyframes maximize-out {
                0% {background-color: #e5e5e5;}
                100% { background-color: inherit; }
            }
            @keyframes maximize-in {
                0% {background-color: inherit;}
                100% {background-color: #e5e5e5;}
            }
            .maximize-button {
                width: 45px;
                height: 29px;
                margin-right: 1px;
                flex: none;
                background-image: url('../assets/images/window/maximize.png');
                background-repeat: no-repeat;
                background-position: center center;
            }
            .maximize-window .maximize-button {
                height: 21px;
                background-image: url('../assets/images/window/resize.png');
            }
            .maximize-button-out{
                animation: maximize-out .2s;
            }
            .maximize-button:hover {
                animation : maximize-in .2s;
                -webkit-animation-fill-mode: forwards;
                animation-fill-mode: forwards;
            }
            .minimize-button {
                width: 45px;
                height: 29px;
                margin-right: 1px;
                flex: none;
                background-image: url('../assets/images/window/minimize.png');
                background-repeat: no-repeat;
                background-position: center center;
            }
            .maximize-window .minimize-button {
                height: 21px;
            }
            .minimize-button-out{
                animation: maximize-out .2s;
            }
            .minimize-button:hover {
                animation : maximize-in .2s;
                -webkit-animation-fill-mode: forwards;
                animation-fill-mode: forwards;
            }
            @keyframes close-out {
                0% {background-color: #E81123;}
                100% {background-color: inherit;}
            }
            @keyframes close-in {
                0% {background-color: inherit;}
                100% {background-color: #E81123;}
            }
            .close-button {
                width: 45px;
                height: 29px;
                flex: none;
                background-image: url('../assets/images/window/xblack3.png');
                background-repeat: no-repeat;
                background-position: center center;
            }
            .maximize-window .close-button {
                height: 21px;
                margin-right: 2px;
            }
            .close-button-out{
                animation: close-out .2s;
            }
            .close-button:hover {
                background-image: url('../assets/images/window/xwhite.png');
                animation : close-in .2s;
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
        .univ .title-bar-icon {
            display: none
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
                background-image: url('../assets/images/window/maximize.png');
                background-repeat: no-repeat;
                background-position: center center;
            }
            .maximize-window.univ .maximize-button {
                height: 32px;
            }
            .univ .maximize-button-out{
                animation: maximize-out 0s;
            }
            .univ .maximize-button:hover {
                /*background-image: url('../assets/images/window/maximize.png');     */
                animation : maximize-in 0s;
                -webkit-animation-fill-mode: forwards;
                animation-fill-mode: forwards;
            }

            .univ .minimize-button {
                width: 46px;
                height: 31px;
                flex: none;
                background-image: url('../assets/images/window/minimize.png');
                background-repeat: no-repeat;
                background-position: center center;
            }
            .maximize-window.univ .minimize-button {
                height: 32px;
                background-image: url('../assets/images/window/resize.png');
            }
            .univ .minimize-button-out{
                animation: maximize-out 0s;
            }
            .univ .minimize-button:hover {
                /*background-image: url('../assets/images/window/maximize.png');     */
                animation : maximize-in 0s;
                -webkit-animation-fill-mode: forwards;
                animation-fill-mode: forwards;
            }
            .univ .close-button {
                width: 46px;
                height: 31px;
                flex: none;
                background-image: url('../assets/images/window/xblack3.png');
                background-repeat: no-repeat;
                background-position: center center;
            }
            .maximize-window.univ .close-button {
                height: 32px;
                margin-right: 0;
            }
            .univ .close-button-out{
                animation: close-out 0s;
            }
            .univ .close-button:hover {
                background-image: url('../assets/images/window/xwhite.png');
                animation : close-in 0s;
                -webkit-animation-fill-mode: forwards;
                animation-fill-mode: forwards;
            }
        .main-panel {
            position: relative;
            overflow: hidden;
            width: auto;
            height: auto;
            box-sizing:border-box;
            flex: auto;
        }
        .iframe-cover {
            width: 100%;
            height: 100%;
            position: absolute;
            /* background-color: red;
            opacity: 0.2; */
        }
        .window-overlay{
            width: 100%;
            height: 100%;
            position: fixed;
            left:0;
            top:0;
            /* background-color: red; */
            opacity: 0.2;
            display: none;
            z-index: 1;
        }
    .border-e {
        cursor: ew-resize;
        flex: none;
        width: 8px;
        height: auto;
    }
    .iframe-inner {
        border: 0;
        padding:0;
        margin: 0;
        height:100%;
        width:100%;
        display:block;
        position: absolute;
    }
.window-border-bottom {
    flex:none;
    width: auto;
    height: 8px;
    display: flex;
    flex-direction: row;
}
    .border-sw {
        cursor: nesw-resize;
        flex: none;
        width: 8px;
        height: 100%;
    }
    .border-s {
        cursor: ns-resize;
        width: auto;
        height: 100%;
        flex: auto;
    }
    .border-se {
        cursor: nwse-resize;
        flex: none;
        width: 8px;
        height: 100%;
    }
</style>

