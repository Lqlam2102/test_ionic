<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import API from "@/helpers/api/useAxios.js";
import TopbarHeaderPortal from "../../base/layouts/landing/TopbarHeaderPortal.vue";


const loading = ref(false);
const search = ref("");
const reportTypes = ref([]); // sẽ gán từ API

const router = useRouter();
// Hàm điều hướng theo số lượng phần tử
const goByLength = (list) => {
  const len = list.length;
  if (len === 1) {
    const only = list[0];
    router.replace({ name: `${only.id}ReportsPage` });
  } else if (len === 0) {
    router.replace({ name: "403Page" });
  }
};

const loadOverview = async () => {
  loading.value = true;
  try {
    const { report_types } = await API().get(`report/overview`);
    // Tùy cấu trúc API trả về, chỉnh lại key phù hợp:
    // ví dụ data.report_types hoặc data.record_types
    reportTypes.value = report_types ?? [];
    goByLength(reportTypes.value);
  } catch (err) {
    console.error(err);
    // Tùy nhu cầu: có thể điều hướng sang trang lỗi
    // router.replace({ name: "Error" });
  } finally {
    loading.value = false;
  }
};
// Chuẩn hóa chuỗi để so khớp không dấu, không phân biệt hoa/thường
const normalize = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();

// Computed: danh sách sau khi lọc theo từ khóa
const filteredReportTypes = computed(() => {
  const q = normalize(search.value);
  if (!q) return reportTypes.value;
  return reportTypes.value.filter((r) => {
    const name = normalize(r.name);
    const id = normalize(r.id);
    return name.includes(q) || id.includes(q);
  });
});

// const handleClickReport = (_report) => {
//   router.replace({
//     name: `${_report.id}ReportsPage`,
//     query: { refresh: Date.now().toString() },
//   });
// };
loadOverview();
</script>
<template>
  <TopbarHeaderPortal></TopbarHeaderPortal>
  <div
    class="mb-0 card flex-grow-1 position-fixed"
    style="overflow: hidden auto; inset: 0; z-index: -1"
  >
    <div class="file-manager-content pb-0 w-100 h-100 position-relative">
      <div class="row position-absolute" style="inset: 0; top: 20%">
        <div class="col-3"></div>

        <div class="col-12 col-md-6">
          <div class="">
            <div class="card-header align-items-center d-flex">
              <div class="rounded w-100">
                <div class="row g-2">
                  <div class="col-12">
                    <h1>Chọn mẫu báo cáo:</h1>
                  </div>
                  <div class="col-lg">
                    <div class="search-box">
                      <input
                        type="text"
                        v-model="search"
                        class="form-control search"
                        placeholder="Tìm kiếm mẫu báo cáo"
                        :disabled="loading"
                      />
                      <i class="ri-search-line search-icon"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-body">
              <div class="live-preview">
                <!-- Loading -->
                <div v-if="loading" class="d-flex justify-content-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>

                <!-- Danh sách -->
                <div v-else class="list-group">
                  <router-link :to="{name: `${report.id}ReportsPage`}"
                    v-for="report in filteredReportTypes"
                    :key="report.id"
                    class="btn btn-ghost-danger list-group-item text-start mb-2"
                    style="border: 1px solid #f06548ad"
                  >
                    {{ report.name }}
                    <!-- <i class="ri-gradienter-line"></i> -->
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-3"></div>
      </div>
    </div>
  </div>
</template>
