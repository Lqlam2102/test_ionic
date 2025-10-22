<template>
    <!-- PAGE INCOMING CALL -->
    <section id="page-incoming-call" class="mt-5">
        <!-- Incoming Call Info -->
        <div class="incoming-call-info box-shadow1 border-radius-18 bg-gradient-purple overflow-hidden mb-20">
            <div class="wrap-info-text bg-white pt-20 pb-20">
                <!-- Status Section -->
                <section class="wrap-status p-l-r-20 top-0 position-relative d-flex">
                    <div class="wrap-status-text line-height-30">
                        <span class="status-text">Có cuộc gọi đến</span>
                        <div class="line-red-short"></div>
                    </div>
                </section>

                <!-- Info Section -->
                <section class="wrap-info p-20">
                    <div class="info-name pb-10">
                        {{ callerName }}
                    </div>
                    <div class="wrap-location d-flex gap-2">
                        <span class="location-via">thông qua</span>
                        <span class="location-text">{{ location }}</span>
                    </div>
                </section>
            </div>

            <!-- Background Section -->
            <section class="wrap-background bg-gradient-purple height-350 width-100-percent">
                <div class="wrap-avatar-round text-center">
                    <img :src="avatar" class="mt-50" />
                </div>
            </section>
        </div>

        <!-- Incoming Call Actions -->
        <div class="incoming-call-action d-flex justify-content-between">
            <!-- Decline Button -->
            <button id="btn-incoming-decline"
                class="btn-action-incoming btn-round btn-red btn-size-55 d-table-cell border-0" @click="declineCall">
                <img :src="declineIcon" class="icon" style="transform: rotate(135deg)" />
            </button>

            <!-- Dotted Icons -->
            <img :src="dottedEndIcon" />
            <img :src="dottedCallIcon" />

            <!-- Accept Button -->
            <button id="btn-incoming-accept"
                class="btn-action-incoming btn-round btn-green btn-size-55 d-table-cell border-0" @click="acceptCall">
                <img :src="acceptIcon" class="icon" />
            </button>
        </div>
    </section>
</template>

<script>
/* eslint-disable */
import avatar from "@/callcenter/assets/stringee-widget/images/avatar.png";
import declineIcon from "@/callcenter/assets/stringee-widget/images/icon-phone.svg";
import acceptIcon from "@/callcenter/assets/stringee-widget/images/icon-phone.svg";
import dottedEndIcon from "@/callcenter/assets/stringee-widget/images/icon-dotted-end.svg";
import dottedCallIcon from "@/callcenter/assets/stringee-widget/images/icon-dotted-call.svg";

export default {
    name: "IncomingCall",
    data() {
        return {
            callerName: "0965890179",
            location: "Admin",
            avatar,
            declineIcon,
            acceptIcon,
            dottedEndIcon,
            dottedCallIcon,
        };
    },
    methods: {
        declineCall() {
            console.log("Call declined");
            // Add logic to handle declining the call
        },
        acceptCall() {
            console.log("Call accepted");
            // Add logic to handle accepting the call
        },
    },
};
</script>

<style scoped lang="scss">
@import "@/callcenter/assets/stringee-widget/css/all-style-1.0.0.css";

/* Add additional styles here if needed */
#page-incoming-call {
    width: 90%;
}
.wrap-background {
    height: 220px;
}
</style>