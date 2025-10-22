<!-- TimeFilter.vue -->
<template>
  <form @submit.prevent="submitFilters">
    <!-- Chọn kiểu lọc -->
    <div class="mb-3">
      <label class="form-label">Kiểu lọc:</label>
      <select
        @change="(e) => emit('update:modelValue', e.target.value)"
        class="form-select"
        required
        :value="props.modelValue"
      >
        <option value="" selected disabled>Loại so sánh</option>
        <!-- <option value="day">Ngày</option> -->
        <!-- <option value="week">Tuần</option> -->
        <option value="month">Tháng</option>
        <option value="quarter">Quý</option>
        <option value="year">Năm</option>
      </select>
    </div>
    <template v-if="props.modelValue">
      <!-- Lặp 2 mốc thời gian -->
      <div class="row mb-3" v-for="(p, idx) in periods" :key="idx">
        <div class="col-12 mb-2">
          <label class="form-label">Chọn {{ p.title }}:</label>
        </div>

        <!-- Ngày -->
        <div v-if="props.modelValue === 'day'" class="col">
          <input type="date" class="form-control" v-model="p.date" required />
        </div>

        <!-- Tuần -->
        <div v-if="props.modelValue === 'week'" class="col">
          <input type="week" class="form-control" v-model="p.week" required />
        </div>

        <!-- Tháng -->
        <template v-if="props.modelValue === 'month'">
          <div class="col">
            <select class="form-select" v-model.number="p.month" required>
              <option disabled selected value="">Tháng</option>
              <option v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
            </select>
          </div>
          <div class="col">
            <select class="form-select" v-model.number="p.year" required>
              <option disabled value="">Năm</option>
              <option v-for="y in years" :key="y" :value="y">
                {{ y }}
              </option>
            </select>
          </div>
        </template>

        <!-- Quý -->
        <template v-if="props.modelValue === 'quarter'">
          <div class="col">
            <select class="form-select" v-model.number="p.quarter" required>
              <option disabled selected value="">Quý</option>
              <option v-for="q in 4" :key="q" :value="q">Quý {{ q }}</option>
            </select>
          </div>
          <div class="col">
            <select class="form-select" v-model.number="p.year" required>
              <option disabled value="">Năm</option>
              <option v-for="y in years" :key="y" :value="y">
                {{ y }}
              </option>
            </select>
          </div>
        </template>

        <!-- Năm -->
        <div v-if="props.modelValue === 'year'" class="col">
          <select class="form-select" v-model.number="p.year" required>
            <option disabled selected value="">Năm</option>
            <option v-for="y in years" :key="y" :value="y">
              {{ y }}
            </option>
          </select>
        </div>
      </div>
    </template>
    <!-- Nút hành động -->
    <div class="d-flex justify-content-end gap-2">
      <button type="button" class="btn btn-light" @click="onCancel">Huỷ</button>
      <button type="submit" class="btn btn-primary">Xem</button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps, watch } from "vue";

const emit = defineEmits(["submitFilters", "cancel", "update:modelValue"]);
const props = defineProps(["modelValue", "filterInfo"]);
const START_YEAR = 2024;

// Mảng chứa 2 mốc thời gian
const periods = ref([
  {
    title: "Thời gian Báo cáo",
    date: "",
    week: "",
    month: null,
    quarter: null,
    year: null,
  },
  {
    title: "Thời gian so sánh",
    date: "",
    week: "",
    month: null,
    quarter: null,
    year: null,
  },
]);

// Danh sách năm từ START_YEAR đến hiện tại
const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - START_YEAR + 1 },
  (_, i) => START_YEAR + i
).reverse();

// Định dạng mốc thời gian tùy theo filterType
function formatPeriod(p) {
  switch (props.modelValue) {
    case "day":
      return p.date;
    case "week":
      return p.week;
    case "month":
      return { month: p.month, year: p.year };
    case "quarter":
      return { quarter: p.quarter, year: p.year };
    case "year":
      return p.year;
    default:
      return null;
  }
}

// Payload động gồm 2 mốc để emit lên parent
const payload = computed(() => ({
  type: props.modelValue,
  period1: formatPeriod(periods.value[0]),
  period2: formatPeriod(periods.value[1]),
}));

// Xử lý submit
function submitFilters() {
  emit("submitFilters", payload.value);
}

// Huỷ filter
function onCancel() {
  setPeriod();
  emit("cancel");
}
const setPeriod = (info = props.filterInfo) => {
  if (!info || !info.type) return;

  // reset trước khi gán
  periods.value.forEach((p) => {
    p.date = "";
    p.week = "";
    p.month = null;
    p.quarter = null;
    p.year = null;
  });

  switch (info.type) {
    case "day":
      periods.value[0].date = info.current;
      periods.value[1].date = info.compare;
      break;

    case "week":
      periods.value[0].week = info.current;
      periods.value[1].week = info.compare;
      break;

    case "month": {
      const [cy, cm] = info.current.split("-").map(Number);
      const [py, pm] = info.compare.split("-").map(Number);
      periods.value[0].year = cy;
      periods.value[0].month = cm;
      periods.value[1].year = py;
      periods.value[1].month = pm;
      break;
    }

    case "quarter": {
      const [cy, cq] = info.current.split("-").map(Number);
      const [py, pq] = info.compare.split("-").map(Number);
      periods.value[0].year = cy;
      periods.value[0].quarter = cq;
      periods.value[1].year = py;
      periods.value[1].quarter = pq;
      break;
    }

    case "year":
      periods.value[0].year = Number(info.current);
      periods.value[1].year = Number(info.compare);
      break;

    default:
      // loại khác nếu có
      break;
  }
};
watch(
  () => props.filterInfo,
  () => {
    setPeriod();
  },
  { immediate: true }
);
</script>
