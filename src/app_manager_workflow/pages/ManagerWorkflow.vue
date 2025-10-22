<script setup>
import { useRouter } from "vue-router";
import FormManage from "@/base/components/form/builder/FormManage.vue";
import { provide } from "vue";

const router = useRouter();
const handleClickView = ($e) => {
  const temp = $e.target.offsetParent.getAttribute("item");
  if (!temp) return;
  const value = JSON.parse(temp);
  router.push({
    name: "ManageWorkflowDetail",
    params: { id: value?.id },
  });
};

provide("handle-custom-event-table", [
  {
    type: "TABLEname",
    handle: (item) => {
      router.push({
        name: "ManageWorkflowDetail",
        params: { id: item?.id },
      });
    },
  },
]);
</script>

<template>
  <FormManage title="Quy trình" sourceApi="workflow/w" no-add no-edit no-view>
    <li @click="handleClickView">
      <div class="dropdown-item">
        <i class="ri-line-chart-line align-bottom me-2 text-muted"></i>
        Xây dựng quy trình
      </div>
    </li>
  </FormManage>
</template>
