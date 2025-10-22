<script setup>
import { ref, defineProps } from "vue";
import FormManage from "@/base/components/form/builder/FormManage.vue";
import History from "@/app_system_logs/components/applications/History.vue";

defineProps({
  title: {
    required: true,
  },
  sourceApi: {
    required: true,
  },
  logsApi: {
    required: true,
  },
});

const objId = ref(null);

const handleClickViewContact = ($e) => {
  const temp = $e.target.offsetParent.getAttribute("item");
  if (!temp) return;
  const value = JSON.parse(temp);
  objId.value = value.id;
};
</script>

<template>
  <FormManage
    :title="title"
    :sourceApi="sourceApi"
    no-add
    no-edit
    no-delete
  >
    <li @click="handleClickViewContact">
      <div
        class="dropdown-item"
        data-bs-toggle="offcanvas"
        :data-bs-target="`#offcanvas${logsApi}-history`"
        :aria-controls="`offcanvas${logsApi}-history`"
      >
        <i class="ri-file-list-3-line align-bottom me-2 text-warning"></i>
        Lịch sử chỉnh sửa
      </div>
    </li>
  </FormManage>
  <History :objId="objId" :logsApi="logsApi"> </History>
</template>
