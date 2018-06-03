<template>
<div
    data-component="window-border"
    :class=" {
        'focused-window': isFocused,
        'maximize-window': isMaximized
    }"
    :style="windowStyle"
>
    <div class="window-border-top">
        <div class="border-nw" @mousedown="dragStart('border-nw', $event)" ></div>
        <div class="border-n"  @mousedown="dragStart('border-n',  $event)" ></div>
        <div class="border-ne" @mousedown="dragStart('border-ne', $event)" ></div>
    </div>
    <div class="window-border-middle">
        <div class="border-w" @mousedown="dragStart('border-w', $event)" ></div>
        <div class="window-frame">
            <div class="title-bar">
                <div class="title-bar-icon" :style="{backgroundImage: 'url('+require('../assets/appData/freeTalk/icon.png')+')'}"></div>
                <div class="window-title" @mousedown="dragStart('title-bar', $event)" @dblclick="maximizeWindow" >{{windowStyle.left}} {{getScreenWidth}}</div>
                <div class="minimize-button minimize-button-out"></div>
                <div class="maximize-button maximize-button-out" @click="maximizeWindow"></div>
                <div class="close-button close-button-out"></div>
            </div>
            <div class="main-panel">
                <div class="iframe-inner" style="height: 100%;"></div>
                <div class="window-overlay" :style="{display: overlayDisplay}"></div>
            </div>
        </div>
        <div class="border-e" @mousedown="dragStart('border-e', $event)" ></div>
    </div>
    <div class="window-border-bottom">
        <div class="border-sw" @mousedown="dragStart('border-sw', $event)" ></div>
        <div class="border-s"  @mousedown="dragStart('border-s',  $event)" ></div>
        <div class="border-se" @mousedown="dragStart('border-se', $event)" ></div>
    </div>

</div>
</template>
<script>
import noImage from '../assets/images/common/1px.png'
export default {
    props: ['appId'],
    data () {
        return {
            id: this.appId,
            title: '',
            minWidth : 190,
            minHeight: 46,
            isFocused: true,
            isMaximized: false,
            isDrag: false,
            windowsAction: 'none',
            overlayDisplay: 'none',
            windowStyle: {
                width:  '400px',
                height: '300px',
                top:    '300px',
                left:   '400px',
                zIndex: 10+this.appId
            },
            temporaryStyle: {
                refMouseX: 0,
                refMouseY: 0,
                refWidth : 0,
                refHeight: 0,
                refLeft  : 0,
                refTop   : 0
            }
        }
    },
    created : function() {

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
            //console.log(this.id);
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
        }
    },
    computed: {
        getScreenWidth() {
            return this.$store.getters.getScreenWidth;
        },
        getScreenHeight() {
            return this.$store.getters.getScreenHeight;
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
                document.removeEventListener('click', el.__vueClickOutside__);
                el.__vueClickOutside__ = null;

            }
        }
    }
}
</script>

<style>

</style>

