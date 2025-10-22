export default function (url_root) {
  const USER_ROUTER = [
    {
      path: "/",
      name: "appUser",
      meta: {
        title: "QUẢN LÝ NGƯỜI DÙNG",
        icon: "ri-account-circle-line",
        name: "Người dùng",
        showMenu: true,
        showNavSubMenu: false,
        belongTo: "systemManage",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: "NGƯỜI DÙNG",
      },
      component: () => import("../app_user/pages/ManageUser.vue"),
    },
    {
      path: "/",
      name: "manageUser",
      meta: {
        title: "QUẢN LÝ NGƯỜI DÙNG",
        icon: "ri-account-circle-line",
        name: "Danh sách",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: "systemManage",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: "NGƯỜI DÙNG",
      },
      component: () => import("../app_user/pages/ManageUser.vue"),
    },
    {
      path: "/group",
      name: "manageGroup",
      meta: {
        title: "QUẢN LÝ NHÓM NGƯỜI DÙNG",
        icon: "ri-pages-line",
        name: "Nhóm",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: "systemManage",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: "NGƯỜI DÙNG",
      },
      component: () => import("../app_user/pages/manage_group/ManageGroup.vue"),
    },
    {
      path: "/role",
      name: "manageRole",
      meta: {
        title: "QUẢN LÝ VAI TRÒ NGƯỜI DÙNG",
        icon: "ri-pages-line",
        name: "Vai trò",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: "systemManage",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: "NGƯỜI DÙNG",
      },
      component: () => import("../app_user/pages/manage_role/ManageRole.vue"),
    },
    // {
    //   path: "/log-auth",
    //   name: "manageLogAuth",
    //   meta: {
    //     title: "manage-log-auth",
    //     icon: "ri-pages-line",
    //     name: "Nhật ký",
    //     showMenu: false,
    //     showNavSubMenu: true,
    //     belongTo: "systemManage",
    //   },
    //   props: {
    //     nameKCN: "NGƯỜI DÙNG",
    //   },
    //   component: () => import("../app_user/pages/manage_log/ManageLog.vue"),
    // },
  ];

  USER_ROUTER.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return [
    ...USER_ROUTER,
    {
      path: "/profile/detail",
      name: "Profile",
      meta: { title: "Thông tin cá nhân" },
      component: () => import("./pages/public/Profile.vue"),
    },
    {
      path: "/profile/edit",
      name: "ProfileUpdate",
      meta: { title: "Cập nhật thông tin cá nhân" },
      component: () => import("./pages/public/UpdateProfile.vue"),
    },
  ];
}
