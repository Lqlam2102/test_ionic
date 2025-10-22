<template>
  <div>
    <h1>Thử nghiệm tính năng realtime report</h1>
  </div>
</template>

<script>
import { getAccessToken } from "@/helpers/api/token";
import { WS } from "@/helpers/utils/config_system";

export default {
  data() {
    return {
      notifications: [],
      socket: null,
    };
  },
  mounted() {
    this.connectWebSocket();
  },
  methods: {
    connectWebSocket() {
      this.socket = new WebSocket(
        `${WS}/ws/report/?token=${getAccessToken().replace("Bearer ", "")}`
      );

      this.socket.onopen = () => {
        console.log("WebSocket connection opened.");
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message from server: ", data);
        this.notifications.push(data);
      };

      this.socket.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      this.socket.onerror = (event) => {
        console.error("WebSocket error: ", event);
      };
    },
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  },
};
</script>

<style scoped>
#notifications {
  margin-top: 20px;
}
</style>
