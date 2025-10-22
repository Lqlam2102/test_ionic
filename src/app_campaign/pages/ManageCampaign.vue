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
    name: "ManageCampaignDetailsInfor",
    params: { id: value?.id },
  });
};

provide("handle-custom-event-table", [
  {
    type: "TABLEname",
    handle: (item) => {
      router.push({
        name: "ManageCampaignDetailsInfor",
        params: { id: item?.id },
      });
    },
  },
]);
</script>

<template>
  <FormManage title="CHIẾN DỊCH TUYỂN DỤNG" sourceApi="campaign" up-to-top>
    <li @click="handleClickView">
      <div class="dropdown-item">
        <i class="ri-line-chart-line align-bottom me-2 text-success"></i>
        Hoạt động
      </div>
    </li>
  </FormManage>
</template>
