<template>
    <div>
        <textarea v-model="accessToken" rows="6" cols="50"
            style="height: 130px; width: 600px; resize: none;">YOUR_ACCESS_TOKEN</textarea>
        <br />
        <br />
        <button @click="login" :disabled="isLoggedIn">Login</button>
        Logged in: <span :style="{ color: isLoggedIn ? 'blue' : 'red' }">{{ loggedUserId }}</span>

        <div>
            <br />
            Make call from:
            <input v-model="fromNumber" type="text"
                placeholder="Enter the phone number purchased from Stringee here to make an App-to-Phone call"
                style="width: 650px;" />
            <br /><br />
            Make call to:
            <input v-model="callTo" type="text" placeholder="userId or number" style="width: 200px;" />
            <button @click="makeCall" :disabled="!isLoggedIn">Call</button>
            <button @click="hangup" :disabled="!isInCall">Hangup</button>
        </div>

        <div v-if="incomingCallVisible">
            Incoming call from: <span>{{ incomingCallFrom }}</span>
            <button @click="answerCall">Answer</button>
            <button @click="rejectCall">Reject</button>
        </div>

        <div>
            <br />
            Call status: <span :style="{ color: callStatusColor }">{{ callStatus }}</span> |
            Call type: <span :style="{ color: 'red' }">{{ callType }}</span>
        </div>

        <div>
            <video ref="remoteVideo" playsinline autoplay style="width: 350px"></video>
        </div>
    </div>
</template>

<script>
import { StringeeClient, StringeeCall } from "stringee";

export default {
    data() {
        return {
            stringeeClient: null,
            call: null,
            authenticatedWithUserId: "",
            accessToken: "",
            fromNumber: "",
            callTo: "",
            callStatus: "Not started",
            callType: "...",
            loggedUserId: "Not logged",
            incomingCallVisible: false,
            incomingCallFrom: "",
            isLoggedIn: false,
            isInCall: false,
        };
    },
    computed: {
        callStatusColor() {
            return this.callStatus === "Not started" ? "red" : "black";
        }
    },
    methods: {
        login() {
            this.loggedUserId = "Connecting...";
            this.stringeeClient = new StringeeClient();
            this.stringeeClient.connect(this.accessToken);
            this.stringeeClient.on("authen", (res) => {
                if (res.r === 0) {
                    this.isLoggedIn = true;
                    this.authenticatedWithUserId = res.userId;
                    this.loggedUserId = this.authenticatedWithUserId;
                } else {
                    this.loggedUserId = res.message;
                }
            });
            this.stringeeClient.on("incomingcall", (incomingcall) => {
                this.call = incomingcall;
                this.incomingCallFrom = incomingcall.fromNumber;
                this.incomingCallVisible = true;
            });
        },
        makeCall() {
            if (!this.callTo) return;
            const from = this.fromNumber || this.authenticatedWithUserId;
            this.call = new StringeeCall(this.stringeeClient, from, this.callTo);
            this.call.makeCall((res) => {
                if (res.r !== 0) {
                    this.callStatus = res.message;
                } else {
                    this.callStatus = "Call in progress";
                    this.callType = res.toType === "internal" ? "App-to-App call" : "App-to-Phone call";
                    this.isInCall = true;
                }
            });
        },
        answerCall() {
            this.call.answer((res) => {
                console.log(res);
                this.incomingCallVisible = false;
                this.callStatus = "Call answered";
                this.isInCall = true;
            });
        },
        rejectCall() {
            this.call.reject((res) => {
                console.log(res);
                this.incomingCallVisible = false;
                this.callStatus = "Call rejected";
            });
        },
        hangup() {
            if (this.call) {
                this.call.hangup((res) => {
                    console.log(res);
                    this.callStatus = "Call ended";
                    this.isInCall = false;
                });
            }
        }
    }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>