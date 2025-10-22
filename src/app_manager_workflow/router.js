
export default (url_root) => {
  const defName = "systemManage"
  const ROUTER_DATA_MANAGE = [
    {
      path: "/manage/workflow",
      name: "ManageWorkflow",
      meta: {
        title: "Quản lý quy trình làm việc",
        icon: "bx bx-bell",
        name: "Quản lý quy trình làm việc",
        showMenu: true,
        showNavSubMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/ManagerWorkflow.vue"
        ),
    },
    {
      path: "/manage/detail-workflow/:id",
      name: "ManageWorkflowDetail",
      meta: {
        title: "Quản lý quy trình làm việc",
        icon: "bx bx-bell",
        name: "Quản lý quy trình làm việc",
        showMenu: false,
        showNavSubMenu: false,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/ManageCustomerCare.vue"
        ),
    },
    {
      path: "/manage/history-workflow/:id",
      name: "ManageWorkflowHistory",
      meta: {
        title: "Lịch sử quy trình làm việc",
        icon: "bx bx-bell",
        name: "Lịch sử quy trình làm việc",
        showMenu: false,
        showNavSubMenu: false,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/ManageCustomerCare.vue"
        ),
    },
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return ROUTER_DATA_MANAGE;
};
