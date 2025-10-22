<script setup>
// import { ref } from "vue";
import FormManage from "@/base/components/form/builder/FormManage.vue";

// const handleClickViewContact = ($e) => {
//   const temp = $e.target.offsetParent.getAttribute("item");
//   if (!temp) return;
//   const value = JSON.parse(temp);
//   console.log(value);
// };
</script>

<template>
  <FormManage title="Logs ứng viên" sourceApi="logs-candidate">
    <!-- <li @click="handleClickViewContact">
      <div
        class="dropdown-item"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvascontact-history"
        aria-controls="offcanvascontact-history"
      >
        <i class="ri-line-chart-line align-bottom me-2 text-muted"></i>
        Lịch sử liên hệ
      </div>
    </li> -->
  </FormManage>
</template>
