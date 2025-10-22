
export default (url_root) => {
  const defName = "systemManage"
  const ROUTER_DATA_MANAGE = [
    {
      path: "/",
      name: "ManageKPI",
      meta: {
        title: "Quản lý KPI",
        icon: "ri-focus-2-line",
        name: "Phân bổ KPI",
        showMenu: true,
        showNavSubMenu: true,
        showListMenu: false,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/AssignKPI.vue"
        ),
    },
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return ROUTER_DATA_MANAGE;
};
