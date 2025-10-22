import NotifyBaseRoute from "@/notifybase/router.js"

const ARRROUTER = [
  ...NotifyBaseRoute,
  {
    path: "/form",
    name: "FormDemo",
    meta: {
      title: "Form Demo",
      icon: "bx bx-bell",
      name: "Form Demo",
      showMenu: false,
      showNavSubMenu: true,
      belongTo: "Demo",
      requiresAuth: true,
      cpuiaPermission: true,
    },
    component: () =>
      import(
        "./pages/DemoForm.vue"
      ),
  },
  {
    path: "/formoffcanvas",
    name: "FormOffcanvas",
    meta: {
      title: "Form Demo",
      icon: "bx bx-bell",
      name: "Form Demo",
      showMenu: false,
      showNavSubMenu: true,
      belongTo: "Demo",
      requiresAuth: true,
      cpuiaPermission: true,
    },
    component: () =>
      import(
        "./pages/ManageCustomer.vue"
      ),
  },
  {
    path: "/range",
    name: "DemoRange",
    meta: {
      title: "Range Demo",
      icon: "bx bx-bell",
      name: "Range Demo",
      showMenu: false,
      showNavSubMenu: true,
      belongTo: "Demo",
      requiresAuth: true,
      cpuiaPermission: true,
    },
    component: () =>
      import(
        "./pages/DemoRange.vue"
      ),
  },
  {
    path: "/callcenter",
    name: "DemoCallCenter",
    meta: {
      title: "DemoCallCenter",
      icon: "bx bx-bell",
      name: "DemoCallCenter",
      showMenu: false,
      showNavSubMenu: true,
      belongTo: "Demo",
      requiresAuth: true,
      cpuiaPermission: true,
    },
    component: () =>
      import(
        "./pages/callcenter/pages/ManageCandidate.vue"
      ),
  },
  {
    path: "/callcenter-2",
    name: "DemoCallCenter2",
    meta: {
      title: "DemoCallCenter2",
      icon: "bx bx-bell",
      name: "DemoCallCenter2",
      showMenu: false,
      showNavSubMenu: true,
      belongTo: "Demo",
      requiresAuth: true,
      cpuiaPermission: true,
    },
    component: () =>
      import(
        "./pages/DemoCallCenter.vue"
      ),
  },
  {
    path: "/callcenter-3",
    name: "DemoCallCenter33",
    meta: {
      title: "DemoCallCenter33",
      icon: "bx bx-bell",
      name: "DemoCallCenter33",
      showMenu: false,
      showNavSubMenu: true,
      belongTo: "Demo",
      requiresAuth: true,
      cpuiaPermission: true,
    },
    component: () =>
      import(
        "./pages/DemoCallCenter2.vue"
      ),
  },
  {
    path: "/realtime-report",
    name: "DemoRealTimeReport",
    meta: {
      title: "DemoRealTimeReport",
      icon: "bx bx-bell",
      name: "DemoRealTimeReport",
      showMenu: false,
      showNavSubMenu: true,
      belongTo: "Demo",
      requiresAuth: true,
      cpuiaPermission: true,
    },
    component: () =>
      import(
        "./pages/RealTimeReport.vue"
      ),
  },
  {
    path: "/chart",
    name: "DemoChartReport",
    meta: {
      title: "DemoChartReport",
      icon: "bx bx-bell",
      name: "DemoChartReport",
      showMenu: false,
      showNavSubMenu: true,
      belongTo: "Demo",
      requiresAuth: true,
      cpuiaPermission: true,
    },
    component: () =>
      import(
        "./pages/DemoChart.vue"
      ),
  },
  {
    path: "/work-flow",
    name: "DemoWorkFlow",
    meta: {
      title: "DemoWorkFlow",
      icon: "bx bx-bell",
      name: "DemoWorkFlow",
      showMenu: false,
      showNavSubMenu: true,
      belongTo: "Demo",
      requiresAuth: true,
      cpuiaPermission: true,
    },
    component: () =>
      import(
        "../app_manager_workflow/pages/ManageCustomerCare.vue"
      ),
  },

];

export default function (path) {
  return ARRROUTER.map((item) => {
    if (path) item.path = "/" + path + item.path;
    return item;
  });
}
