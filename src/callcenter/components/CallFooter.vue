<template>
    <!-- TOOLBAR FOOTER -->
    <section
        class="wrap-toolbar-bottom position-absolute bottom-0 height-100 width-100-percent box-shadow2 z-index-100">
        <div class="wrap-toolbar text-center d-flex justify-content-evenly">
            <!-- Activity Button -->
            <button id="btnToolActivity" class="toolbar-item d-table-cell border-0 bg-transparent">
                <img :src="activityIconGray" class="icon-gray" />
                <img :src="activityIcon" class="icon" />
            </button>

            <!-- Setting Button -->
            <button id="btnToolSetting" class="toolbar-item d-table-cell border-0 bg-transparent d-none">
                <img :src="settingIconGray" class="icon-gray" />
                <img :src="settingIcon" class="icon" />
            </button>

            <!-- Call Button -->
            <button id="btnToolCall" v-if="!callCenter.isInCall"
                class="btn-action-incoming btn-round btn-green btn-size-55 d-table-cell border-0 mt-15-negative">
                <!-- <img :src="callIconGray" class="icon-gray" /> -->
                <img :src="callIcon" class="icon" />
            </button>

            <button id="btnToolCall" v-else-if="callCenter.isInCall" @click="callCenter.hangup()"
                class="btn-action-incoming btn-round btn btn-danger btn-size-55 d-table-cell border-0 mt-15-negative">
                <!-- <img :src="callIconGray" class="icon-gray" /> -->
                <img :src="callIcon" class="icon" />
            </button>

            <!-- Pad Button -->
            <button id="btnToolPad"
                class="btn-action-incoming btn-round btn-green btn-size-55 d-table-cell border-0 mt-15-negative d-none">
                <img :src="padIconGray" class="icon-gray" />
                <!-- <img :src="padIcon" class="icon" /> -->
            </button>

            <!-- Contact Button -->
            <button id="btnToolContact" class="toolbar-item d-table-cell border-0 bg-transparent">
                <img :src="contactIconGray" class="icon-gray" />
                <!-- <img :src="contactIcon" class="icon" /> -->
            </button>

            <!-- Add Button -->
            <button id="btnToolAdd" class="toolbar-item d-table-cell border-0 bg-transparent d-none">
                <!-- <img :src="addIconGray" class="icon-gray" /> -->
                <img :src="addIcon" class="icon" />
            </button>
        </div>
    </section>
</template>

<script>
/* eslint-disable */
import activityIconGray from "@/callcenter/assets/stringee-widget/images/icon-list-gray.svg";
import activityIcon from "@/callcenter/assets/stringee-widget/images/icon-list.svg";
import settingIconGray from "@/callcenter/assets/stringee-widget/images/icon-setting-gray.svg";
import settingIcon from "@/callcenter/assets/stringee-widget/images/icon-setting.svg";
import callIconGray from "@/callcenter/assets/stringee-widget/images/icon-phone.svg";
import callIcon from "@/callcenter/assets/stringee-widget/images/icon-phone.svg";
import padIconGray from "@/callcenter/assets/stringee-widget/images/icon-pad.svg";
import padIcon from "@/callcenter/assets/stringee-widget/images/icon-pad.svg";
import contactIconGray from "@/callcenter/assets/stringee-widget/images/icon-user-gray.svg";
import contactIcon from "@/callcenter/assets/stringee-widget/images/icon-user.svg";
import addIconGray from "@/callcenter/assets/stringee-widget/images/icon-add-gray.svg";
import addIcon from "@/callcenter/assets/stringee-widget/images/icon-add.svg";

export default {
    name: "Footer",
    data() {
        return {
            activityIconGray,
            activityIcon,
            settingIconGray,
            settingIcon,
            callIconGray,
            callIcon,
            padIconGray,
            padIcon,
            contactIconGray,
            contactIcon,
            addIconGray,
            addIcon,
        };
    },
    props: {
        callCenter: {
            type: Object,
            required: true,
        }
    },
};
</script>

<style scoped>
.wrap-toolbar-bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    z-index: 100;
    background: transparent;
}

.wrap-toolbar {
    text-align: center;
    display: flex;
    justify-content: space-evenly;
}

.toolbar-item {
    display: table-cell;
    border: none;
    background: transparent;
}

.btn-action-incoming {
    display: inline-block;
    cursor: pointer;
}

.btn-round {
    border-radius: 50%;
}

.btn-green {
    background: linear-gradient(262.92deg, #66D54B 6.49%, #17C653 108.73%);
    box-shadow: 0px 4px 24px rgba(50, 153, 150, 0.25);
}

.btn-size-55 {
    width: 55px;
    height: 55px;
}

.mt-15-negative {
    margin-top: -15px;
}

.icon-gray {
    filter: grayscale(100%);
}

.icon {
    width: 20px;
    height: 20px;
}

.d-none {
    display: none;
}

.border-0 {
    border: none;
}

.bg-transparent {
    background: transparent !important;
}
</style>