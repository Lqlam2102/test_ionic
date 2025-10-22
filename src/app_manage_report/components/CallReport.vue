<template>
  <div class="h-100 d-flex flex-column">
    <div class="card-header border-0 align-items-center d-flex">
      <h4 class="card-title mb-0 flex-grow-1 text-center fw-bold fs-17">
        BÁO CÁO GỌI
      </h4>
    </div>
    <!-- Thống kê tổng -->
    <BCardHeader class="p-0 border-0 bg-light-subtle">
      <BRow class="g-0 text-center">
        <BCol v-for="(stat, idx) in stats" :key="idx" cols="6" sm="4">
          <div class="p-3 border border-dashed border-start-0">
            <h5 class="mb-1" :class="stat.textClass">
              <span class="counter-value">
                {{ stat.value().toLocaleString() }}
              </span>
              <template v-if="stat.suffix">{{ stat.suffix }}</template>
            </h5>
            <p class="text-muted mb-0 text-nowrap">{{ stat.label }}</p>
          </div>
        </BCol>
      </BRow>
    </BCardHeader>

    <BCardBody class="p-0 pb-2 flex-1 overflow-auto">
      <div class="w-100">
        <table
          class="table table-borderless table-centered align-middle table-nowrap mb-0"
        >
          <thead class="text-muted table-light">
            <tr>
              <th v-for="col in columns" :key="col.label">
                {{ col.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, row) in topUsers" :key="row">
              <td v-for="col in columns" :key="col.label">
                {{ col.formatter(user, row) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BCardBody>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  total_call_out_answer_duration: Object,
  total_call_in_answer_duration: Object,
  total_answer_duration: Object,
  top_users: Array,
});

// Tính giá trị hiển thị
const totalCallOut = computed(() =>
  props.top_users.reduce((s, u) => s + u.total_call_out.current, 0)
);
const totalCallIn = computed(() =>
  props.top_users.reduce((s, u) => s + u.total_call_in.current, 0)
);
const totalMinutes = computed(() =>
  Math.round((props.total_answer_duration?.current ?? 0) / 60)
);

// Mảng cho phần thống kê
const stats = [
  {
    label: "Tổng cuộc gọi ra",
    value: () => totalCallOut.value,
    suffix: "",
    textClass: "",
  },
  {
    label: "Tổng cuộc gọi vào",
    value: () => totalCallIn.value,
    suffix: "",
    textClass: "",
  },
  {
    label: "Tổng phút gọi",
    value: () => totalMinutes.value,
    suffix: "",
    textClass: "text-success",
  },
];

// Mảng cấu hình cột bảng
const columns = [
  {
    label: "STT",
    formatter: (_, i) => i + 1,
  },
  {
    label: "Tên thành viên",
    formatter: (user) => user.assignee_username || "(Chưa phân công)",
  },
  {
    label: "Tổng gọi ra",
    formatter: (user) => user.total_call_out.current,
  },
  {
    label: "Tổng gọi vào",
    formatter: (user) => user.total_call_in.current,
  },
  {
    label: "Tổng phút gọi",
    formatter: (user) => Math.round(user.total_answer_duration.current / 60),
  },
];

const topUsers = computed(() => props.top_users);
</script>
