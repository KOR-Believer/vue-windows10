<template>
<div
    data-component="window-border"
    v-click-outside="outside"
    @mousedown="inside"
    :class=" {
        'focused-window': isFocused,
        'maximize-window': isMaximized,
        'invisible': invisible
    }"
    :style="windowStyle">
    <div class="window-border-top">
        <div
            class="border-nw"
            @mousedown="dragStart('border-nw', $event)"
        ></div>
        <div
            class="border-n"
            @mousedown="dragStart('border-n',  $event)"
        ></div>
        <div
            class="border-ne"
            @mousedown="dragStart('border-ne', $event)"
        ></div>
    </div>
    <div class="window-border-middle">
        <div
            class="border-w"
            @mousedown="dragStart('border-w', $event)"
        ></div>
        <div class="window-frame">
            <div class="title-bar">
                <div
                    class="title-bar-icon"
                    :style="{backgroundImage: 'url('+require('../assets/appData/freeTalk/icon.png')+')'}"
                ></div>
                <div
                    class="window-title"
                    @mousedown="dragStart('title-bar', $event)"
                    @dblclick="maximizeWindow"
                >
                    {{windowStyle.zIndex}}
                </div>
                <div
                    class="minimize-button"
                    :class="minimizeButtonOut"
                    @mouseover.once="minimizeButtonOut='minimize-button-out'"
                ></div>
                <div
                    class="maximize-button"
                    :class="maximizeButtonOut"
                    @mouseover.once="maximizeButtonOut='maximize-button-out'"
                    @click="maximizeWindow"
                ></div>
                <div
                    class="close-button"
                    :class="closeButtonOut"
                    @mouseover.once="closeButtonOut='close-button-out'"
                    @click="close"
                ></div>
            </div>
            <div class="main-panel">
                <div class="iframe-inner" style="height: 100%;"></div>
                <div class="window-overlay" :style="{display: overlayDisplay}"></div>
            </div>
        </div>
        <div class="border-e" @mousedown="dragStart('border-e', $event)" ></div>
    </div>
    <div class="window-border-bottom">
        <div class="border-sw" @mousedown="dragStart('border-sw', $event)"></div>
        <div class="border-s"  @mousedown="dragStart('border-s',  $event)"></div>
        <div class="border-se" @mousedown="dragStart('border-se', $event)"></div>
    </div>
</div>
</template>

<script>
export default {
    props: ['appId'],
    data () {
        return {
            id: this.appId,
            title: '',
            minWidth : 190,
            minHeight: 46, isDrag: false,
            windowsAction: 'none',
            overlayDisplay: 'none',
            isFocused: true,
            invisible: false,
            isMaximized: false,
            windowStyle: {
                width:  '400px',
                height: '300px',
                top:    '300px',
                left:   '400px',
                zIndex: 0
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
            closeButtonOut:''
        }
    },
    created : function() {
        this.windowStyle.zIndex = this.getNewZIndex();
    },
    mounted : function() {
        window.addEventListener('mouseup', this.dragEnd);
        window.addEventListener('mousemove', this.drag);
    },

    beforeDestroy: function() {
        window.removeEventListener('mouseup', this.dragEnd);
        window.removeEventListener('mousemove', this.drag);
    },

    methods : {
        outside: function() {
            if (this.isFocused) {
                console.log(this.id);
                this.isFocused = false;
            }
        },
        inside: function() {
            if (!this.isFocused) {
                this.setFocus();
            }
        },
        setFocus: function(){
            this.isFocused = true;
            this.windowStyle.zIndex = this.getNewZIndex();
        },
        maximizeWindow: function(){
            this.isMaximized = !this.isMaximized;
        },
        dragStart: function(action, e) {
            this.overlayDisplay = 'block';
            this.temporaryStyle.refMouseX = e.clientX;
            this.temporaryStyle.refMouseY = e.clientY;
            this.windowsAction = action;
            this.temporaryStyle.refWidth  = parseInt(this.windowStyle.width,  10);
            this.temporaryStyle.refHeight = parseInt(this.windowStyle.height, 10);
            this.temporaryStyle.refLeft   = parseInt(this.windowStyle.left,   10);
            this.temporaryStyle.refTop    = parseInt(this.windowStyle.top,    10);
            this.isDrag = true;
        },
        drag : function(e) {
            if ( this.isDrag ) {
                let offsetX = e.clientX - this.temporaryStyle.refMouseX;
                let offsetY = e.clientY - this.temporaryStyle.refMouseY;
                let nWidth, nHeight;
                if (e.clientX || e.clientY) {

                    switch (this.windowsAction) {
                        case "title-bar":
                            if (this.isMaximized) {
                                this.windowStyle.top       = '-16px';
                                this.temporaryStyle.refTop = -16;
                                this.isMaximized = false;
                                let windowWidth  = parseInt(this.windowStyle.width);
                                let leftClip     = this.temporaryStyle.refMouseX - (windowWidth / 2);
                                let rightClip    = this.temporaryStyle.refMouseX + (windowWidth / 2);
                                if (leftClip < -8) {
                                    leftClip = -8;
                                }

                                if (rightClip > this.getScreenWidth) {
                                    leftClip = this.getScreenWidth - windowWidth + 8;
                                }
                                this.temporaryStyle.refLeft = leftClip;
                                this.windowStyle.left = leftClip+'px';
                                break;
                            }
                            this.windowStyle.left = this.temporaryStyle.refLeft + offsetX + 'px';

                            this.windowStyle.top  = this.temporaryStyle.refTop  + offsetY + 'px';
                            break;

                        case "border-se":
                            nWidth  = this.temporaryStyle.refWidth  + offsetX;
                            nHeight = this.temporaryStyle.refHeight + offsetY;
                            if (nWidth > this.minWidth)
                                this.windowStyle.width  = nWidth  + 'px';
                            if (nHeight > this.minHeight)
                                this.windowStyle.height = nHeight + 'px';
                            break;

                        case "border-e":
                            nWidth = this.temporaryStyle.refWidth + offsetX;
                            if (nWidth > this.minWidth)
                                this.windowStyle.width = nWidth + 'px';
                            break;

                        case "border-s":
                            nHeight = this.temporaryStyle.refHeight + offsetY;
                            if (nHeight > this.minHeight)
                                this.windowStyle.height = nHeight + 'px';
                            break;

                        case "border-w":
                            nWidth = this.temporaryStyle.refWidth - offsetX;
                            if (nWidth > this.minWidth) {
                                this.windowStyle.left  = this.temporaryStyle.refLeft + offsetX + 'px';
                                this.windowStyle.width = nWidth + 'px';
                            }
                            break;

                        case "border-n":
                            nHeight = this.temporaryStyle.refHeight - offsetY;
                            if (nHeight > this.minHeight) {
                                this.windowStyle.top    = this.temporaryStyle.refTop + offsetY + 'px';
                                this.windowStyle.height = nHeight +'px';
                            }
                            break;

                        case "border-nw":
                            nHeight = this.temporaryStyle.refHeight - offsetY;
                            nWidth  = this.temporaryStyle.refWidth  - offsetX;
                            if (nHeight > this.minHeight) {
                                this.windowStyle.top    = this.temporaryStyle.refTop + offsetY + 'px';
                                this.windowStyle.height = nHeight +'px';
                            }
                            if (nWidth > this.minWidth) {
                                this.windowStyle.left  = this.temporaryStyle.refLeft + offsetX + 'px';
                                this.windowStyle.width = nWidth + 'px';
                            }
                            break;

                        case "border-ne":
                            nHeight = this.temporaryStyle.refHeight - offsetY;
                            nWidth  = this.temporaryStyle.refWidth  + offsetX;
                            if (nHeight > this.minHeight) {
                                this.windowStyle.top    = this.temporaryStyle.refTop + offsetY + 'px';
                                this.windowStyle.height = nHeight + 'px';
                            }
                            if (nWidth > this.minWidth)
                                this.windowStyle.width = nWidth + 'px';
                            break;

                        case "border-sw":
                            nHeight = this.temporaryStyle.refHeight + offsetY;
                            nWidth  = this.temporaryStyle.refWidth  - offsetX;
                            if(nHeight > this.minHeight)
                                this.windowStyle.height = nHeight +'px';
                            if (nWidth > this.minWidth) {
                                this.windowStyle.left  = this.temporaryStyle.refLeft + offsetX + 'px';
                                this.windowStyle.width = nWidth + 'px';
                            }
                            break;
                    }
                }
            }
        },
        dragEnd: function(e) {
            this.isDrag = false;
            this.overlayDisplay = 'none';
            if(parseInt(this.windowStyle.top) < -8){
                this.windowStyle.top="-8px";
            }
        },
        close: function(e) {
            this.invisible = true;
            setTimeout(() => {
                this.$store.commit('deleteTask', {appId: this.id});
            }, 150);
        },
        getNewZIndex: function() {
           this.$store.commit('setMaxZIndex');
           return this.getZIndex;
        }
    },
    computed: {
        getScreenWidth() {
            return this.$store.getters.getScreenWidth;
        },
        getScreenHeight() {
            return this.$store.getters.getScreenHeight;
        },
        getZIndex() {
            return this.$store.getters.getMaxZIndex;
        }
    },

    directives: {
        'click-outside': {
            bind: function(el, binding, vNode) {
                // Provided expression must evaluate to a function.
                if (typeof binding.value !== 'function') {
                    const compName = vNode.context.name;
                    let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
                    if (compName) { warn += `Found in component '${compName}'`; }
                    console.warn(warn);
                }
                // Define Handler and cache it on the element
                const bubble = binding.modifiers.bubble;
                const handler = (e) => {
                    if (bubble || (!el.contains(e.target) && el !== e.target)) {
                        binding.value(e);
                    }
                }
                el.__vueClickOutside__ = handler;

                // add Event Listeners
                document.addEventListener('mousedown', handler);
            },
            unbind: function(el, binding) {
                // Remove Event Listeners
                document.removeEventListener('mousedown', el.__vueClickOutside__);
                el.__vueClickOutside__ = null;
            }
        }
    }
}
</script>

<style scoped>
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

    .invisible {
        transition: all .15s ease-out;
        transform: scale(0.95);
        opacity: 0;
    }

    .window-border-top {
        flex: none;
        width: auto;
        height: 8px;
        display: flex;
        flex-direction: row;
        animation: window_open_vertical 0.2s;
    }
        .border-nw {
            cursor: nw-resize;
            flex: none;
            width: 8px;
            height: 100%;
        }
        .border-n {
            cursor: n-resize;
            width: auto;
            height: 100%;
            flex: auto;
        }
        .border-ne {
            cursor: ne-resize;
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
            cursor: w-resize;
            flex: none;
            width: 8px;
            height: auto;
            animation: window_open_horizontal 0.2s;
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
                    background-image: url('../assets/images/window/maximize.png');
                    background-repeat: no-repeat;
                    background-position: center center;
                }
                .maximize-window .maximize-button {
                    height: 21px;
                    background-image: url('../assets/images/window/resize.png');
                }
                .maximize-button-out{
                    animation: maximize_out .2s;
                }
                .maximize-button:hover {
                    animation : maximize_in .2s;
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
                    animation: maximize_out .2s;
                }
                .minimize-button:hover {
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
                    background-image: url('../assets/images/window/xblack3.png');
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
                    background-image: url('../assets/images/window/xwhite.png');
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
                    background-image: url('../assets/images/window/minimize.png');
                    background-repeat: no-repeat;
                    background-position: center center;
                }
                .maximize-window.univ .maximize-button {
                    height: 32px;
                }
                .univ .maximize-button-out{
                    animation: maximize_out 0s;
                }
                .univ .maximize-button:hover {
                    /*background-image: url('../assets/images/window/maximize.png');     */
                    animation : maximize_in 0s;
                    -webkit-animation-fill-mode: forwards;
                    animation-fill-mode: forwards;
                }

                .univ .minimize-button {
                    width: 46px;
                    height: 31px;
                    flex: none;
                    background-image: url('../assets/images/window/maximize.png');
                    background-repeat: no-repeat;
                    background-position: center center;
                }
                .maximize-window.univ .minimize-button {
                    height: 32px;
                    background-image: url('../assets/images/window/resize.png');
                }
                .univ .minimize-button-out{
                    animation: maximize_out 0s;
                }
                .univ .minimize-button:hover {
                    /*background-image: url('../assets/images/window/maximize.png');     */
                    animation : maximize_in 0s;
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
                    animation: close_out 0s;
                }
                .univ .close-button:hover {
                    background-image: url('../assets/images/window/xwhite.png');
                    animation : close_in 0s;
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
            .window-overlay{
                width: 100%;
                height: 100%;
                position: absolute;
                background-color: red;
                display: none;
            }
        .border-e {
            cursor: e-resize;
            flex: none;
            width: 8px;
            height: auto;
            animation: window_open_horizontal 0.2s;
        }
       .iframe-inner {
           background-color: blue;
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
        animation: window_open_vertical 0.2s;
    }
        .border-sw {
            cursor: sw-resize;
            flex: none;
            width: 8px;
            height: 100%;
        }
        .border-s {
            cursor: s-resize;
            width: auto;
            height: 100%;
            flex: auto;
        }
        .border-se {
            cursor: se-resize;
            flex: none;
            width: 8px;
            height: 100%;
        }
</style>

