
export default (url_root) => {
  const defName = "systemManage"
  const ROUTER_DATA_MANAGE = [
    {
      path: "/manage/notification",
      name: "ManageNotification",
      meta: {
        title: "Quản lý thông báo",
        icon: "bx bx-bell",
        name: "Quản lý thông báo",
        showMenu: true,
        showNavSubMenu: false,
        showListMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/ManageNotification.vue"
        ),
    },
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return ROUTER_DATA_MANAGE;
};
