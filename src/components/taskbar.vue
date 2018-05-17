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
    <div class="task-bar-drag" draggable="true" v-on:drag="drag"></div>
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
        drag : function (event) {
            if (event.clientX != 0 && event.clientY != 0) {
                this.$store.commit('setTaskbarDirection', {direction: this.getCardinalDirection(event.clientX, event.clientY)});
            }
        },
        getCardinalDirection : function (posX, posY) {
            let y1 = (this.getScreenHeight / this.getScreenWidth) * posX;                          // y = ax    graph[ / ]
            let y2 = - (this.getScreenHeight / this.getScreenWidth) * posX + this.getScreenHeight; // y = -ax+b graph[ \ ]
            let direction = 0;
            if (y1 > posY)         // y > ax     graph[ */  ]
                direction += 1100;
            else                   // y <= ax    graph[  /* ]
                direction += 11;
            if (y2 > posY)         // y > -ax+b  graph[  \* ]
                direction += 1001;
            else                   // y <= -ax+b graph[ *\  ]
                direction += 110;
            if (direction) {
                return {
                    2101: 'top',
                    1210: 'right',
                    121 : 'bottom',
                    1012: 'left'
                }[direction]
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
    }
}
</script>

<style>

</style>
