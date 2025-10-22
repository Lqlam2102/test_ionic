export default (url_root) => {
  const ROUTER_DATA_MANAGE = [
    {
      path: "/login",
      name: "Login",
      meta: {
        title: "Đăng nhập",
      },
      props: {},
      component: () => import("./signin/cover.vue"),
    },
    {
      path: "/forgot",
      name: "Forgot",
      meta: {
        title: "Quên mật khẩu",
      },
      props: {},
      component: () => import("./reset/cover.vue"),
    },
    {
      path: "/register",
      name: "Register",
      meta: {
        title: "Đăng kí tài khoản",
      },
      props: {},
      component: () => import("./create/cover.vue"),
    },
    {
      path: "/logout",
      name: "Logout",
      meta: {
        title: "Đăng xuất",
      },
      props: {},
    },
    {
      path: "/error-403",
      name: "Error403",
      meta: {
        title: "403 - Không có quyền truy cập!",
      },
      props: {},
      component: () => import("./errors/403.vue"),
    },
    {
      path: "/error-404",
      name: "Error404",
      meta: {
        title: "404 - Không tìm thấy!",
      },
      props: {},
      component: () => import("./errors/404.vue"),
    },
    {
      path: "/change-password",
      name: "ProfileChangePassword",
      meta: { title: "Thay đổi mật khẩu" },
      component: () => import("./change_password/ChangePW.vue"),
    },
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return ROUTER_DATA_MANAGE;
};
