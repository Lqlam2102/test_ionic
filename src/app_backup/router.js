export default (url_root) => {
  const LOG_ROUTER = [
    {
      path: "/manage/backup",
      name: "appBackup",
      meta: {
        title: "QUẢN LÝ SAO LƯU",
        icon: "ri-restart-line",
        name: "Sao lưu",
        showMenu: true,
        showNavSubMenu: true,
        belongTo: "systemBackup",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: "SAO LƯU",
      },
      component: () =>
        import("@/app_backup/pages/manage_backup/ManageBackup.vue"),
    },
  ];

  LOG_ROUTER.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return LOG_ROUTER;
};
