
export default (url_root) => {
  const defName = "systemManage"
  const ROUTER_DATA_MANAGE = [
    {
      path: "/system/logs",
      name: "ManageSystemLogs",
      meta: {
        title: "Nhật ký hệ thống",
        icon: "ri-book-read-fill",
        name: "Nhật ký hệ thống",
        showMenu: true,
        showNavSubMenu: true,
        showListMenu: false,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/ManageSystemLogs.vue"
        ),
    },
    {
      path: "/system/logs/candidate",
      name: "ManageCandidateLogs",
      meta: {
        title: "Ứng viên",
        icon: "ri-book-read-fill",
        name: "Ứng viên",
        showMenu: false,
        showNavSubMenu: true,
        showListMenu: false,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/ManageCandidateLogs.vue"
        ),
    },
    {
      path: "/system/logs/interview",
      name: "ManageInterviewLogs",
      meta: {
        title: "Phỏng vấn",
        icon: "ri-book-read-fill",
        name: "Phỏng vấn",
        showMenu: false,
        showNavSubMenu: true,
        showListMenu: false,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/ManageInterviewLogs.vue"
        ),
    },
    {
      path: "/system/logs/campaign",
      name: "ManageCampaignLogs",
      meta: {
        title: "Chiến dịch",
        icon: "ri-book-read-fill",
        name: "Chiến dịch",
        showMenu: false,
        showNavSubMenu: true,
        showListMenu: false,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/ManageCampaignLogs.vue"
        ),
    }
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return ROUTER_DATA_MANAGE;
};
