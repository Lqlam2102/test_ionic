<script>
import { useFetch } from "@/helpers/api/api.js";
import { API_SERVER_URL } from "@/base/store/api/server_api";
export default {
  data() {
    return {
      departments: [],
      isLoading: true,
    };
  },
  props: {
    reportData: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    reportData: {
      handler(newData) {
        // Cập nhật biểu đồ khi có dữ liệu mới
        this.fecthData(newData);
      },
      deep: true,
    },
  },
  async mounted() {
    this.fecthData();
  },
  methods: {
    fecthData() {
      this.isLoading = true;
      useFetch(API_SERVER_URL + "/v1/department-workers-stats/").then(
        (data) => {
          if (Array.isArray(data) && data.length > 0) {
            // Vừa là mảng, vừa không rỗng
            data.sort(
              (a, b) =>
                (b.successful_candidates ?? 0) - (a.successful_candidates ?? 0)
            );
            this.departments = data;
          }
        }
      );
      this.isLoading = false;
    },
  },
};
</script>

<template>
  <BCard no-body class="border p-2 rounded h-100">
    <BCardHeader class="align-items-center d-flex py-0">
      <BCardTitle class="mb-0 flex-grow-1"
        >Số lao động đang làm theo phòng ban</BCardTitle
      >
      <div class="flex-shrink-0">
        <BDropdown
          variant="link"
          class="card-header-dropdown"
          toggle-class="text-reset dropdown-btn arrow-none"
          menu-class="dropdown-menu-end"
          aria-haspopup="true"
          :offset="{ alignmentAxis: 25, crossAxis: 0, mainAxis: 0 }"
        >
        </BDropdown>
      </div>
    </BCardHeader>

    <BCardBody>
      <template v-if="isLoading">
        <div colspan="5" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <div class="mt-2">Đang tải dữ liệu...</div>
        </div>
      </template>
      <template v-else-if="departments?.length > 0">
        <div class="table-responsive" data-simplebar style="max-height: 350px">
          <table class="table table-bordered table-nowrap align-middle mb-0">
            <thead>
              <tr>
                <th scope="col" style="width: 10%">STT</th>
                <th scope="col" style="width: 30%">Phòng</th>
                <th scope="col" style="width: 20%">Số lượng</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) of this.departments" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item?.department_name }}</td>
                <td>{{ item?.total_workers }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>
        <div class="text-center text-muted py-5">
          <i class="ri-information-line fs-24 d-block mb-2"></i>
          Không có dữ liệu để hiển thị
        </div>
      </template>
    </BCardBody>
  </BCard>
</template>
