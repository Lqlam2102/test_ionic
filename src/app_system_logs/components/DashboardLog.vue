<template>
  <div class="p-3">
    <div class="table-responsive table-card">
      <table class="table table-nowrap mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col">Thời gian</th>
            <th scope="col">Loại</th>
            <th scope="col">User</th>
            <th scope="col">Quốc Gia</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Nền tảng</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="isLoading">
            <tr>
              <td colspan="6" class="py-4">
                <div
                  class="d-flex flex-column justify-content-center align-items-center"
                >
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                  </div>
                  <div class="mt-2">Đang tải dữ liệu...</div>
                </div>
              </td>
            </tr>
          </template>
          <template v-else-if="tableData?.results?.length > 0">
            <tr v-for="(item, index) in tableData?.results" :key="index">
              <td>{{ formatVietnamTime(item?.time) }}</td>
              <td>{{ loginLogout(item?.login) }}</td>
              <td class="d-flex align-items-center">
                <i class="ri-user-line fs-16"></i>
                &nbsp;
                {{ item?.user }}
              </td>
              <td>
                {{ item?.country_code }}
              </td>
              <td>{{ statusConfirm(item?.status) }}</td>
              <td>
                {{ JSON.parse(item?.platform) ?? "Nền tảng khác" }}
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="6">
                <div class="text-center text-muted py-5">
                  <i class="ri-information-line fs-24 d-block mb-2"></i>
                  Không có dữ liệu để hiển thị
                </div>
              </td>
            </tr>
          </template>
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

export default {
  name: "Dashboardlog",
  data() {
    return {
      tableData: {
        current_page_number: 1,
        total_pages: 1,
      },
      isLoading: false,
    };
  },
  components: { PaginationUI },

  props: {
    dateStart: String,
    dateEnd: String,
  },
  watch: {
    dateStart() {
      if (this.dateStart && this.dateEnd) {
        this.tableData.current_page_number = 1;
        this.fetchHistory();
      }
    },
    dateEnd() {
      if (this.dateStart && this.dateEnd) {
        this.tableData.current_page_number = 1;
        this.fetchHistory();
      }
    },
  },
  mounted() {
    if (this.dateStart && this.dateEnd) {
      this.fetchHistory();
    }
  },
  methods: {
    async fetchHistory() {
      this.isLoading = true;
      await useFetch(
        API_SERVER_URL +
          "/log-auth/?type&date_start=" +
          this.dateStart +
          "&date_end=" +
          this.dateEnd +
          "&page=" +
          this.tableData.current_page_number +
          "&per_page=10"
      )
        .then((data) => {
          this.tableData = data;
          if (!data.results || data.results.length === 0) {
            this.tableData.current_page_number = 0;
            this.tableData.total_pages = 0;
            return;
          }
        })
        .catch((error) => {
          console.error("Error fetching candidate data:", error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    handleChangePagination(page) {
      this.tableData.current_page_number = page;
      this.fetchHistory();
    },
    formatVietnamTime(utcTime) {
      const date = new Date(utcTime);
      return date.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false,
      });
    },
    loginLogout(login) {
      if (login === true) {
        return "Đăng nhập";
      } else {
        return "Đăng xuất";
      }
    },
    statusConfirm(status) {
      if (status === true) {
        return "Thành công";
      } else {
        return "Thât bại";
      }
    },
  },
};
</script>
