<script setup>
import { ref, onMounted, provide } from "vue";
import { useRoute } from "vue-router";
import Layout from "../../base/layouts/main.vue";
import TabLeftFilter from "../components/TabLeftFilter.vue";
import TabRightAction from "../components/TabRightAction.vue";
import WorkflowBuilder from "../components/tree-workflow/WorkflowBuilder.vue";
import AddStepModal from "../components/modal/AddStepModal.vue";
import API from "@/helpers/api/useAxios.js";

// Lấy ID từ router và gọi hàm load dữ liệu
const route = useRoute();
const WorkflowData = ref({
  id: "",
  str: "",
  steps: [],
  created_date: "",
  updated_date: "",
  is_deleted: false,
  name: "",
  description: "",
  workflow_type: "standard",
  action: "create",
  owner: null,
  application: null,
});

const isLoading = ref(false); // Trạng thái loading

// Hàm để load dữ liệu từ API
async function loadWorkflowData(workflowId = route.params.id) {
  isLoading.value = true; // Bắt đầu tải dữ liệu
  try {
    const response = await API().get(`workflow/w/${workflowId}`);
    WorkflowData.value = response; // Gán dữ liệu từ API vào WorkflowData
  } catch (error) {
    console.error("Failed to load WorkflowData:", error);
  } finally {
    isLoading.value = false; // Kết thúc tải dữ liệu
  }
}

onMounted(() => {
  const workflowId = route.params.id; // Lấy ID từ URL
  if (workflowId) {
    loadWorkflowData(workflowId);
  } else {
    console.error("Workflow ID is missing in the route.");
  }
});

provide("reload-workflow", loadWorkflowData);
</script>

<template>
  <Layout page-layout="horizontal">
    <div class="d-flex" style="gap: 0.7px">
      <TabLeftFilter></TabLeftFilter>
      <div class="flex-grow-1">
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Đang tải dữ liệu...</p>
        </div>
        <WorkflowBuilder
          v-else
          class="ps-5"
          :steps="WorkflowData.steps"
          :name="WorkflowData.str"
        ></WorkflowBuilder>
      </div>
      <TabRightAction></TabRightAction>
    </div>
  </Layout>
  <AddStepModal :steps="WorkflowData.steps" />
</template>
