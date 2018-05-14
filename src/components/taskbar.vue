<template>
<div class="taskbar" data-component="taskbar">
    <div class="start-btn"></div>
    <div class="search-bar">Windows 검색</div>
    <div class="search-btn"></div>

    <div class="task-view"></div>
    <div class="task">

    </div>
    <div class="task">

    </div>
    <div class="task-bar-drag" draggable="true" v-on:drag="drag()"></div>
    <div class="clock-area">
        <div v-text="currentTime"></div>
        <div v-text="currentDay"></div>
        <div v-text="currentDate"></div>
    </div>
    <div id="notifybtn" class="notify-btn"></div>
    <div class="show-desktop"></div>
    <div class="taskbar-color">
        <div class="taskbar-gaussian-bg">
        </div>
    </div>
</div>
</template>

<script>
export default {
    data () {
        return {
            currentTime : '',
            currentDay  : '',
            currentDate : '',
            task : {

            }
        }
    },
    mounted : function() {
        setInterval(this.updateDateTime, 1000);
    },
    methods : {
        updateDateTime () {
            let nowDate = new Date();
            let hour    = nowDate.getHours();
            let minute  = nowDate.getMinutes();
            let month   = nowDate.getMonth()+1;
            let date    = nowDate.getDate();
            let week    = ['일', '월', '화', '수', '목', '금', '토'];
            let currentTime = '';

            if ( hour < 12 ) {
                currentTime = '오전 ';
            } else {
                currentTime = '오후 ';
                hour -= 12;
            }
            if ( minute < 10 ) {
                minute = '0' + minute;
            }
            currentTime += (hour ? hour : 12) + ":" + minute;
            if ( month < 10 ) month = '0' + month;
            if ( date < 10 )  date  = '0' + date;

            this.currentTime = currentTime;
            this.currentDate = nowDate.getFullYear()+'-'+month+'-'+date;
            this.currentDay  = week[nowDate.getDay()] + '요일';
        },
        drag : function () {
            console.log("dragged");
        }
    }
}
</script>

<style>

</style>
