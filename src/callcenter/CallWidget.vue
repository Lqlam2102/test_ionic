<template>
    <div class="d-flex" v-if="isAuth">
        <div></div>
        <Dropdown ref="dropdownRef" v-model="dropdownOpen" @open="onOpen" @close="onClose">
            <template #trigger="{ toggle }">
                <button @click="toggle"
                    class="btn btn-success btn-icon waves-effect waves-light arrow-none btn-callcenter">
                    <i class="ri-phone-fill fs-20"></i>
                </button>
            </template>
            <div>
                <CallScenes></CallScenes>
            </div>
        </Dropdown>
    </div>
</template>

<script>
/* eslint-disable */
import { inject } from "vue";

import Dropdown from "@/base/components/dropdown/Dropdown.vue";
import CallScenes from "./components/CallScenes.vue";
import { CallCenter } from "./utils/callcenter";
import { useCallWidget } from '@/callcenter/composables/useCallWidget.js';

export default {
    name: 'CallCenterDemo',
    components: {
        Dropdown,
        CallScenes
    },
    setup() {
        const { injectCallWidget } = useCallWidget();
        const callWidget = injectCallWidget();
        return {
            callWidget
        };
    },
    data() {
        return {
            isAuth: false,
            userInfo: null,
            stringeeClient: null,
            call: null,
            isLoggedIn: false,
            authenticatedWithUserId: null,
            loggedUserId: null,
            incomingCallFrom: null,
            incomingCallVisible: false,
            callStatus: null,
            callType: null,
            isInCall: false,
            fromNumber: null,
            accessToken: null,
            dropdownOpen: false,
            CallCenter
        };
    },
    watch: {
        'callWidget.isOpen': {
            handler(isOpen) {
                console.log('Dropdown visibility changed:', isOpen);
                this.$nextTick(() => {
                    this.dropdownOpen = isOpen;
                });
            },
            immediate: true
        },
        'CallCenter.customData': {
            handler() {
                console.log('Change customData', this.CallCenter.customData);
                const candidateData = this.CallCenter.customData
                if (candidateData?.id) {
                    this.$router.push({
                        name: "ManageCandidate",
                        query: {
                            candidate_id: candidateData?.id
                        }
                    });
                } else {
                    this.$router.push({
                        name: "ManageCandidate"
                    });
                }
            },
        },
        'CallCenter.isInCall': {
            handler(isInCall) {
                if (isInCall) {
                    this.dropdownOpen = true;
                }
            },
            immediate: true
        }
    },
    created() {
        this.userInfo = inject("user");
    },
    async mounted() {
        const isAuth = await this.CallCenter.init(this.callWidget);
        if (isAuth) this.isAuth = true;
    },
    methods: {
        onOpen() {
            console.log('Dropdown opened:');
        },
        onClose() {
            console.log('Dropdown closed:');
        }
    }
};
</script>