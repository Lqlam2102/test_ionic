const ARRROUTER = [
  {
    path: "/",
    name: "ManageReport",
    meta: {
      title: "Báo cáo",
      icon: "ri-settings-3-line",
      name: "Báo cáo",
      showMenu: true,
      showNavSubMenu: true,
      requiresAuth: true,
      cpuiaPermission: true,
    },
    component: () =>
      import(
        "./pages/ManagerReport.vue"
      ),
  },
  {
    path: "/telesale",
    name: "telesaleReportsPage",
    meta: {
      title: "Báo cáo phòng Telesales",
      icon: "ri-book-read-fill",
      name: "Báo cáo phòng Telesales",
      showMenu: true,
      showNavSubMenu: true,
      showListMenu: false,
      requiresAuth: true,
      cpuiaPermission: true,
    },
    component: () =>
      import(
        "./pages/TelesaleReports.vue"
      ),
  },
  {
    path: "/quanly",
    name: "quanlyReportsPage",
    meta: {
      title: "Báo cáo phòng Quản lý",
      icon: "ri-book-read-fill",
      name: "Báo cáo phòng Quản lý",
      showMenu: true,
      showNavSubMenu: true,
      showListMenu: false,
      requiresAuth: true,
      cpuiaPermission: true,
    },
    component: () =>
      import(
        "./pages/HeadOfDepartment.vue"
      ),
  },
];

export default function (path) {
  return ARRROUTER.map((item) => {
    if (path) item.path = "/" + path + item.path;
    return item;
  });
}
