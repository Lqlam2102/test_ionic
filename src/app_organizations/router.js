
export default (url_root) => {
  const defName = "systemManage"
  const ROUTER_DATA_MANAGE = [
    // {
    //   path: "/manage/organizations/",
    //   name: "ManageOrganizations",
    //   meta: {
    //     title: "Quản lý tổ chức",
    //     icon: "ri-settings-3-line",
    //     name: "Quản lý tổ chức",
    //     showMenu: true,
    //     showNavSubMenu: true,
    //     belongTo: defName,
    //     requiresAuth: true,
    //     cpuiaPermission: true,
    //   },
    //   component: () =>
    //     import(
    //       "./pages/Organizations.vue"
    //     ),
    // },
    {
      path: "/manage/organizations/",
      name: "ManageCompanyInfor",
      meta: {
        title: "Thông tin công ty",
        icon: "ri-settings-3-line",
        name: "Thông tin công ty",
        showMenu: true,
        showNavSubMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/CompanyInfor.vue"
        ),
    },
    {
      path: "/manage/organizations/departmant",
      name: "ManageDepartment",
      meta: {
        title: "Cơ cấu tổ chức",
        icon: "ri-settings-3-line",
        name: "Cơ cấu tổ chức",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/Department.vue"
        ),
    },
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return ROUTER_DATA_MANAGE;
};
