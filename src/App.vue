<!-- App.vue -->
<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { provide } from "vue";
import Token from "@/helpers/user/user.js";
import userState from "@/helpers/state/dataUser.js";

export default {
  name: "App",
  components: { IonApp, IonRouterOutlet },
  setup() {
    provide("user", userState);
    provide("logout", () => {
      Token().removeUser();
      userState.value = { isLogin: false };
    });
    //Tạm thời bỏ useCallWidget để kiểm tra
    //const { provideCallWidget } = useCallWidget();
    //provideCallWidget();
  },
};
</script>

<style scoped>
.dropdown-item {
  cursor: pointer;
}
</style>