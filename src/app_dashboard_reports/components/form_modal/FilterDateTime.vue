<script setup>
import { ref, defineEmits } from "vue";
import DateInput from "@/base/components/date/date.vue";

const emit = defineEmits(["filter-json", "cancel"]);

const filter_type = ref("all");
const today = new Date();
const selected_date = ref(today.toISOString().slice(0, 10));
const selected_month = ref(today.getMonth() + 1);
const selected_year = ref(today.getFullYear());
const selected_week = ref(
  today.getFullYear() + "-W" + String(getWeekNumber(today)).padStart(2, "0")
);

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function submitFilters() {
  let resultDate = selected_date.value;
  if (filter_type.value === "month") {
    // Ngày hôm nay của tháng/năm đã chọn
    resultDate = `${selected_year.value}-${String(
      selected_month.value
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  } else if (filter_type.value === "year") {
    // Ngày hôm nay/tháng hôm nay/năm đã chọn
    resultDate = `${selected_year.value}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  } else if (filter_type.value === "week") {
    // Trả về ngày đầu tuần đã chọn
    const [year, week] = selected_week.value.split("-W");
    const firstDayOfYear = new Date(year, 0, 1);
    const weekStart = new Date(
      firstDayOfYear.setDate(firstDayOfYear.getDate() + (week - 1) * 7)
    );
    resultDate = weekStart.toISOString().slice(0, 10);
  }
  emit("filter-json", {
    filter_type: filter_type.value,
    selected_date: resultDate,
  });
}

const handleClickCancel = () => {
  emit("cancel");
};

const years = [];
const currentYear = new Date().getFullYear();
for (let y = 2024; y <= currentYear; y++) {
  years.push(y);
}
</script>

<template>
  <form @submit.prevent="submitFilters">
    <div class="mb-3">
      <label>Kiểu lọc:</label>
      <select class="form-select" v-model="filter_type">
        <option value="all">Tất cả</option>
        <option value="day">Ngày</option>
        <option value="week">Tuần</option>
        <option value="month">Tháng</option>
        <option value="year">Năm</option>
      </select>
    </div>

    <div v-if="filter_type === 'day'" class="mb-3">
      <label>Chọn ngày:</label>
      <DateInput type="date" v-model="selected_date" />
    </div>
    <div v-if="filter_type === 'week'" class="mb-3">
      <label>Chọn tuần:</label>
      <input type="week" class="form-control" v-model="selected_week" />
    </div>
    <div v-if="filter_type === 'month'" class="mb-3 d-flex gap-2">
      <div class="w-100">
        <label>Tháng:</label>
        <select class="form-select" v-model="selected_month">
          <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>
      <div class="w-100">
        <label>Năm:</label>
        <select class="form-select" v-model="selected_year">
          <option :value="null" disabled selected>Chọn năm</option>
          <option v-for="year in years.reverse()" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>
    <div v-if="filter_type === 'year'" class="mb-3">
      <label>Năm:</label>
      <select class="form-select" v-model="selected_year">
        <option :value="null" disabled selected>Chọn năm</option>
        <option v-for="year in years.reverse()" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>

    <div class="d-flex justify-content-end gap-2">
      <button class="btn btn-light" type="button" @click="handleClickCancel">
        Huỷ
      </button>
      <button type="submit" class="btn btn-primary">Xem</button>
    </div>
  </form>
</template>
