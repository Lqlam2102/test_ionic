const ARRROUTER = [
  {
    path: "/candidate-forms",
    name: "CandidateForms",
    meta: {
      title: "Mẫu đăng kí thông tin ứng viên",
      icon: "bx bx-bell",
      name: "Mẫu đăng kí thông tin ứng viên",
    },
    component: () =>
      import(
        "./pages/DtwinForms.vue"
      ),
  },
  {
    path: "/campaign/:id",
    name: "PublicCampaignDetails",
    component: () =>
      import(
        "./pages/PublicCampaign.vue"
      ),
  },
];

export default function (path) {
  return ARRROUTER.map((item) => {
    if (path) item.path = "/" + path + item.path;
    return item;
  });
}
