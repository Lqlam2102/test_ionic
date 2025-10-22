<script setup>
import { ref, reactive, defineProps, watch, computed } from "vue";
import { useFetch } from "@/helpers/api/api.js";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import FilterDateTime from "./form_modal/FilterDateTime.vue";
import Modal from "@/base/components/dtwinUI/Modal.vue";

// Props
const props = defineProps({
  reportData: {
    type: Object,
    default: () => ({}),
  },
});

// State
const tableData = reactive({
  current_page_number: 1,
  total_pages: 1,
  department_recruitment_stats: [],
});
const isLoading = ref(true);
const filterType = ref({});
const isDepartmentAccess = ref(false);
// Methods
async function fetchHistory(filter = filterType.value) {
  if (filter?.filter_type == "all") {
    filter = {};
  }
  const params = new URLSearchParams({
    page: tableData.current_page_number,
  });

  if (filter?.filter_type) {
    params.append("filter_type", filter.filter_type);
  }
  if (filter?.selected_date) {
    params.append("date", filter.selected_date);
  }
  try {
    const data = await useFetch(
      `${API_SERVER_URL}/department-recruitment-stats/?${params.toString()}`
    );
    Object.assign(tableData, data);
    isDepartmentAccess.value = data.department_access || false;
    if (
      !data.department_recruitment_stats ||
      data.department_recruitment_stats.length === 0
    ) {
      tableData.current_page_number = 0;
      tableData.total_pages = 0;
    }
  } catch (error) {
    console.error("Error fetching candidate data:", error);
  }
  isLoading.value = false;
}
fetchHistory();

const showFilterModal = ref(false);

async function setFilter(filter) {
  tableData.current_page_number = 1;
  filterType.value = { ...filter };
  await fetchHistory(filter);
  showFilterModal.value = false;
}
// Watch reportData prop
watch(
  () => props.reportData,
  () => {
    if (props.reportData["department-candidates-stats"]) {
      fetchHistory();
    }
  },
  { deep: true }
);

const filterLabel = computed(() => {
  if (!filterType.value.filter_type || !filterType.value.selected_date)
    return "Tất cả";
  switch (filterType.value.filter_type) {
    case "date":
    case "day":
      return `Ngày: ${filterType.value.selected_date}`;
    case "month": {
      const [year, month] = filterType.value.selected_date.split("-");
      return `Tháng: ${month}/${year}`;
    }
    case "year":
      return `Năm: ${filterType.value.selected_date.split("-")[0]}`;
    case "week":
      if (filterType.value.selected_week) {
        const [year, week] = filterType.value.selected_week.split("-W");
        return `Tuần: ${week}/${year}`;
      }
      return "Tuần";
    default:
      return "Tất cả";
  }
});
</script>

<template>
  <BCard no-body class="border p-2 rounded h-100 mb-1">
    <BCardHeader class="align-items-center d-flex">
      <BCardTitle class="mb-0 flex-grow-1">Ứng viên</BCardTitle>
      <div class="flex-shrink-0">
        <div class="dropdown card-header-dropdown">
          <a
            class="text-reset dropdown-btn"
            href="#"
            v-b-modal.modal__filter--candidate-worker
            @click.prevent="showFilterModal = true"
          >
            <span class="fw-semibold text-uppercase fs-12">Lọc theo: </span>
            <span class="text-muted">
              {{ filterLabel }}
              <i class="mdi mdi-chevron-down ms-1"></i>
            </span>
          </a>
        </div>
      </div>
    </BCardHeader>

    <BCardBody>
      <div class="table-responsive table-card">
        <table
          class="table table-borderless table-hover table-nowrap align-middle mb-0"
        >
          <thead class="table-light">
            <tr class="text-muted">
              <th scope="col">
                <span v-if="isDepartmentAccess">Nhân viên</span>
                <span v-else>Phòng ban</span>
              </th>
              <th scope="col">Tổng ứng viên</th>
              <th scope="col">Có nhu cầu</th>
              <th scope="col">Có lịch hẹn</th>
              <th scope="col">Đăng ký phỏng vấn</th>
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
            <template
              v-else-if="tableData?.department_recruitment_stats?.length > 0"
            >
              <tr
                v-for="(
                  item, index
                ) in tableData.department_recruitment_stats.slice(0, 7)"
                :key="index"
              >
                <td>{{ item?.department_name }}</td>
                <td>{{ item?.total_candidates }}</td>
                <td>
                  {{ item?.has_demand_count }} |
                  {{ item?.has_demand_percentage }}%
                </td>
                <td>
                  {{ item?.has_appointment_count }} |
                  {{ item?.has_appointment_percentage }}%
                </td>
                <td>
                  {{ item?.interview_registered_count }} |
                  {{ item?.interview_registered_percentage }}%
                </td>
              </tr>
              <!-- <tr
                v-for="(item, index) of tableData?.department_recruitment_stats"
                :key="index"
              >
              </tr> -->
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
      </div>
    </BCardBody>
  </BCard>
  <Modal
    id="modal__filter--candidate-worker"
    v-model="showFilterModal"
    title="Lọc ứng viên"
    hideFooter
  >
    <FilterDateTime
      @cancel="showFilterModal = false"
      @filter-json="setFilter"
    ></FilterDateTime>
  </Modal>
</template>
