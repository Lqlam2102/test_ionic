
export default (url_root) => {
  const defName = "systemManage"
  const ROUTER_DATA_MANAGE = [
    {
      path: "/manage/logs-candidate",
      name: "ManageLogsCandidate",
      meta: {
        title: "Quản lý Log ứng viên",
        icon: "bx bx-bell",
        name: "Quản lý Log ứng viên",
        showMenu: true,
        showNavSubMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/ManageLogsCandidate.vue"
        ),
    },
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return ROUTER_DATA_MANAGE;
};
