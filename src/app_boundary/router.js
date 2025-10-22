export default (url_root) => {
  const ROUTER_DATA_MANAGE = [
    {
      path: "/",
      name: "manageBoundaries",
      meta: {
        title: "QUẢN LÝ ĐƠN VỊ HÀNH CHÍNH",
        icon: "ri-pages-line",
        name: "Đơn vị hành chính",
        showMenu: true,
        showNavSubMenu: false,
        belongTo: "systemManage",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: "Đơn vị hành chính",
      },
      component: () =>
        import("../app_boundary/pages/manage_province/ManageProvince.vue"),
    },
    // {
    //   path: "/region",
    //   name: "manageRegion",
    //   meta: {
    //     title: "QUẢN LÝ ĐƠN VỊ HÀNH CHÍNH",
    //     icon: "ri-pages-line",
    //     name: "Vùng",
    //     showMenu: false,
    //     showNavSubMenu: true,
    //     belongTo: "systemManage",
    //     requiresAuth: true,
    //     cpuiaPermission: true,
    //   },
    //   props: {
    //     nameKCN: "Đơn vị hành chính",
    //   },
    //   component: () =>
    //     import("../app_boundary/pages/manage_region/ManageRegion.vue"),
    // },
    {
      path: "/province",
      name: "manageProvince",
      meta: {
        title: "QUẢN LÝ ĐƠN VỊ HÀNH CHÍNH",
        icon: "ri-pages-line",
        name: "Tỉnh/Thành phố",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: "systemManage",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: "Đơn vị hành chính",
      },
      component: () =>
        import("../app_boundary/pages/manage_province/ManageProvince.vue"),
    },
    {
      path: "/district",
      name: "manageDistrict",
      meta: {
        title: "QUẢN LÝ ĐƠN VỊ HÀNH CHÍNH",
        icon: "ri-pages-line",
        name: "Quân/Huyện/Thị xã",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: "systemManage",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: "Đơn vị hành chính",
      },
      component: () =>
        import("../app_boundary/pages/manage_district/ManageDistrict.vue"),
    },
    {
      path: "/commune",
      name: "manageCommune",
      meta: {
        title: "QUẢN LÝ ĐƠN VỊ HÀNH CHÍNH",
        icon: "ri-pages-line",
        name: "Xã/Phường/Thị trấn",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: "systemManage",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: "Đơn vị hành chính",
      },
      component: () =>
        import("../app_boundary/pages/manage_commune/ManageCommune.vue"),
    },
    {
      path: "/hamlet",
      name: "manageHamlet",
      meta: {
        title: "QUẢN LÝ ĐƠN VỊ HÀNH CHÍNH",
        icon: "ri-pages-line",
        name: "Thôn/Bản/Tiểu khu/Tổ dân phố",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: "systemManage",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: "Đơn vị hành chính",
      },
      component: () =>
        import("../app_boundary/pages/manage_hamlet/ManageHamlet.vue"),
    },
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return ROUTER_DATA_MANAGE;
};
