<script setup>
import { ref, defineProps, watch, computed } from "vue";
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
const departments = ref([]);
const filterType = ref({});
const isLoading = ref(true);
const showFilterModal = ref(false);

// Methods
async function fetchData(filter = filterType.value) {
  if (filter?.filter_type == "all") {
    filter = {};
  }
  const params = new URLSearchParams();
  if (filter?.filter_type) {
    params.append("filter_type", filter.filter_type);
  }

  if (filter?.selected_date) {
    params.append("date", filter.selected_date);
  }
  departments.value = [];
  try {
    const data = await useFetch(
      API_SERVER_URL + `/department-recruitment-stats/?${params.toString()}`
    );
    departments.value = data;
  } catch (error) {
    console.error("Error fetching department data:", error);
  } finally {
    isLoading.value = false;
  }
}
fetchData();

async function setFilter(filter) {
  filterType.value = { ...filter };
  await fetchData(filter);
  showFilterModal.value = false;
}

// Watch reportData prop
watch(
  () => props.reportData,
  () => {
    if (props.reportData["candidates-workers"]) {
      fetchData();
    }
  },
  { deep: true }
);

// Chuỗi hiển thị "Lọc theo"
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
  <BCard no-body class="border p-2 rounded h-100">
    <BCardHeader class="align-items-center d-flex">
      <BCardTitle class="mb-0 flex-grow-1">Bảng xếp hạng tuyển dụng</BCardTitle>
      <div class="flex-shrink-0">
        <div class="dropdown card-header-dropdown">
          <a
            class="text-reset dropdown-btn"
            href="#"
            v-b-modal.modal__filter--department-candidate
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
      <template v-if="isLoading">
        <div colspan="5" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <div class="mt-2">Đang tải dữ liệu...</div>
        </div>
      </template>
      <template v-else-if="departments?.top_caregiver_stats?.length > 0">
        <div
          class="table-responsive"
          data-simplebar
          style="max-height: 350px; overflow-y: auto; overflow-x: hidden"
        >
          <table class="table table-bordered table-nowrap align-middle mb-0">
            <thead>
              <tr>
                <th scope="col" style="width: 30%">Nhân viên</th>
                <th scope="col" style="width: 20%">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) of departments?.top_caregiver_stats"
                :key="index"
              >
                <td>{{ item?.caregiver_name }}</td>
                <td>{{ item?.total_candidates }}</td>
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

    <Modal
      id="modal__filter--department-candidate"
      v-model="showFilterModal"
      title="Lọc bảng xếp hạng tuyển dụng"
      hideFooter
    >
      <FilterDateTime
        @cancel="showFilterModal = false"
        @filter-json="setFilter"
      ></FilterDateTime>
    </Modal>
  </BCard>
</template>
