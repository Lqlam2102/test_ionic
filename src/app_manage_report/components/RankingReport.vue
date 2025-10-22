<template>
  <div class="card-header border-0 align-items-center d-flex mt-1">
    <h4
      class="card-title mb-0 flex-grow-1 text-center text-center fw-bold fs-17"
    >
      BÁO CÁO NHÂN SỰ XẾP HẠNG THEO TỔNG SỐ LAO ĐỘNG THUỘC THỜI GIAN BÁO CÁO
    </h4>
  </div>
  <div class="table-responsive mt-1 pb-4 table-card">
    <table
      class="table table-borderless table-centered align-middle table-nowrap mb-0"
    >
      <thead class="text-muted table-light">
        <tr>
          <th v-for="col in displayedColumns" :key="col.label" class="text-center">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, idx) in records" :key="user.user_id || idx">
          <td v-for="col in displayedColumns" :key="col.label" class="text-center">
            {{ col.formatter(user, idx) }}
            <span
              v-if="col.compare && col.changePercent(user) != 0"
              :class="{
                'text-danger': col.changePercent(user) < 0,
                'text-success': col.changePercent(user) >= 0,
              }"
            >
              <i
                class="ri-arrow-right-up-line fs-13 align-middle"
                v-if="col.changePercent(user) > 0"
              ></i>
              <i
                class="ri-arrow-right-down-line fs-13 align-middle"
                v-else-if="col.changePercent(user) < 0"
              ></i>
              {{ col.changePercent(user) }}%</span
            >
            <span
              v-if="
                col.rank &&
                rankChange(col.formatter(user), col.compareRank(user)) != 0
              "
              :class="{
                'text-danger': col.compareRank(user) < col.formatter(user, idx),
                'text-success':
                  col.compareRank(user) >= col.formatter(user, idx),
              }"
            >
              <i
                class="ri-arrow-right-up-line fs-13 align-middle"
                v-if="
                  rankChange(col.formatter(user), col.compareRank(user)) > 0
                "
              ></i>
              <i
                class="ri-arrow-right-down-line fs-13 align-middle"
                v-else-if="
                  rankChange(col.formatter(user), col.compareRank(user)) < 0
                "
              ></i>
              {{ rankChange(col.formatter(user), col.compareRank(user)) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  visibleFields: {
    type: Array,
    default: () => [], // mặc định rỗng => sẽ hiện tất cả
  },
});

const rankChange = (currentRank, compareRank) => {
  return compareRank - currentRank;
};

const records = computed(() => {
  return [...props.data]
    .sort((a, b) => {
      const aCandidates = Number(a.total_appointment?.current) || 0;
      const bCandidates = Number(b.total_appointment?.current) || 0;
      return bCandidates - aCandidates;
    })
    .sort((a, b) => {
      const aCandidates = Number(a.total_workers?.current) || 0;
      const bCandidates = Number(b.total_workers?.current) || 0;
      return bCandidates - aCandidates;
    })
    .sort((a, b) => {
      const aWorkers = Number(a.total_new_workers?.current) || 0;
      const bWorkers = Number(b.total_new_workers?.current) || 0;
      return bWorkers - aWorkers;
    });
});

const compareRecords = computed(() => {
  return [...props.data]
    .sort((a, b) => {
      const aCandidates = Number(a.total_appointment?.compare) || 0;
      const bCandidates = Number(b.total_appointment?.compare) || 0;
      return bCandidates - aCandidates;
    })
    .sort((a, b) => {
      const aCandidates = Number(a.total_workers?.compare) || 0;
      const bCandidates = Number(b.total_workers?.compare) || 0;
      return bCandidates - aCandidates;
    })
    .sort((a, b) => {
      const aWorkers = Number(a.total_new_workers?.compare) || 0;
      const bWorkers = Number(b.total_new_workers?.compare) || 0;
      return bWorkers - aWorkers;
    });
});

// Tạo map user_id -> thứ hạng, xếp theo total_workers.current giảm dần
const rankingMap = computed(() => {
  return records.value
    .slice()
    .sort((a, b) => {
      // Cuối cùng theo total_new_workers.current
      const aNewWorkers = Number(a.total_new_workers?.current) || 0;
      const bNewWorkers = Number(b.total_new_workers?.current) || 0;
      if (bNewWorkers !== aNewWorkers) return bNewWorkers - aNewWorkers;
      // Ưu tiên theo total_appointment.current
      const aCandidates = Number(a.total_appointment?.current) || 0;
      const bCandidates = Number(b.total_appointment?.current) || 0;
      if (bCandidates !== aCandidates) return bCandidates - aCandidates;

      // Tiếp theo theo total_workers.current
      const aWorkers = Number(a.total_workers?.current) || 0;
      const bWorkers = Number(b.total_workers?.current) || 0;
      if (bWorkers !== aWorkers) return bWorkers - aWorkers;
    })
    .reduce((map, u, idx) => {
      map[u.user_id] = idx + 1;
      return map;
    }, {});
});
// Cấu hình cột: label + formatter(user, rowIndex)
const columns = [
  {
    label: "Tên nhân viên",
    formatter: (u) => u.username || "(Không tên)",
  },
  {
    label: "Tổng lao động",
    formatter: (u) => u.total_workers?.current || 0,
  },
  {
    label: "Tổng tuyển mới",
    // nếu prop chưa có trường này, sẽ hiển thị 0
    formatter: (u) => u.total_new_workers?.current || 0,
    compare: true,
    changePercent: (u) => u.total_new_workers?.percent_change || 0,
  },
  {
    label: "Khai thác",
    formatter: (u) => u?.total_source?.current || 0,
  },
  {
    label: "Tổng ứng viên",
    formatter: (u) => u.total_candidates?.current || 0,
    compare: true,
    changePercent: (u) => u.total_candidates?.percent_change || 0,
  },
  {
    label: "Có nhu cầu",
    formatter: (u) => u.total_need?.current || 0,
    compare: true,
    changePercent: (u) => u.total_need?.percent_change || 0,
  },
  {
    label: "Có lịch hẹn",
    formatter: (u) => u.total_appointment?.current || 0,
    compare: true,
    changePercent: (u) => u.total_appointment?.percent_change || 0,
  },
  {
    label: "KLH & KNM",
    formatter: (u) => u.total_klh_knm?.current || 0,
    compare: true,
    changePercent: (u) => u.total_klh_knm?.percent_change || 0,
  },
  {
    label: "Phỏng vấn đạt",
    // giả sử prop là total_interview_passed
    formatter: (u) => u.total_passed_interviews?.current || 0,
    compare: true,
    changePercent: (u) => u.total_passed_interviews?.percent_change || 0,
  },
  {
    label: "Tổng lao động hỗ trợ",
    formatter: (u) => u.total_helped_candidates?.current || 0,
    compare: true,
    changePercent: (u) => u.total_helped_candidates?.percent_change || 0,
  },
  {
    label: "Tổng phút gọi",
    formatter: (u) =>
      Math.round((u.total_callcenter_answer_duration?.current || 0) / 60),
    compare: true,
    changePercent: (u) =>
      u.total_callcenter_answer_duration?.percent_change || 0,
  },
  {
    label: "KPI được giao",
    formatter: (u) => u.total_kpi?.current || 0,
  },
  {
    label: "Tỷ lệ hoàn thành (%)",
    // dùng percent_change của KPI làm ví dụ
    formatter: (u) =>
      u.completed_rate?.current != null ? u.completed_rate.current : 0,
  },
  {
    label: "Xếp hạng",
    formatter: (u) => rankingMap.value[u.user_id] || "-",
    rank: true,
    compareRank: (u) =>
      compareRecords.value.findIndex((val) => val.user_id == u.user_id) + 1,
  },
];

const displayedColumns = computed(() => {
  // nếu không truyền visibleFields, show tất cả
  if (props.visibleFields.length === 0) {
    return columns
  }

  // ngược lại, duyệt theo thứ tự props.visibleFields, tìm trong columns
  return props.visibleFields
    .map(label => columns.find(col => col.label === label))
    .filter(col => col)  // loại bỏ những label không tìm thấy
})

</script>

<style scoped>
.table-card {
  overflow-x: auto;
}
.table th,
.table td {
  vertical-align: middle;
}
</style>
