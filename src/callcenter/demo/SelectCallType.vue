<template>
    <!-- Select call type -->
    <section class="wrap-option-call">
        <!-- Close Button -->
        <button class="btn-close-option-call border-none bg-transparent" @click="closeCallTypeOptions">
            <img :src="closeIcon" alt="Close" />
        </button>

        <!-- Call Type Options -->
        <div class="d-flex flex-column gap-3">
            <!-- Free Voice Call -->
            <button class="btn btn-success btn-lg rounded-pill" @click="selectCallType('voice')">
                <span>
                    <img :src="phoneIcon" width="15" alt="Voice Call" />
                </span>
                Gọi thoại miễn phí
            </button>

            <!-- Free Video Call -->
            <button class="btn btn-info btn-lg rounded-pill" @click="selectCallType('video')">
                <span>
                    <img :src="videoCallIcon" width="15" alt="Video Call" />
                </span>
                Gọi video miễn phí
            </button>

            <!-- Call Out -->
            <button class="btn btn-primary btn-lg rounded-pill" @click="selectCallType('callout')">
                <span>
                    <img :src="phoneIcon" width="15" alt="Call Out" />
                </span>
                Gọi ra
            </button>
        </div>
    </section>
</template>

<script>
/* eslint-disable */
import closeIcon from "@/callcenter/assets/stringee-widget/images/icon-close.svg";
import phoneIcon from "@/callcenter/assets/stringee-widget/images/icon-phone.svg";
import videoCallIcon from "@/callcenter/assets/stringee-widget/images/icon-videocall.svg";

export default {
    name: "SelectCallType",
    data() {
        return {
            closeIcon,
            phoneIcon,
            videoCallIcon
            // Add any additional data if needed
        };
    },
    methods: {
        closeCallTypeOptions() {
            console.log("Close call type options");
            // Add logic to close the call type selection
        },
        selectCallType(type) {
            console.log(`Selected call type: ${type}`);
            // Add logic to handle the selected call type
        },
    },
};
</script>

<style scoped lang="scss">
@import "@/callcenter/assets/stringee-widget/css/all-style-1.0.0.css";

/* Add additional styles here if needed */
.btn {
    display: flex;
    align-items: center;
    justify-content: start;
    position: relative;
    gap: 10px;
}

.wrap-option-call {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.btn-close-option-call {
    position: absolute;
    top: 40px;
    right: 20px;
}
</style>