
export default (url_root) => {
  const defName = "systemManage"
  const ROUTER_DATA_MANAGE = [
    {
      path: "/report/recruitment",
      name: "RealTimeReports",
      meta: {
        title: "Báo cáo thời gian thực",
        icon: "ri-book-read-fill",
        name: "Báo cáo thời gian thực",
        showMenu: true,
        showNavSubMenu: true,
        showListMenu: false,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/RealTimeReports.vue"
        ),
    },
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return ROUTER_DATA_MANAGE;
};
