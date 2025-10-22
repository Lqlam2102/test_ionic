
export default (url_root) => {
  const defName = "systemManage"
  const ROUTER_DATA_MANAGE = [
    {
      path: "/manage/campaign",
      name: "ManageCampaign",
      meta: {
        title: "Quản lý chiến dịch",
        icon: "ri-flag-2-fill",
        name: "Quản lý chiến dịch",
        showMenu: true,
        showNavSubMenu: false,
        showListMenu: true,
        belongTo: defName,
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/ManageCampaign.vue"
        ),
    },
    {
      path: "/manage/details/campaign/:id",
      name: "ManageCampaignDetails",
      meta: {
        title: "Thống kê",
        icon: "bx bx-bell",
        name: "Thống kê",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: "Campaign",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/details/DashboadCampaign.vue"
        ),
    },
    {
      path: "/manage/details/campaign/:id/infor",
      name: "ManageCampaignDetailsInfor",
      meta: {
        title: "Chiến dịch",
        icon: "ri-flag-2-fill",
        name: "Thông tin chi tiết",
        showMenu: true,
        showNavSubMenu: true,
        belongTo: "Campaign",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/details/CampaignInfor.vue"
        ),
    },
    {
      path: "/manage/details/campaign/:id/list-campaign",
      name: "ManageCampaignDetailsCampaigns",
      meta: {
        title: "Ứng viên ứng tuyển",
        icon: "bx bx-bell",
        name: "Ứng viên ứng tuyển",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: "Campaign",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/details/CandidateList.vue"
        ),
    },
    // {
    //   path: "/manage/details/campaign/:id/vendor",
    //   name: "ManageCampaignDetailsVendor",
    //   meta: {
    //     title: "Đối tác",
    //     icon: "bx bx-bell",
    //     name: "Đối tác",
    //     showMenu: false,
    //     showNavSubMenu: true,
    //     belongTo: "Campaign",
    //     requiresAuth: true,
    //     cpuiaPermission: true,
    //   },
    //   component: () =>
    //     import(
    //       "./pages/details/VendorList.vue"
    //     ),
    // },
    {
      path: "/manage/details/campaign/:id/share",
      name: "ManageCampaignDetailsShare",
      meta: {
        title: "Mã giới thiệu",
        icon: "bx bx-bell",
        name: "Mã giới thiệu",
        showMenu: false,
        showNavSubMenu: true,
        belongTo: "Campaign",
        requiresAuth: true,
        cpuiaPermission: true,
      },
      component: () =>
        import(
          "./pages/details/ShareCampaign.vue"
        ),
    }
  ];

  ROUTER_DATA_MANAGE.map((router) => {
    router.path = url_root ? "/" + url_root + router.path : router.path;
  });
  return [...ROUTER_DATA_MANAGE];
};
