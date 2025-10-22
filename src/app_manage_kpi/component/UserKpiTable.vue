<template>
  <div class="table-responsive">
    <h4 class="mb-3">{{ props.departmentData.department_name }}</h4>
    <table class="table table-striped table-hover align-middle">
      <thead>
        <tr>
          <th>Nhân sự</th>
          <th>KPI</th>
          <th>Tỉ lệ hoàn thành</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in props.departmentData.users" :key="user.user_id">
          <td>{{ user.user_name }}</td>
          <td>{{ user.kpi }}</td>
          <!-- <td>
            Demo: {{ user.kpi }} / {{ props.departmentData.total_kpi_department }} = {{ calculateCompletionRate(user.kpi, props.departmentData.total_kpi_department) }}%
          </td> -->
          <td>
            <button
              v-if="!props.noDelete"
              @click="onDelete(user?.user_kpi_id)"
              type="button"
              title="Xóa KPI nhân sự"
              class="btn btn-light btn-icon waves-effect waves-light"
            >
              <i class="ri-delete-bin-line text-danger"></i>
            </button>
          </td>
        </tr>
        <tr v-if="!props.departmentData.users.length">
          <td colspan="4" class="text-center text-muted">
            Chưa có dữ liệu nhân sự
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  departmentData: {
    type: Object,
    required: true,
    default: () => ({
      department_name: "",
      campaign_name: "",
      total_kpi_department: 0,
      users: [],
    }),
  },
  noDelete: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["deleteUserKpi"]);

function onDelete(userId) {
  emit("deleteUserKpi", userId);
}

// Tính tỉ lệ hoàn thành KPI
// function calculateCompletionRate(userKpi, totalKpi) {
//   if (totalKpi === 0) return 0;
//   return ((userKpi / totalKpi) * 100).toFixed(2);
// }
</script>

<style scoped>
.table td {
  vertical-align: middle;
}
</style>
