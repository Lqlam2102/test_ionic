<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import API from "@/app_manage_dynamic_api/helper/api/useAxios";
import Layout from "@/app_manage_dynamic_api/layout/main.vue";
import VueApexCharts from "vue3-apexcharts";

const route = useRoute();
// Dữ liệu mẫu
const data = ref({
  id: "",
  str: "",
  status_display: "",
  number_of_admitted: 0,
  photo: null,
  manager: [],
  customer: {},
  qr_code: "",
  qr_get_form: "",
  created_date: "",
  updated_date: "",
  name: "",
  type: {},
  short_description: "",
  description: "",
  link_map: null,
  video: null,
  start_date: "",
  end_date: "",
  is_paused: false,
  number_needed: 0,
  skills: null,
  recruitment_position: null,
  about_age: "",
  salary: "",
  custom_fields: [],
  distribution: [],
  created_by: "",
  updated_by: "",
  owner: null,
  type_display: "",
  manger_display: "",
});
const isLoading = ref(true);
// Tính toán dữ liệu biểu đồ
const chartSeries = computed(() => {
  if (!data.value.distribution?.length) return [data.value.number_needed];
  return data.value.distribution.map((item) => item.goal);
});

const chartOptions = computed(() => {
  if (!data.value.distribution?.length)
    return {
      labels: ["Tổng mục tiêu"],
      colors: ["#007BFF", "#FFC107", "#28A745", "#17A2B8"], // Tuỳ chỉnh màu
      legend: {
        position: "bottom",
      },
      chart: {
        type: "donut",
      },
    };
  return {
    labels: data.value.distribution.map((item) => item.department.name),
    colors: ["#007BFF", "#FFC107", "#28A745", "#17A2B8"], // Tuỳ chỉnh màu
    legend: {
      position: "bottom",
    },
    chart: {
      type: "donut",
    },
  };
});

// Hàm tính phần trăm mục tiêu của phòng ban
const calculatePercentage = (goal) => {
  const totalNeeded = data.value.number_needed;
  return ((goal / totalNeeded) * 100).toFixed(2); // Làm tròn đến 2 chữ số thập phân
};

const LoadDataApi = () => {
  API()
    .get(`campaign/${route.params.id}/`)
    .then((responsive) => {
      isLoading.value = false; // Dữ liệu đã tải xong, đặt isLoading về false
      if (!responsive) return;
      data.value = { ...responsive };
      document.title = `Thống kê ${responsive.name}`;
    })
    .catch((error) => {
      console.error(error);
      isLoading.value = false; // Dữ liệu tải bị lỗi, đặt isLoading về false
    });
};

LoadDataApi();
</script>

<template>
  <Layout
    :address="{ title: 'Chiến dịch tuyển dụng / Hoạt động / Thống kê' }"
    chooseMenu="ban-do"
  >
    <div class="chat-wrapper gap-xl-1 mx-n4 p-1 h-100 d-flex flex-column">
      <div
        class="card mb-0 flex-grow-1 position-relative"
        style="overflow: hidden auto"
      >
        <div class="card-body container-fluid">
          <div class="row">
            <div class="col-xl-4">
              <div class="card card-height-100">
                <div class="card-header border-0 align-items-center d-flex">
                  <h4 class="card-title mb-0 flex-grow-1">Mục tiêu</h4>
                </div>
                <!-- end cardheader -->
                <div class="card-body">
                  <div>
                    <VueApexCharts
                      type="donut"
                      :options="chartOptions"
                      :series="chartSeries"
                      class="apex-charts"
                    ></VueApexCharts>
                  </div>
                  <!-- Danh sách thông tin -->
                  <ul
                    class="list-group list-group-flush border-dashed mb-0 mt-3 pt-2"
                  >
                    <li
                      class="list-group-item px-0"
                      v-for="item in data.distribution"
                      :key="item.department.id"
                    >
                      <div class="d-flex align-items-center">
                        <div class="flex-shrink-0 avatar-xs">
                          <span
                            class="avatar-title bg-light p-1 rounded-circle"
                          >
                            <img
                              :src="item.department?.department_head?.photo"
                              class="img-fluid"
                              alt="icon"
                            />
                          </span>
                        </div>
                        <div class="flex-grow-1 ms-2">
                          <h6 class="mb-1">{{ item.department.name }}</h6>
                          <p class="fs-12 mb-0 text-muted">
                            Mục tiêu: {{ item.goal }} ({{
                              calculatePercentage(item.goal)
                            }}%)
                          </p>
                        </div>
                      </div>
                    </li>

                    <li class="list-group-item px-0">
                      <div class="d-flex align-items-center">
                        <div class="flex-shrink-0 avatar-xs">
                          <span
                            class="avatar-title bg-light p-1 rounded-circle"
                          >
                            <img
                              :src="data.customer.logo || 'default-avatar.png'"
                              class="img-fluid"
                              alt="icon"
                            />
                          </span>
                        </div>
                        <div class="flex-grow-1 ms-2">
                          <h6 class="mb-1">Tổng mục tiêu</h6>
                          <p class="fs-12 mb-0 text-muted">
                            {{ data.number_needed }}
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <!-- end card body -->
              </div>
              <!-- end card -->
            </div>
            <!-- end col -->

            <div class="col-xl-8 order-xxl-0 order-first">
              <div class="d-flex flex-column h-100">
                <div class="row h-100">
                  <template v-if="data.distribution.length">
                    <div
                      v-for="distribution in data.distribution"
                      :key="distribution.department.id"
                      class="col-lg-4 col-md-6"
                    >
                      <div class="card">
                        <div class="card-body">
                          <div class="d-flex align-items-center">
                            <div class="avatar-sm flex-shrink-0">
                              <span
                                class="avatar-title bg-light text-primary rounded-circle fs-3"
                              >
                                <i class="ri-building-fill align-middle"></i>
                              </span>
                            </div>
                            <div class="flex-grow-1 ms-3">
                              <p
                                class="text-uppercase fw-semibold fs-12 text-muted mb-1"
                              >
                                {{ distribution.department?.name }}
                              </p>
                              <h4 class="mb-0">
                                <span
                                  class="counter-value"
                                  data-target="2390.68"
                                  >{{ distribution.goal }}</span
                                >
                              </h4>
                            </div>
                            <div class="flex-shrink-0 align-self-end">
                              <span class="badge bg-success-subtle text-success"
                                ><i
                                  class="ri-arrow-up-s-fill align-middle me-1"
                                ></i
                                >6.24 %<span> </span
                              ></span>
                            </div>
                          </div>
                        </div>
                        <!-- end card body -->
                      </div>
                      <!-- end card -->
                    </div>
                  </template>
                </div>
                <!-- end row -->
              </div>
            </div>
            <!-- end col -->
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
