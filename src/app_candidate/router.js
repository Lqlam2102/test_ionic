
export default (url_root) => {
  const defName = "systemManage"
  const ROUTER_DATA_MANAGE = [
    {
      path: "/manage/candidate/",
      name: "ManageCandidate",
      meta: {
        title: "Quản lý ứng viên",
        icon: "ri-file-user-line",
        name: "Quản lý ứng viên",
        showMenu: true,
        showNavSubMenu: false,
        showListMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/ManageCandidate.vue"
        ),
    },
    // {
    //   path: "/manage/candidate/assign",
    //   name: "ManageAssignTask",
    //   meta: {
    //     title: "Chia số",
    //     icon: "ri-file-user-line",
    //     name: "Chia số",
    //     showMenu: false,
    //     showNavSubMenu: true,
    //     belongTo: defName,
    //     requiresAuth: true,
    //     cpuiaPermission: true,
    //   },
    //   component: () =>
    //     import(
    //       "./pages/ManageAssignTask.vue"
    //     ),
    // },
    {
      path: "/manage/candidate/multi-add",
      name: "ManageMultiAdd",
      meta: {
        title: "Thêm nhanh",
        icon: "ri-file-user-line",
        name: "Thêm nhanh",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/ManageMultiAdd.vue"
        ),
    },
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return ROUTER_DATA_MANAGE;
};
