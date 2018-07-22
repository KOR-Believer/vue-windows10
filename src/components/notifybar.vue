<template>
  <div class="notifybar">
        <div></div>
        <div style="font-size: 1.16em; color:white; height:56px; margin-top:2px; line-height:52px; text-indent: 11px;">알림</div>
        <div>
            <div class="notify-app">
                <div class="notify-app-title">제목 제목 제목이 올 자리다..!</div>
                <div class="close-notify"></div>
            </div>
            <div class="notify-line"></div>
            <div style=" height:56px; padding:9px 0; box-sizing:border-box; background-color:red;">
                <div style="float:left; width:303px; border-right:1px solid #3b3b3b; height:100%; background-color:blue;">
                    <div style="float:left; padding: 0 14px 0 15px; background-color:gray; width:27px; height:100%;">
                        <div style="background-image:url('/data/images/taskbar/notify.png'); background-size: cover; background-position: center; width:100%; height:100%;"></div>
                    </div>
                </div>
                <div style="float:left; width:44px; height:100%; background-color:yellow;"></div>
            </div>

        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>
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
</style>

<style scoped>
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
        background-image: url('../assets/images/window/xwhite.png');
        background-repeat: no-repeat;
        background-position: center;
    }
    .notify-line{
        height:13px;
        background-image:url('../assets/images/taskbar/line.png');
        background-position: center;
        background-repeat: no-repeat;
    }
</style>
