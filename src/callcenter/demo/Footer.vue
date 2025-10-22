<template>
    <!-- TOOLBAR FOOTER -->
    <section class="wrap-toolbar-bottom position-absolute bottom-0 height-100 width-100-percent box-shadow2 z-index-100 bg-white">
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
        <button
          id="btnToolCall"
          class="btn-action-incoming btn-round btn-green btn-size-55 d-table-cell border-0 mt-15-negative"
        >
          <img :src="callIconGray" class="icon-gray" />
          <img :src="callIcon" class="icon" />
        </button>
  
        <!-- Pad Button -->
        <button
          id="btnToolPad"
          class="btn-action-incoming btn-round btn-green btn-size-55 d-table-cell border-0 mt-15-negative d-none"
        >
          <img :src="padIconGray" class="icon-gray" />
          <img :src="padIcon" class="icon" />
        </button>
  
        <!-- Contact Button -->
        <button id="btnToolContact" class="toolbar-item d-table-cell border-0 bg-transparent">
          <img :src="contactIconGray" class="icon-gray" />
          <img :src="contactIcon" class="icon" />
        </button>
  
        <!-- Add Button -->
        <button id="btnToolAdd" class="toolbar-item d-table-cell border-0 bg-transparent d-none">
          <img :src="addIconGray" class="icon-gray" />
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
  };
  </script>
  
  <style scoped lang="scss">
  @import "@/callcenter/assets/stringee-widget/css/all-style-1.0.0.css";
  
  /* Add additional styles here if needed */
  </style>