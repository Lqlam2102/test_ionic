const ARRROUTER = [
  {
    path: "/dashboard",
    name: "CallCenterDashboard",
    meta: {
      title: "Trung tâm cuộc gọi",
      icon: "bx bx-bell",
      name: "Dashboard",
      showMenu: true,
      showNavSubMenu: true,
      belongTo: "Demo",
      requiresAuth: true,
      cpuiaPermission: true,
    },
    component: () =>
      import(
        "./pages/Dashboard.vue"
      ),
  }
];

export default function (path) {
  return ARRROUTER.map((item) => {
    if (path) item.path = "/" + path + item.path;
    return item;
  });
}
