<script setup>
import { reactive, defineProps, defineEmits } from "vue";
import DateInput from "@/base/components/date/date.vue";

const emit = defineEmits(["filter-json"]);
const props = defineProps({
  type: {
    type: String,
  },
});

const laborFields = [
  { key: "total_workers", label: "Tổng số lao động" },
  { key: "active_workers", label: "Đang làm việc" },
  { key: "inactive_workers", label: "Đã nghỉ việc" },
];

const candidateFields = [
  { key: "interviews_today", label: "Phỏng vấn hôm nay" },
  { key: "appointments_today", label: "Lịch hẹn hôm nay" },
];

const filters = reactive({
  total_workers: {
    filter_type: "all",
    selected_year: null,
    selected_month: null,
    compare_with: "none", // <-- mặc định không so sánh
  },
  active_workers: {
    filter_type: "all",
    selected_year: null,
    selected_month: null,
    compare_with: "none",
  },
  inactive_workers: {
    filter_type: "all",
    selected_year: null,
    selected_month: null,
    compare_with: "none",
  },
  interviews_today: {
    compare_with: "exact-date",
    selected_date: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  appointments_today: {
    compare_with: "exact-date",
    selected_date: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
});

function submitFilters() {
  emit("filter-json", filters[props.type]);
}
const handleChangeFilterType = (e, item) => {
  const now = new Date();
  switch (e.target.value) {
    case "year":
      filters[item.key].filter_type = "year";
      filters[item.key].selected_year = null;
      filters[item.key].selected_month = null;
      break;
    case "month":
      filters[item.key].filter_type = "month";
      filters[item.key].selected_year = null;
      filters[item.key].selected_month = null;
      break;
    case "previous_year":
      filters[item.key].filter_type = "year";
      filters[item.key].selected_year = now.getFullYear() - 1;
      filters[item.key].selected_month = null;
      break;
    case "previous_month":
      filters[item.key].filter_type = "month";
      filters[item.key].selected_year = now.getFullYear();
      filters[item.key].selected_month = now.getMonth(); // tháng trước (getMonth() trả về 0-11)
      if (filters[item.key].selected_month === 0) {
        filters[item.key].selected_year = now.getFullYear() - 1;
        filters[item.key].selected_month = 12;
      }
      break;
    default:
      filters[item.key].filter_type = "all";
      filters[item.key].selected_year = null;
      filters[item.key].selected_month = null;
      break;
  }
};
const years = [];

const currentYear = new Date().getFullYear();
for (let y = 2024; y <= currentYear; y++) {
  years.push(y);
}
</script>

<template>
  <form @submit.prevent="submitFilters">
    <template v-for="item in laborFields" :key="item.key">
      <div v-if="item.key == props.type">
        <div class="mb-3 w-100">
          <label>So sánh nhanh:</label>
          <select
            class="form-select"
            v-model="filters[item.key].compare_with"
            @change="(e) => handleChangeFilterType(e, item)"
          >
            <option value="none">Không so sánh</option>
            <option value="previous_year">So với năm trước</option>
            <option value="previous_month">So với tháng trước</option>
            <option value="year">Theo năm</option>
            <option value="month">Theo tháng</option>
          </select>
        </div>
        <div class="d-flex justify-content-between gap-2">
          <div
            class="mb-3 w-100"
            v-if="
              filters[item.key].filter_type === 'year' ||
              filters[item.key].filter_type === 'month'
            "
          >
            <select
              class="form-select"
              v-model="filters[item.key].selected_year"
              required
              :disabled="
                filters[item.key].compare_with !== 'year' &&
                filters[item.key].compare_with !== 'month'
              "
            >
              <option disabled value="">Chọn năm</option>
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div
            class="mb-3 w-100"
            v-if="filters[item.key].filter_type === 'month'"
          >
            <select
              class="form-select"
              v-model="filters[item.key].selected_month"
              required
              placeholder="Chọn tháng"
              :disabled="filters[item.key].compare_with !== 'month'"
            >
              <option value="" disabled>Chọn tháng</option>
              <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
        </div>
      </div>
    </template>

    <template v-for="item in candidateFields" :key="item.key">
      <div v-if="item.key == props.type" class="mb-3">
        <label>Chọn ngày:</label>
        <DateInput v-model="filters[item.key].selected_date" />
      </div>
    </template>

    <div class="d-flex justify-content-end gap-2">
      <button
        v-b-modal.modal__filter--dashboard-form
        class="btn btn-light"
        type="button"
      >
        Huỷ
      </button>
      <button type="submit" class="btn btn-primary">So sánh</button>
    </div>
  </form>
</template>
