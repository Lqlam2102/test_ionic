
export default (url_root) => {
  const defName = "systemManage"
  const ROUTER_DATA_MANAGE = [
    {
      path: "/manage/customer",
      name: "ManageCustomer",
      meta: {
        title: "Quản lý khách hàng",
        icon: "ri-community-fill",
        name: "Quản lý khách hàng",
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
          "./pages/ManageCustomer.vue"
        ),
    }
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return ROUTER_DATA_MANAGE;
};
