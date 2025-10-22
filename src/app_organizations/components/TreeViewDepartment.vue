<template>
  <div ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, nextTick, defineProps, computed } from "vue";
import ApexTree from "apextree";
import { CompanyInfor } from "@/helpers/user/company";

const props = defineProps({
  tree: { type: Object, required: true },
});

const chartContainer = ref(null);
const data = computed(() => {
  return convertDepartmentsToTree(props.tree);
});
const options = {
  contentKey: "data",
  width: "100%",
  height: "500",
  nodeWidth: 300,
  nodeHeight: 200,
  fontColor: "#405189",
  borderRadius: 4,
  borderColor: "#f3f6f9",
  childrenSpacing: 50,
  siblingSpacing: 20,
  direction: "top",
  enableExpandCollapse: true,
  nodeTemplate: (content) =>
    `<div class="bg-transparent card h-100">
      <div class="border-bottom-outset bg-transparent card-header fs-16 fw-bold text-center">${content?.name}</div>
      <div class="align-items-center card-body d-flex gap-3">
          <div class="flex-shrink-0">
              <img src='${content?.imageURL}' alt="" class="avatar-md rounded-circle">
          </div>
          <div class="flex-grow-1">
              <h5 class="card-title fw-bold mb-1">${content?.manager_name}</h5>
              <p class="text-muted mb-0">${content?.manager_title}</p>
          </div>
      </div>
      </div>`,
  canvasStyle: "border: 1px solid black;background: #f6f6f6;",
  enableToolbar: true,
};

onMounted(() => {
  nextTick(() => {
    if (chartContainer.value) {
      const tree = new ApexTree(chartContainer.value, options);
      tree.render(data.value);
    } else {
      console.error("Element #svg-tree not found in the DOM.");
    }
  });
});
function convertDepartmentsToTree(departments) {
  return {
    id: "root",
    data: {
      name: CompanyInfor.value?.name ?? "metadatawin",
      imageURL:
        CompanyInfor.value?.photo ??
        require("@/assets/images/logo/metadatawin.png"),
      manager_name: CompanyInfor.value?.representative ?? "Giám Đốc",
      manager_title: CompanyInfor.value?.representative_title ?? "Quản lý",
    },
    options: {
      nodeBGColor: "#f3f6f9",
      nodeBGColorHover: "#f3f6f9",
    },
    children: Object.values(departments).map((dept) => ({
      id: dept.id,
      data: {
        name: dept.str,
        imageURL:
          dept.department_head?.photo ??
          require("@/assets/images/logo/metadatawin.png"),
        manager_name: dept.department_head?.username ?? "Quản lý",
        manager_title: dept.department_head?.user_role?.name ?? "Trưởng phòng",
      },
      options: {
        nodeBGColor: "#fff",
        nodeBGColorHover: "#fff",
      },
      children: dept.children
        ? convertDepartmentsToTree(dept.children).children
        : [],
    })),
  };
}
</script>

<style>
#apexTreeWrapper svg {
  border: none !important;
}
</style>
