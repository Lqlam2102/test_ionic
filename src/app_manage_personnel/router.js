
export default (url_root) => {
  const defName = "systemManage"
  const ROUTER_DATA_MANAGE = [
    {
      path: "/manage/personal/dashboad",
      name: "ManagePersonalDashboad",
      meta: {
        title: "Quản lý nhân viên",
        icon: "ri-settings-3-line",
        name: "Bảng điều khiển",
        showMenu: true,
        showNavSubMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/DashboadPersonal.vue"
        ),
    },
    {
      path: "/manage/personal/employee",
      name: "ManagePersonalEmployee",
      meta: {
        title: "Quản lý nhân sự",
        icon: "ri-settings-3-line",
        name: "Quản lý nhân sự",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/ManagePersonal.vue"
        ),
    },
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return ROUTER_DATA_MANAGE;
};
