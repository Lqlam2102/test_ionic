<template>
    <div class="callcenter-widget position-relative">
        <Top></Top>
        <div class="widget">
            <div class="widget-app">
                <SelectCallType v-if="screen == 'select-type'"></SelectCallType>
                <Contact v-if="screen == 'contact'"></Contact>
                <Dialpad v-if="screen == 'home'"></Dialpad>
                <Activity v-if="screen == 'activity'"></Activity>
                <Calling v-if="screen == 'calling'"></Calling>
                <IncomingCall v-if="screen == 'incoming'"></IncomingCall>
            </div>
        </div>
        <Footer v-if="screen != 'incoming' && screen != 'select-type'"></Footer>
    </div>
</template>

<script>
/* eslint-disable */
import Activity from './Activity.vue';
import Calling from './Calling.vue';
import IncomingCall from './IncomingCall.vue';
import Dialpad from './Dialpad.vue';
import Contact from './Contact.vue';
import SelectCallType from './SelectCallType.vue';
import Top from './Top.vue';
import Footer from './Footer.vue';
export default {
    name: "CallCenterWidget",
    components: {
        Top,
        Footer,
        Activity,
        Calling,
        IncomingCall,
        Dialpad,
        Contact,
        SelectCallType
    },
    data() {
        return {
            screen: "home",

        }
    }
}
</script>

<style scoped>
.callcenter-widget {
    margin-top: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
    padding: 0px;
    display: block;
    background: transparent;
    position: fixed;
    z-index: 16000015;
    border-radius: 10px;
    width: 287px;
    height: 538px;
    box-shadow: 0 10px 30px 0 rgba(0, 0, 0, .15);
    border: 1px solid #E9EBED;
    box-sizing: content-box;
    /*overflow: hidden;*/
}

.widget {
    font-family: "Averta-Regular";
    /* Rectangle */
    position: relative;
    width: 287px;
    height: 538px;
    background: #FFFFFF;
    /*box-shadow: 0px 12px 45px rgba(51, 49, 140, 0.25);*/
    border-radius: 10px;
}

.widget-app {
    display: flex;
    align-items: start;
    justify-content: center;
    position: absolute;
    left: 0px;
    top: 40px;
    width: 100%;
    height: calc(100% - 40px - 50px);
}
</style>