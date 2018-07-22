<template>
    <div
        class="grid-body"
        @mousedown="mousedown"
        @click="click"
        @keydown.enter="enter"
        tabindex="0"
    >
        <ul class="icon-grid">
            <li
                class="grid-cell"
                v-for="(icon, index) in iconList"
                :key="index"
            >
                <app-icon
                    :title="icon.title"
                    :iconImage="icon.iconImage"
                    :argv="icon.argv"
                    :width="icon.width"
                    :height="icon.height"
                    ref="icons"
                    v-selected="Vcomp"
                ></app-icon>
            </li>
        </ul>
        <div class="selection" ref="selection" v-show="selectionDisplay" :style="selectionArea"></div>
    </div>
</template>
<script>
    import myIcon from './icon.vue'

    export default {
        components: {
            appIcon: myIcon
        },
        props: ['iconList'],
        data() {
            return {
                list: this.iconList,
                Vcomp: this,
                selectionArea: {
                    width: '0',
                    height: '0',
                    top: '0',
                    left: '0'
                },
                selectionDisplay: false,
                lastX:0,
                lastY:0
            }
        },
        mounted: function () {

        },
        methods: {
            select: function () {

            },
            execute: function () {

            },
            delete: function () {

            },
            outside: function () {
            },
            click: function () {

            },
            mousedown: function (evt) {
                const touch = evt.touches && evt.touches[0]
                this.lastX  = (touch || evt).clientX
                this.lastY  = (touch || evt).clientY
                this.selectionDisplay = true
                window.addEventListener('mousemove', this.mousemove)
                window.addEventListener('mouseup', this.mouseup)

            },
            mousemove: function(evt) {
               if(this.lastX || this.lastY) {
                   const { /*abs,*/ max, min } = Math
                   const brect = this.$el.getBoundingClientRect()
                   const touch = evt.touches && evt.touches[0]
                   let x2 = (touch || evt).clientX
                   let y2 = (touch || evt).clientY

                   //cliping
                   if (x2 < brect.left) x2 = brect.left
                   if (y2 < brect.top) y2 = brect.top
                   if (x2 > brect.left + brect.width) x2 = brect.left + brect.width
                   if (y2 > brect.top + brect.height) y2 = brect.top + brect.height

                   const x3 = min(this.lastX, x2)
                   const y3 = min(this.lastY, y2)
                   const x4 = max(this.lastX, x2)
                   const y4 = max(this.lastY, y2)

                   this.selectionArea.top = y3 + "px"
                   this.selectionArea.left = x3 + "px"
                   this.selectionArea.width = (x4 - x3) + "px"
                   this.selectionArea.height = (y4 - y3) + "px"
                }
            },
            mouseup: function () {
                this.selectionDisplay = false;
                window.removeEventListener('mousemove', this.mousemove);
                window.removeEventListener('mouseup', this.mouseup);
                this.selectionArea.width = 0
                this.selectionArea.height = 0
                this.selectionArea.top = 0
                this.selectionArea.left = 0
                this.lastX = 0
                this.lastY = 0
            },
            enter: function () {
                this.$refs.icons.forEach(i => {
                    if(i.iconSelected && !this.selectionDisplay) {
                        this.$store.commit('addApp',i.$options.propsData)
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .grid-body {
        padding-top:5px;
        width: 100%;
        height: 100%;
    }
    .icon-grid {
        display: flex;
        flex: 1 1 0%;
        height: 100%;
        flex-flow: column wrap;
        align-content: flex-start;
    }

    .grid-cell {
        width: 76px;
        position: relative;
        display: flex;
        flex: 0 0 101px;
        align-items: flex-start;
        justify-content: center;
    }
    .selection {
        top:0;
        position: fixed;
        width:100px;
        height: 100px;
        background: rgba(0, 102, 204, 0.2745);
        border: 1px solid rgb(0, 120, 215);
        z-index: 4;
    }
</style>