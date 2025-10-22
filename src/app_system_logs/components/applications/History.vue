<template>
  <LayoutRecord
    :defaultFullScreen="true"
    title="Lịch sử chỉnh sửa"
    :id="`${logsApi}-history`"
    @open-offcanvas="openOffcanvasEv"
  >
    <template #body>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Người chỉnh sửa</th>
            <th>Loại chỉnh sửa</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="isLoading">
            <tr>
              <td colspan="4" class="py-4">
                <Searching></Searching>
              </td>
            </tr>
          </template>
          <template v-else-if="logs?.length > 0">
            <template v-for="log in logs" :key="log.id">
              <tr :key="log.id" v-if="isShowLog(log)">
                <td>
                  {{ new Date(log.history_date).toLocaleTimeString() }} -
                  {{ new Date(log.history_date).toLocaleDateString() }}
                </td>
                <td>{{ log.history_user }}</td>
                <td>{{ log.history_type }}</td>
                <td>
                  <template v-if="log.changes">
                    <span
                      v-for="change in log.changes.filter(
                        (c) =>
                          c.field !== 'history_date' && c.field !== 'history_id'
                      )"
                      :key="change.field"
                    >
                      {{ change.verbose_name }}: {{ change.old_value }} →
                      {{ change.new_value }}
                      <br />
                    </span>
                  </template>
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="4" class="py-4">
                <notMatchSearch></notMatchSearch>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <PaginationUI
        @change="handleChangePagination"
        :current-page="tableData.current_page_number"
        :page-size="tableData.total_pages"
      ></PaginationUI>
    </template>
  </LayoutRecord>
</template>

<script setup>
import { defineProps, watch, reactive, ref, computed } from "vue";
import Searching from "@/base/components/search/searching.vue";
import notMatchSearch from "@/base/components/search/notMatchSearch.vue";
import LayoutRecord from "@/app_manage_dynamic_api/layout/record/LayoutRecord.vue";
import { base64Encode } from "@/helpers/utils/stringHandle.js";
import { useFetch } from "@/helpers/api/api.js";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import PaginationUI from "@/app_manage_dynamic_api/components/paging/PaginationUI.vue";

const openOffcanvasEv = () => {
  console.log("openOffcanvasEv");
};

const props = defineProps({
  objId: {
    required: true,
  },
  logsApi: {
    required: true,
  },
});

const tableData = reactive({
  current_page_number: 1,
  total_pages: 1,
  results: [],
});

const logs = computed(() => {
  return tableData.results.filter((log) => isShowLog(log));
});

const isLoading = ref(false);

const isShowLog = (log) => {
  if (log.history_type.toLowerCase() == "tạo mới") {
    return true;
  }
  if (log.changes.length > 0 && log.history_user !== null) {
    return true;
  }
  return false;
};

const handleChangePagination = async (page) => {
  tableData.current_page_number = page;
  const response = await handleGetHistory(page);
  Object.assign(tableData, response);
};

const handleGetHistory = async (page = tableData.current_page_number) => {
  isLoading.value = true;
  try {
    const filter = base64Encode(`[["id","exact","${props.objId}"]]`);
    const response = await useFetch(
      `${API_SERVER_URL}/${props.logsApi}?filter=${filter}&page=${page}&per_page=10`
    );
    return response;
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.objId,
  async (newId) => {
    console.log(newId);
    tableData.current_page_number = 1;
    tableData.total_pages = 1;
    tableData.results = [];
    const response = await handleGetHistory();
    Object.assign(tableData, response);
  }
);
</script>

<style scoped>
.timeline-2::after {
  background: var(--vz-light);
}
</style>
