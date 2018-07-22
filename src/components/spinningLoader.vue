<template>
<div class="loader-body">
  <div class='loader'>
    <div class='circle'></div>
    <div class='circle'></div>
    <div class='circle'></div>
    <div class='circle'></div>
    <div class='circle'></div>
  </div>
</div>
</template>
<script>
    export default {
        name: "spinningLoader",
        props: [
        ],
        data() {
            return {

            }
        },
        mounted: function () {

        },
        beforeDestroy: function () {

        },
        methods: {

        }
    }
</script>

<style scoped>
@keyframes bgg {
  0% { background: rgba(0, 153, 255, 1); }
  50% { background: rgba(41, 255, 121, 1); }
  100% { background: rgba(255, 74, 88, 1); }
}
.loader-body {
  position: absolute;
  width: 100%;
  height: 100%;
  margin:0;
  padding:0;
  border:0;
  animation: bgg 14000ms ease-in alternate infinite;
}
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 50px;
  height: 50px;
  margin: auto;
}
.loader .circle {
  position: absolute;
  width: 37px;
  height: 37px;
  opacity: 0;
  transform: rotate(225deg);
  animation-iteration-count: infinite;
  animation-name: orbit;
  animation-duration: 4.3s;
}
.loader .circle:after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 0 9px rgba(255, 255, 255, .7);
}
.loader .circle:nth-child(2) {
  animation-delay: 210ms;
}
.loader .circle:nth-child(3) {
  animation-delay: 420ms;
}
.loader .circle:nth-child(4) {
  animation-delay: 630ms;
}
.loader .circle:nth-child(5) {
  animation-delay: 840ms;
}
@keyframes orbit {
  0% {
    transform: rotate(180deg);
    opacity: 1;
    animation-timing-function: linear;
  }
  7% {
    transform: rotate(300deg);
    animation-timing-function: linear;
  }
  30% {
    transform: rotate(430deg);
    animation-timing-function: linear;
  }
  42% {
    transform: rotate(640deg);
    animation-timing-function: linear;
  }
  70% {
    transform: rotate(800deg);
    opacity: 1;
    animation-timing-function: linear;
  }
  75% {
    transform: rotate(900deg);
    opacity: 1;
    animation-timing-function: linear;
  }
  76% {
    transform: rotate(900deg);
    opacity: 0;
    animation-timing-function: linear;
  }
  100% {
    transform: rotate(900deg);
    opacity: 0;
    animation-timing-function: linear;

  }
}
</style>