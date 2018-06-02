<template>
<div data-component="window-border" :class="{'focused-window': isFocused, 'maximize-window': isMaximized}" :style="windowStyle">
    <div class="window-border-top">
        <div class="border-nw" v-drag-and-drop v-on:drag="drag"></div>
        <div class="border-n" v-drag-and-drop v-on:drag="drag"></div>
        <div class="border-ne" v-drag-and-drop v-on:drag="drag"></div>
    </div>
    <div class="window-border-middle">
        <div class="border-w" v-drag-and-drop v-on:drag="drag"></div>
        <div class="window-frame">
            <div class="title-bar" v-drag-and-drop v-on:drag="drag">
                <div class="title-bar-icon" :style="{backgroundImage: 'url('+require('../assets/appData/freeTalk/icon.png')+')'}"></div>
                <div class="window-title">{{id}}</div>
                <div class="maximize-button"></div>
                <div class="maximize-button"></div>
                <div class="close-button"></div>
            </div>
            <div class="main-panel">
                <div class="iframe-inner" style="height: 100%;"></div>
                <div class="window-overlay" :style="{display: overlayDisplay}"></div>
            </div>
        </div>
        <div class="border-e" v-drag-and-drop v-on:drag="drag"></div>
    </div>
    <div class="window-border-bottom">
        <div class="border-sw" v-drag-and-drop v-on:drag="drag"></div>
        <div class="border-s" v-drag-and-drop v-on:drag="drag"></div>
        <div class="border-se" v-drag-and-drop v-on:drag="drag"></div>
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
        this.$on('drag-start', function (e) {
            this.dragStart(e);
        });
        this.$on('drag-end', function (e) {
            this.dragEnd(e);
        });
    },
    mounted : function() {

    },
    methods : {
        dragStart: function(e) {

            let img = document.createElement("img");
            img.src = noImage;
            e.dataTransfer.setDragImage(img, 0, 0, e.target);
            this.overlayDisplay = 'block';
            this.temporaryStyle.refMouseX = e.clientX;
            this.temporaryStyle.refMouseY = e.clientY;
            let windowsAction = e.srcElement.className;
            if (windowsAction == 'title-bar') {
                if (this.isMaximized) {
                    this.isMaximized     = false;
                    this.windowStyle.top = '-16px';
                    let windowWidth = parseInt(this.windowStyle.width);
                    let leftClip    = this.temporaryStyle.refMouseX - (windowWidth / 2);
                    let rightClip   = this.temporaryStyle.refMouseY + (windowWidth / 2);
                    if (leftClip < -8) {
                        leftClip = -8;
                    }
                    if (rightClip > this.getScreenWidth) {
                        leftClip = this.getScreenWidth - windowWidth + 8;
                    }
                    this.windowStyle.left = leftClip+'px';
                }
            }
            this.temporaryStyle.refWidth  = parseInt(this.windowStyle.width,  10);
            this.temporaryStyle.refHeight = parseInt(this.windowStyle.height, 10);
            this.temporaryStyle.refLeft   = parseInt(this.windowStyle.left,   10);
            this.temporaryStyle.refTop    = parseInt(this.windowStyle.top,    10);

        },
        drag : function(e) {

            let offsetX = e.clientX - this.temporaryStyle.refMouseX;
            let offsetY = e.clientY - this.temporaryStyle.refMouseY;
            let nWidth, nHeight;
            if (e.clientX || e.clientY) {
                let windowsAction = e.srcElement.className;
                switch (windowsAction) {
                    case "title-bar":
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

        },
        dragEnd: function(e) {

        }
    },
    computed: {
        getScreenWidth() {
            return this.$store.getters.getScreenWidth;
        },
        getScreenHeight() {
            return this.$store.getters.getScreenHeight;
        }
    }
}
</script>

<style>

</style>

