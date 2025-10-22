<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  campaignData: {
    type: Object,
    required: true,
    default: () => ({
      campaign_name: "",
      total_kpi: 0,
      departments: [],
    }),
  },
  noDelete: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["deleteKpi"]);

// Khi người dùng click Xóa
function onDelete(deptKpiId) {
  // emit lên parent để gọi API hoặc xử lý tiếp
  emit("deleteKpi", deptKpiId);
}

// Tính tỉ lệ hoàn thành
// function calculateCompletionRate(kpi, totalKpi) {
//   return totalKpi ? ((kpi / totalKpi) * 100).toFixed(2) : 0;
// }
</script>

<style scoped>
.table td {
  vertical-align: middle;
}
</style>

<template>
  <div class="table-responsive">
    <table class="table table-striped table-hover align-middle">
      <thead>
        <tr>
          <th>Phòng ban</th>
          <th>KPI</th>
          <th>Tỉ lệ hoàn thành</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="dept in props.campaignData.departments"
          :key="dept.dept_kpi_id"
        >
          <td>{{ dept.department_name }}</td>
          <td>{{ dept.kpi }}</td>
          <!-- <td>
            Demo: {{ calculateCompletionRate(dept.kpi, props.campaignData.total_kpi) }}%
          </td> -->
          <td>
            <button
              v-if="!props.noDelete"
              @click="onDelete(dept.dept_kpi_id)"
              type="button"
              title="Xóa KPI"
              class="btn btn-light btn-icon waves-effect waves-light"
            >
              <i class="ri-delete-bin-fill text-danger"></i>
            </button>
          </td>
        </tr>
        <tr v-if="!campaignData.departments.length">
          <td colspan="4" class="text-center text-muted">Chưa có dữ liệu</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
