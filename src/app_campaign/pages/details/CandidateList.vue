<script setup>
import FormManage from "@/base/components/form/builder/FormManage.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const link_api = `[["campaign__id", "exact", "${route.params.id}"]]`;
var base64String = `candidate?filter=${btoa(link_api)}`;
</script>

<template>
  <FormManage title="Chiến dịch tuyển dụng / Hoạt động / ỨNG VIÊN ỨNG TUYỂN" :sourceApi="base64String">
    <!-- <li>
      <div class="dropdown-item">
        <i class="ri-line-chart-line align-bottom me-2 text-muted"></i>
        Quản lý chi tiết
      </div>
    </li> -->
  </FormManage>
</template>
