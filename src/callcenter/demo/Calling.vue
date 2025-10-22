<template>
    <section id="page-calling" class="w-100">
        <!-- Status Section -->
        <section class="wrap-status p-l-r-20 top-0 position-relative d-flex">
            <div class="wrap-status-text line-height-30">
                <span class="status-text">Đang gọi</span>
                <div class="line-red-short"></div>
            </div>
            <div class="wrap-status-time line-height-30 position-absolute right-0">
                <span class="status-time">{{ statusTime }}</span>
            </div>
        </section>

        <!-- Info Section -->
        <section class="wrap-info p-20">
            <div class="info-name pb-10">
                {{ callerName }}
            </div>
            <div class="d-flex gap-1">
                <span class="location-via">thông qua</span>
                <span class="location-text">{{ location }}</span>
            </div>
        </section>

        <div class="line-dotted"></div>

        <!-- Action Buttons -->
        <section class="wrap-action d-flex justify-content-between">
            <button id="btnMic" class="action-call text-center flex-basis p-10 bg-white border-0" @click="toggleMic">
                <img class="icon" :src="micIcon" />
                <img class="icon-on d-none" :src="micOffIcon" />
            </button>
            <button id="btnHold" class="action-call text-center flex-basis p-10 bg-white border-0" @click="toggleHold">
                <img class="icon" :src="holdIcon" />
                <img class="icon-on d-none" :src="holdRedIcon" />
            </button>
            <button id="btnKeypadInCall" class="action-call text-center flex-basis p-10 bg-white border-0" @click="toggleKeypad">
                <img :src="keypadIcon" />
            </button>
            <button id="btnTransfer" class="action-call text-center flex-basis p-10 bg-white border-0">
                <img :src="transferIcon" />
            </button>
            <button id="btnAddToCall" class="action-call text-center flex-basis p-10 bg-white border-0">
                <img :src="addToCallIcon" />
            </button>
        </section>

        <!-- Dialpad Section -->
        <section class="wrap-diapad-when-calling" v-if="keyPadOn">
            <div class="wrap-typing-number pl-15 pr-15 mt-10 mb-10 d-flex justify-content-between">
                <input type="text" v-model="dialpadInput" placeholder="*101#"
                    class="font-size-24 color-black border-0" />
                <button class="btn-close border-0 bg-transparent" @click="clearDialpad">
                    <img :src="closeIcon" />
                </button>
            </div>
            <div class="wrap-diapad mb-20 diapad-size-medium">
                <div class="diapad-row" v-for="(row, rowIndex) in dialpadKeys" :key="rowIndex">
                    <button v-for="(key, keyIndex) in row" :key="keyIndex" class="diapad-key"
                        @click="addToDialpad(key)">
                        <span class="diapad-key-number">{{ key }}</span>
                    </button>
                </div>
            </div>
        </section>

        <!-- Background Section -->
        <section class="wrap-background bg-gradient-purple width-100-percent" v-else>
            <div class="wrap-avatar-round text-center">
                <img :src="avatar" class="mt-80" />
            </div>
        </section>
    </section>
</template>

<script>
/* eslint-disable */
import micIcon from "@/callcenter/assets/stringee-widget/images/icon-mic.svg";
import micOffIcon from "@/callcenter/assets/stringee-widget/images/icon-mic-off.svg";
import holdIcon from "@/callcenter/assets/stringee-widget/images/icon-pause.svg";
import holdRedIcon from "@/callcenter/assets/stringee-widget/images/icon-pause-red.svg";
import keypadIcon from "@/callcenter/assets/stringee-widget/images/icon-pad-gray.svg";
import transferIcon from "@/callcenter/assets/stringee-widget/images/icon-back.svg";
import addToCallIcon from "@/callcenter/assets/stringee-widget/images/icon-add-to-call.svg";
import avatar from "@/callcenter/assets/stringee-widget/images/avatar.png";
import closeIcon from "@/callcenter/assets/stringee-widget/images/icon-close.svg";

export default {
    name: "Calling",
    data() {
        return {
            statusTime: "00:00",
            callerName: "Pattrick Penna",
            location: "0965890179",
            micOn: true,
            holdOn: false,
            keyPadOn: false,
            dialpadInput: "",
            dialpadKeys: [
                ["1", "2", "3"],
                ["4", "5", "6"],
                ["7", "8", "9"],
                ["*", "0", "#"],
            ],
            avatar,
            keypadIcon,
            transferIcon,
            addToCallIcon,
            closeIcon
        };
    },
    computed: {
        micIcon() {
            return this.micOn ? micIcon : micOffIcon;
        },
        holdIcon() {
            return this.holdOn ? holdRedIcon : holdIcon;
        }
    },
    methods: {
        toggleMic() {
            this.micOn = !this.micOn;
        },
        toggleHold() {
            this.holdOn = !this.holdOn;
        },
        toggleKeypad() {
            this.keyPadOn = !this.keyPadOn
        },
        addToDialpad(key) {
            this.dialpadInput += key;
        },
        clearDialpad() {
            this.dialpadInput = "";
        },
    },
};
</script>

<style scoped lang="scss">
@import "@/callcenter/assets/stringee-widget/css/all-style-1.0.0.css";
/* Add your styles here */
.wrap-background {
    height: 271px;
}
.btn-close {
    width: auto;
    height: auto;
}
</style>