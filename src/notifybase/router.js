export default [
    {
        path: "/notify",
        name: "notifyBase",
        meta: {
            title: "NotifyBase",
            icon: "ri-pages-line",
            name: "NotifyBase",
            showMenu: true,
            showNavSubMenu: false,
            belongTo: "Demo",
            requiresAuth: true,
            cpuiaPermission: true,
        },
        props: {
            nameKCN: "NotifyBase",
        },
        component: () =>
            import("./pages/DemoNotify.vue"),
    }
]