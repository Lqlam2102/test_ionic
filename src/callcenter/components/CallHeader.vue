<template>
    <!-- TOP BAR -->
    <section class="wrap-top-bar height-40 position-absolute top-0 width-100-percent" style="z-index: 1;">
        <!-- Status -->
        <div class="top-bar-status" :class="connectionStatusClass">
            {{ callCenter.loggedUserId ?? 'Chưa kết nối' }}
        </div>

        <!-- Actions -->
        <div class="wrap-action-top-right float-right position-absolute right-15 top-10">
            <!-- Dropdown -->
            <!-- <div class="wrapper-dropdown wrapper-dropdown-call">
                <div id="dropdown-option-call" class="wrapper-dropdown-3" tabindex="1">
                    <span id="routingTypeLabelActived">
                        <img :src="activeRoutingIcon" class="icon-option-active" :title="activeRoutingTitle" />
                    </span>
                    <ul class="dropdown">
                        <li v-for="(option, index) in routingOptions" :key="index" :data-value="option.value">
                            <a href="javascript:void(0)">
                                <img :src="option.icon" class="icon-option" :title="option.title" />
                                {{ option.text }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div> -->

            <!-- Minimize Button -->
            <button id="btnMinimize" class="btn-minimize border-none bg-transparent" title="Minimize" @click="minimize">
                <img :src="minimizeIcon" />
            </button>

            <!-- Close Button -->
            <button id="btnCloseIframe" class="btn-minimize border-none bg-transparent" title="Close"
                @click="closeIframe">
                <img :src="closeIcon" />
            </button>
        </div>
    </section>
</template>

<script>
/* eslint-disable */
import browserIcon from "@/callcenter/assets/stringee-widget/images/icon-browser.png";
import phoneIcon from "@/callcenter/assets/stringee-widget/images/icon-phone.png";
import appIcon from "@/callcenter/assets/stringee-widget/images/icon-app.png";
import ipphoneIcon from "@/callcenter/assets/stringee-widget/images/icon-ipphone.png";
import minimizeIcon from "@/callcenter/assets/stringee-widget/images/icon-minimize.svg";
import closeIcon from "@/callcenter/assets/stringee-widget/images/icon-close-no-border.svg";
import { useCallWidget } from '@/callcenter/composables/useCallWidget.js';

export default {
    name: "CallHeader",
    setup() {
        const { injectCallWidget } = useCallWidget();
        const callWidget = injectCallWidget();
        return {
            callWidget
        };
    },
    data() {
        return {
            connectionStatus: "Chưa kết nối",
            activeRoutingIcon: browserIcon,
            activeRoutingTitle: "Đổ cuộc gọi đến app và sipphone",
            routingOptions: [
                {
                    value: 1,
                    icon: browserIcon,
                    title: "Đổ cuộc gọi đến app và sipphone",
                    text: "Đổ cuộc gọi đến app và sipphone",
                },
                {
                    value: 2,
                    icon: phoneIcon,
                    title: "Đổ cuộc gọi đến số điện thoại",
                    text: "Đổ cuộc gọi đến số điện thoại",
                },
                {
                    value: 3,
                    icon: appIcon,
                    title: "Đổ cuộc gọi đến app",
                    text: "Đổ cuộc gọi đến app",
                },
                {
                    value: 4,
                    icon: ipphoneIcon,
                    title: "Đổ cuộc gọi đến ipphone",
                    text: "Đổ cuộc gọi đến ipphone",
                },
            ],
            minimizeIcon,
            closeIcon
        };
    },
    props: {
        callCenter: {
            type: Object,
            required: true,
        }
    },
    computed: {
        connectionStatusClass(){
            return this.callCenter?.loggedUserId ? 'text-success' : 'text-danger'
        } 
    },  
    methods: {
        minimize() {
            console.log("Minimize button clicked");
            // Add logic to minimize the widget
        },
        closeIframe() {
            this.callWidget.close()
        },
    },
};
</script>

<style scoped>
.wrap-top-bar {
    height: 40px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
}

.top-bar-status {
    position: absolute;
    font-size: 12px;
    top: 12px;
    left: 20px;
}

.wrap-action-top-right {
    float: right;
    position: absolute;
    right: 15px;
    top: 10px;
}

.wrapper-dropdown {
    float: left;
}

.wrapper-dropdown-call #dropdown-option-call {
    width: 30px;
    font-size: 12px;
    border: none;
    box-shadow: none;
    padding: 5px;
}

.wrapper-dropdown-call #dropdown-option-call .icon-option-active {
    width: 14px;
    filter: grayscale(100%);
}

.wrapper-dropdown-call .dropdown {
    left: initial;
    right: -50px;
    width: 250px;
    z-index: 1;
    top: 35px;
    transition: all 0.2s ease-in;
}

.wrapper-dropdown-call .dropdown .icon-option {
    width: 13px;
    vertical-align: middle;
    margin-right: 5px;
}

.wrapper-dropdown-call .dropdown li a {
    padding: 8px 12px;
}

.btn-minimize {
    border: none;
    background: transparent;
}

.bg-transparent {
    background: transparent !important;
}

.border-none {
    border: none;
}
</style>