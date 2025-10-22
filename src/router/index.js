import { createRouter, createWebHistory, createWebHashHistory } from "@ionic/vue-router"; // Thay vue-router bằng @ionic/vue-router
import { Capacitor } from "@capacitor/core";
import routes from "./routes";
import { RouterCheck } from "./middleware/authencation";

const isNative = Capacitor.isNativePlatform();

const router = createRouter({
  history: isNative ? createWebHashHistory() : createWebHistory('/'), // Native dùng hash để tránh 404 trong WebView
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  await RouterCheck(to, from, next);
});

export default router;