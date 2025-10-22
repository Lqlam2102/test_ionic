<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<style>
.dropdown-item {
  cursor: pointer;
}
</style>

<script>
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { provide } from "vue";
import Token from "./helpers/user/user.js";
import userState from "./helpers/state/dataUser";
import { useCallWidget } from '@/callcenter/composables/useCallWidget.js';

export default {
  name: "App",
  components: { IonApp, IonRouterOutlet },
  setup: function () {
    provide("user", userState);
    provide("logout", () => {
      Token().removeUser();
      userState.value = { isLogin: false };
    });
    const { provideCallWidget } = useCallWidget();
    provideCallWidget(); // Provide cho toàn app
  }
};
</script>