<template>
    <div class="call-widget card" :class="{ 'minimize-widget': minimize }" @keydown="handleKeyDown" tabindex="0">
        <template v-if="minimize">
            <div class="h-100 d-flex justify-content-center align-items-center">
                <span>Chưa có cuộc gọi</span>
            </div>
        </template>
        <template v-else>
            <CallHeader :callCenter="callCenter">
            </CallHeader>
            <div v-show="callCenter.incomingCallVisible">
                <IncomingCallScene :callCenter="callCenter"></IncomingCallScene>
            </div>

            <div v-show="callCenter.isInCall && !callCenter.incomingCallVisible">
                <CallInScene :callCenter="callCenter"></CallInScene>
            </div>
            <div v-show="!callCenter.isInCall && !callCenter.incomingCallVisible">
                <HomeScene :callCenter="callCenter"></HomeScene>
            </div>
            <CallFooter v-show="!callCenter.incomingCallVisible" :callCenter="callCenter"></CallFooter>
        </template>
    </div>
</template>

<script>
import CallHeader from './CallHeader.vue';
import CallFooter from './CallFooter.vue';
import CallInProcess from './CallInScene.vue';
import { CallCenter } from "../utils/callcenter";
import HomeScene from './HomeScene.vue';
import CallInScene from './CallInScene.vue';
import IncomingCallScene from './IncomingCallScene.vue';
export default {
    name: 'CallWidget',
    components: {
        CallHeader,
        CallFooter,
        // eslint-disable-next-line
        CallInProcess,
        // eslint-disable-next-line
        HomeScene,
        CallInScene,
        IncomingCallScene
    },
    data() {
        return {
            callCenter: CallCenter,
            minimize: false
        };
    },
    methods: {

    }
};
</script>

<style scoped>
.call-widget {
    min-width: 287px;
    max-width: 287px;
    margin: auto;
    z-index: 10;
    border: 1px solid #dee2e6;
    border-radius: 10px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    outline: none;
    height: 530px;
}

.minimize-widget {
    height: 44px;
}
</style>
<style>
.margin-top-40 {
    margin-top: 40px;
}
</style>