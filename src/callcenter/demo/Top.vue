<template>
    <!-- TOP BAR -->
    <section class="wrap-top-bar height-40 position-absolute top-0 width-100-percent" style="z-index: 1;">
      <!-- Status -->
      <div class="top-bar-status" :class="connectionStatusClass">
        {{ connectionStatus }}
      </div>
  
      <!-- Actions -->
      <div class="wrap-action-top-right float-right position-absolute right-15 top-10">
        <!-- Dropdown -->
        <div class="wrapper-dropdown wrapper-dropdown-call">
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
        </div>
  
        <!-- Minimize Button -->
        <button id="btnMinimize" class="btn-minimize border-none bg-transparent" title="Minimize" @click="minimize">
          <img :src="minimizeIcon" />
        </button>
  
        <!-- Close Button -->
        <button id="btnCloseIframe" class="btn-minimize border-none bg-transparent" title="Close" @click="closeIframe">
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
  
  export default {
    name: "Top",
    data() {
      return {
        connectionStatus: "Chưa kết nối",
        connectionStatusClass: "color-red", // Change dynamically based on connection status
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
    methods: {
      minimize() {
        console.log("Minimize button clicked");
        // Add logic to minimize the widget
      },
      closeIframe() {
        console.log("Close button clicked");
        // Add logic to close the iframe
      },
    },
  };
  </script>
  
  <style scoped src="@/callcenter/assets/stringee-widget/css/all-style-1.0.0.css">
  </style>