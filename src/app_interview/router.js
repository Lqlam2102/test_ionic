
export default (url_root) => {
  const defName = "systemManage"
  const ROUTER_DATA_MANAGE = [
    {
      path: "/manage/interview",
      name: "ManageInterview",
      meta: {
        title: "Quản lý phỏng vấn",
        icon: "mdi mdi-video-marker",
        name: "Quản lý phỏng vấn",
        subName: "Danh sách",
        showMenu: true,
        showNavSubMenu: false,
        showListMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/ManageInterview.vue"
        ),
    }
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return ROUTER_DATA_MANAGE;
};
