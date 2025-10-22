<template>
  <div class="row mb-2">
    <div class="col-sm-auto">
      <div></div>
    </div>
    <div class="col-xs">
      <div class="d-flex justify-content-sm-end">
        <div class="search-box ms-2">
          <TreeSelect
            class="position-relative"
            :api="`${SERVER_URL}/api/organization/${ID_ORGANIZATION}/department/?all`"
            :placeholder="'Chọn phòng ban...'"
            :convert="true"
            @on-selected="() => {}"
          >
          </TreeSelect>
          <i class="ri-search-line search-icon"></i>
        </div>
      </div>
    </div>
  </div>
  <div class="p-3">
    <div class="table-responsive table-card">
      <table class="table table-nowrap mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col">Thời gian liên hệ</th>
            <th scope="col">Tên phiếu ghi</th>
            <th scope="col">NV Chăm sóc</th>
            <th scope="col">Ứng viên</th>
            <th scope="col">Thời lượng cuộc gọi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData?.results" :key="index">
            <td>{{ item?.start_timestamp_str }}</td>
            <td>
              <i
                :class="{
                  'mdi fs-16': true,
                  'text-warning mdi-phone-incoming-outline':
                    isIncomingCall(item),
                  'text-success mdi-phone-outgoing-outline':
                    !isIncomingCall(item),
                }"
              ></i>
              &nbsp;
              {{ item?.name }}
            </td>
            <td>{{ item?.assignee?.str }}</td>
            <td>
              <template v-if="item?.candidate?.id">
                <router-link
                  :to="{
                    name: 'ManageCandidate',
                    query: { candidate_id: item?.candidate?.id },
                  }"
                >
                  {{ item?.candidate?.str }}
                </router-link>
              </template>
              <template v-else>_</template>
            </td>
            <td>{{ item.duration_str }}</td>
          </tr>
        </tbody>
      </table>
      <PaginationUI
        class="mt-1 mb-1"
        @change="handleChangePagination"
        :current-page="tableData.current_page_number"
        :page-size="tableData.total_pages"
      ></PaginationUI>
    </div>
  </div>
</template>

<script>
import { useFetch } from "@/helpers/api/api.js";
import PaginationUI from "@/app_manage_dynamic_api/components/paging/PaginationUI.vue";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import { ID_ORGANIZATION, SERVER_URL } from "@/helpers/utils/config_system";
import TreeSelect from "@/base/components/tree-select/TreeSelect.vue";

export default {
  name: "DashboardTable",
  data() {
    return {
      historyApi: API_SERVER_URL + "/call-center/history",
      tableData: {
        current_page_number: 1,
        total_pages: 1,
      },
      ID_ORGANIZATION,
      SERVER_URL,
    };
  },
  components: { PaginationUI, TreeSelect },
  mounted() {
    this.fetchHistory();
  },
  methods: {
    isIncomingCall(item) {
      return item.call_type === "EXTERNAL_CALL_IN";
    },
    async fetchHistory() {
      await useFetch(
        this.historyApi +
          "?page=" +
          this.tableData.current_page_number +
          "&per_page=10"
      )
        .then((data) => {
          this.tableData = data;
        })
        .catch((error) => {
          console.error("Error fetching candidate data:", error);
        });
    },
    handleChangePagination(page) {
      this.tableData.current_page_number = page;
      this.fetchHistory();
    },
  },
};
</script>
