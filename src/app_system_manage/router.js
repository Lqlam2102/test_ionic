
import APP_MANAGE_BACKUP_LOG_ROUTER from "@/app_backup/router.js";

export default (url_root) => {
  const defName = "SystemConfig"
  const ROUTER_DATA_MANAGE = [
    {
      path: "/system",
      name: "system",
      meta: {
        title: "QUẢN LÝ CÀI ĐẶT",
        icon: "ri-settings-3-line",
        name: "Thiết lập chung",
        showMenu: true,
        showNavSubMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: "Cài đặt",
      },
      component: () =>
        import(
          "../app_system_manage/pages/manage_system_config/ManageSystemConfig.vue"
        ),
    },
    {
      path: "/map",
      name: "settingMap",
      meta: {
        title: "QUẢN LÝ CÀI ĐẶT BẢN ĐỒ",
        icon: "ri-settings-3-line",
        name: "Thiết lập bản đồ",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: "Cài đặt",
      },
      component: () =>
        import(
          "../app_system_manage/pages/manage_map_config/ManageMapConfig.vue"
        ),
    },
    {
      path: "/notification",
      name: "settingNotification",
      meta: {
        title: "QUẢN LÝ CÀI ĐẶT THÔNG BÁO",
        icon: "ri-settings-3-line",
        name: "Thiết lập thông báo",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: 'Cài đặt'},
      component: () =>
        import(
          "@/app_system_manage/pages/manage_notification_config/ManageNotiConfig.vue"
        ),
    },
    {
      path: "/backup",
      name: "settingBackup",
      meta: {
        title: "QUẢN LÝ CẤU HÌNH SAO LƯU",
        icon: "ri-restart-line",
        name: "Thiết lập sao lưu",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: "Cài đặt",
      },
      component: () => import("@/app_system_manage/pages/manage_backup_config/ManageBackupConfig.vue"),
    },
    // {
    //   path: "/mail-template",
    //   name: "settingMailTemp",
    //   meta: {
    //     title: "QUẢN LÝ MẪU EMAIL",
    //     icon: "ri-restart-line",
    //     name: "Thiết lập mẫu email",
    //     showMenu: false,
    //     showNavSubMenu: true,
    //     belongTo: defName,
    //     requiresAuth: true,
    //     cpuiaPermission: true,
    //   },
    //   props: {
    //     nameKCN: "Cài đặt",
    //   },
    //   component: () => import("@/app_system_manage/pages/manage_mail_template_config/ManageMailConfig.vue"),
    // },
    // {
    //   path: "/notification-template",
    //   name: "settingNotiTemp",
    //   meta: {
    //     title: "QUẢN LÝ MẪU THÔNG BÁO",
    //     icon: "ri-restart-line",
    //     name: "Thiết lập mẫu thông báo",
    //     showMenu: false,
    //     showNavSubMenu: true,
    //     belongTo: defName,
    //     requiresAuth: true,
    //     cpuiaPermission: true,
    //   },
    //   props: {
    //     nameKCN: "Cài đặt",
    //   },
    //   component: () => import("@/app_system_manage/pages/manage_noti_template_config/ManageMailConfig.vue"),
    // },
    ...APP_MANAGE_BACKUP_LOG_ROUTER(''),
    {
      path: "/config-menu",
      name: "configMenu",
      meta: {
        title: "CẤU HÌNH MENU",
        icon: "ri-dashboard-line",
        name: "Thiết lập menu",
        showMenu: true,
        showNavSubMenu: true,
        belongTo: "ConfigMenu",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      props: {
        nameKCN: "Cài đặt",
      },
      component: () => import("@/app_system_manage/pages/manage_system_menu/ManageConfigMenu.vue"),
    },
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return ROUTER_DATA_MANAGE;
};
