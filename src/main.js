import { createApp } from "vue";
import { IonicVue } from "@ionic/vue"; // Thêm IonicVue
import App from "./App.vue";
import router from "./router";
import Token from "@/helpers/user/user.js";
import { getCompanyInfor } from './helpers/user/company.js';
import AOS from "aos";
import "aos/dist/aos.css";
import i18n from "./i18n";
import store from "./helpers/state/store";
import BootstrapVue3 from "bootstrap-vue-3";
import vClickOutside from "click-outside-vue3";
import VueApexCharts from "vue3-apexcharts";
import Maska from "maska";
import { createPinia } from "pinia";
import VueFeather from "vue-feather";
import vue3GoogleLogin from 'vue3-google-login';
import { getListApplications } from "./helpers/user/applications.js";
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

// Thêm các CSS cần thiết cho Ionic
import '@ionic/vue/css/core.css'; // Core Ionic CSS
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
// Optional Ionic CSS utils (có thể chọn những cái cần thiết)
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';

// CSS hiện có của dự án
import "@/assets/scss/config/default/app.scss";
import "@vueform/slider/themes/default.css";
import "@/assets/scss/mermaid.min.css";

const pinia = createPinia();

AOS.init({
  easing: "ease-out-back",
  duration: 1000,
});

async function initApp() {
  try {
    const { getUser } = Token();
    await getUser();
    await getCompanyInfor();
    await getListApplications();
  } catch (err) {
    console.error(err);
  }

  const app = createApp(App)
    .use(IonicVue) // Thêm IonicVue vào ứng dụng
    .use(PrimeVue, {
      theme: {
        preset: Aura
      }
    })
    .use(store)
    .use(pinia)
    .use(router)
    .use(VueApexCharts)
    .use(BootstrapVue3)
    .component(VueFeather.type, VueFeather)
    .use(Maska)
    .use(i18n)
    .use(vClickOutside)
    .use(vue3GoogleLogin, {
      clientId: '755926073777-jue1nupv42300ntq60egido4nu07njve.apps.googleusercontent.com'
    });

  // Đảm bảo router sẵn sàng trước khi mount
  router.isReady().then(() => {
    app.mount("#app");
  });
}

initApp();