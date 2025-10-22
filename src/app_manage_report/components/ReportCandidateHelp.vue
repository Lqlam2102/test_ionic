<template>
  <div class="h-100 d-flex flex-column">
    <!-- Tiêu đề -->
    <div class="card-header border-0 align-items-center d-flex">
      <h4 class="card-title mb-0 flex-grow-1 text-center fw-bold fs-17">
        BÁO CÁO HỖ TRỢ LAO ĐỘNG
      </h4>
    </div>

    <!-- Thống kê tổng -->
    <BCardHeader class="p-0 border-0 bg-light-subtle">
      <BRow class="g-0 text-center">
        <!-- Tổng hỗ trợ lao động -->
        <BCol cols="6" sm="6" class="p-3">
          <h5 class="mb-1">
            <span class="counter-value">
              {{ totalHelped.toLocaleString() }}
            </span>
          </h5>
          <p class="text-muted mb-0">Tổng hỗ trợ lao động</p>
        </BCol>

        <!-- Phần trăm thay đổi -->
        <BCol cols="6" sm="6" class="p-3 border-start">
          <h5
            class="mb-1"
            :class="{
              'text-success': totalPercent >= 0,
              'text-danger': totalPercent < 0
            }"
          >
            <i
              class="ri-arrow-right-up-line align-middle me-1"
              v-if="totalPercent > 0"
            />
            <i
              class="ri-arrow-right-down-line align-middle me-1"
              v-else-if="totalPercent < 0"
            />
            {{ totalPercent }}%
          </h5>
          <p class="text-muted mb-0">So với kỳ trước</p>
        </BCol>
      </BRow>
    </BCardHeader>

    <!-- Bảng top users -->
    <BCardBody class="p-0 pb-2 flex-1 overflow-auto">
      <div class="w-100">
        <table
          class="table table-borderless table-centered align-middle table-nowrap mb-0"
        >
          <thead class="text-muted table-light">
            <tr>
              <th class="text-center">STT</th>
              <th class="text-center">Tên thành viên</th>
              <th class="text-center">Số lao động hỗ trợ</th>
              <th class="text-center">Thay đổi (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(u, i) in topUsers"
              :key="u.updated_by__username + i"
            >
              <!-- STT -->
              <td class="text-center">{{ i + 1 }}</td>

              <!-- Username -->
              <td class="text-center">{{ u.updated_by__username }}</td>

              <!-- Current -->
              <td class="text-center">
                {{ u.total_candidate_helped.current || 0 }}
              </td>

              <!-- Percent change -->
              <td
                class="text-center"
                :class="{
                  'text-success': u.total_candidate_helped.percent_change >= 0,
                  'text-danger': u.total_candidate_helped.percent_change < 0
                }"
              >
                <i
                  class="ri-arrow-right-up-line me-1"
                  v-if="u.total_candidate_helped.percent_change > 0"
                />
                <i
                  class="ri-arrow-right-down-line me-1"
                  v-else-if="u.total_candidate_helped.percent_change < 0"
                />
                {{ u.total_candidate_helped.percent_change }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BCardBody>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  candidate_helped: {
    type: Object,
    default: () => ({
      total_candidate_helped: {
        current: 0,
        compare: 0,
        percent_change: 0,
      },
      top_users: [],
    }),
  },
});

// Tổng số hỗ trợ lao động kỳ hiện tại
const totalHelped = computed(
  () => props.candidate_helped.total_candidate_helped.current || 0
);

// Phần trăm thay đổi so với kỳ trước
const totalPercent = computed(
  () => props.candidate_helped.total_candidate_helped.percent_change || 0
);

// Danh sách người hỗ trợ hàng đầu
const topUsers = computed(() => props.candidate_helped.top_users || []);
</script>

<style scoped>
/* nếu cần custom thêm, ví dụ tăng khoảng cách giữa các ô */
.table td,
.table th {
  padding: 0.75rem 1rem;
}
</style>
