// router/index.js
import { createRouter, createWebHistory, createWebHashHistory } from "@ionic/vue-router";
import { Capacitor } from "@capacitor/core";
import routes from "./routes";
import { RouterCheck } from "./middleware/authencation";

const isNative = Capacitor.isNativePlatform();

const router = createRouter({
  history: isNative ? createWebHashHistory() : createWebHistory('/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    console.log("Scroll to:", to.path, savedPosition);
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  console.log("Navigating to:", to.path, "from:", from.path);
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  await RouterCheck(to, from, next);
});

router.afterEach((to) => {
  console.log("Route rendered:", to.path);
});

export default router;