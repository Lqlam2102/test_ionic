<script>
import Layout from "@/app_manage_dynamic_api/layout/main.vue";
import { useFetch } from "@/helpers/api/api.js";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import RegionChart from "../components/RegionChart.vue";
import DashboardLog from "../components/DashboardLog.vue";
import { errorToast } from "@/helpers/api/toastStyle";
import AccordionRecord from "@/base/components/accordion/AccordionRecord.vue";

export default {
  setup() {
    const colorStr =
      '["--vz-primary", "--vz-warning", "--vz-info", "--vz-success"]';
    const getChartColorsArray = (colors) => {
      colors = JSON.parse(colors);
      return colors.map(function (value) {
        var newValue = value.replace(" ", "");
        if (newValue.indexOf(",") === -1) {
          var color = getComputedStyle(
            document.documentElement
          ).getPropertyValue(newValue);
          if (color) {
            color = color.replace(" ", "");
            return color;
          } else return newValue;
        } else {
          var val = value.split(",");
          if (val.length == 2) {
            var rgbaColor = getComputedStyle(
              document.documentElement
            ).getPropertyValue(val[0]);
            rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
            return rgbaColor;
          } else {
            return newValue;
          }
        }
      });
    };
    console.log(getChartColorsArray(colorStr));
    return {
      series: [],
      chartOptions: {
        labels: [],
        chart: {
          type: "pie",
          height: 219,
        },
        plotOptions: {
          pie: {
            size: 100,
            donut: {
              size: "76%",
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val.toFixed(1) + "%";
          },
          dropShadow: {
            enabled: false,
          },
          style: {
            fontWeight: "bold",
          },
        },
        legend: {
          show: false,
        },
        colors: getChartColorsArray(colorStr),
      },
      getChartColorsArray,
      colorStr,
    };
  },
  data() {
    return {
      tableData: {},
      dateStart: null,
      dateEnd: null,
      filters: [
        { id: "today", name: "hôm nay" },
        { id: "yesterday", name: "hôm qua" },
        { id: "lastWeek", name: "7 ngày gần nhất" },
        { id: "30day", name: "30 ngày gần nhất" },
        { id: "thisMonth", name: "tháng nay" },
        { id: "lastMonth", name: "tháng trước" },
        { id: "currentYear", name: "năm nay" },
      ],
      selectedFilter: {},
      isLoading: false,
    };
  },

  mounted() {
    this.selectedFilter = this.filters[3];
    this.fetchData();
  },
  methods: {
    getDaterange(range) {
      const now = new Date();
      let start, end;

      switch (range) {
        case "today":
          start = end = now;
          break;
        case "yesterday":
          start = new Date(now);
          start.setDate(now.getDate() - 1);
          end = now;
          break;
        case "lastWeek":
          start = new Date(now);
          start.setDate(now.getDate() - 7);
          end = now;
          break;
        case "30day":
          start = new Date(now);
          start.setMonth(now.getMonth() - 1);
          end = now;
          break;
        case "thisMonth":
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case "lastMonth":
          start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          end = new Date(now.getFullYear(), now.getMonth(), 0);
          break;
        case "currentYear":
          start = new Date(now.getFullYear(), 0, 1);
          end = now;
          break;
        default:
          start = new Date(now);
          start.setDate(now.getDate() - 7);
          end = now;
      }
      const format = (date) =>
        `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;

      return {
        dateStart: format(start),
        dateEnd: format(end),
      };
    },
    async fetchData() {
      this.isLoading = true;
      const { dateStart, dateEnd } = this.getDaterange(this.selectedFilter.id);
      this.dateStart = dateStart;
      this.dateEnd = dateEnd;
      await useFetch(
        API_SERVER_URL +
          "/log-auth/report/?type&date_start=" +
          dateStart +
          "&date_end=" +
          dateEnd
      )
        .then((data) => {
          this.tableData = data;
          if (!data.platforms || data.platforms.length === 0) {
            this.series = [];
            this.chartOptions.labels = [];
            return;
          }
          this.series = data.platforms.map((item) => item.quantity);
          this.chartOptions.labels =
            data.platforms.map((item) => {
              try {
                return JSON.parse(item.name);
              } catch (e) {
                return item.name;
              }
            }) || [];
        })
        .catch((error) => {
          console.error("Error fetching candidate data:", error);
          errorToast("Không thể tải dữ liệu báo cáo, vui lòng thử lại sau");
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    setFilter(filter) {
      this.selectedFilter = filter;
      this.fetchData();
    },
  },
  components: {
    Layout,
    DashboardLog,
    RegionChart,
    AccordionRecord,
  },
};
</script>

<template>
  <Layout
    :address="{
      title: 'Nhật ký hệ thống',
    }"
    chooseMenu="ban-do"
  >
    <div class="chat-wrapper gap-xl-1 mx-n4 p-1 h-100 d-flex flex-column">
      <div
        class="mb-0 card flex-grow-1 position-relative"
        style="overflow: hidden auto"
      >
        <div class="p-3">
          <div class="mb-3">
            <select
              class="form-select js-example-basic-single"
              v-model="selectedFilter"
              @change="setFilter(selectedFilter)"
              style="width: 250px"
            >
              <option
                v-for="(filter, index) in filters"
                :key="index"
                :value="filter"
              >
                Lọc theo {{ filter.name }}
              </option>
            </select>
          </div>
          <div class="row">
            <div class="col-md-6">
              <AccordionRecord
                :title="`Thống kê nền tảng sử dụng của người dùng trong ${selectedFilter.name}`"
              >
                <BCard no-body class="card-height">
                  <BCardBody>
                    <template v-if="isLoading">
                      <div colspan="5" class="text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Đang tải...</span>
                        </div>
                        <div class="mt-2">Đang tải dữ liệu...</div>
                      </div>
                    </template>
                    <template v-else-if="tableData?.platforms?.length > 0">
                      <apexchart
                        class="apex-charts"
                        height="219"
                        :series="series"
                        :options="chartOptions"
                      ></apexchart>

                      <div class="table-responsive mt-3">
                        <table
                          class="table table-borderless table-sm table-centered align-middle table-nowrap mb-0"
                        >
                          <tbody class="border-0">
                            <tr
                              v-for="(item, index) in tableData?.platforms"
                              :key="index"
                            >
                              <td>
                                <h4 class="text-truncate fs-14 fs-medium mb-0">
                                  <i
                                    class="ri-stop-fill align-middle fs-18 me-2"
                                    :style="{
                                      color:
                                        getChartColorsArray(colorStr)[index],
                                    }"
                                  ></i
                                  >{{
                                    item?.name == "Unknown"
                                      ? "Nền tảng khác"
                                      : item?.name.replace(/"/g, "")
                                  }}
                                </h4>
                              </td>
                              <td class="text-start">
                                <p class="text-muted mb-0">
                                  <i
                                    class="ri-bar-chart-line fs-5 align-middle"
                                  ></i
                                  >&nbsp;{{ item?.quantity }}
                                </p>
                              </td>
                              <td class="text-start">
                                <p class="text-muted fw-medium fs-12 mb-0">
                                  <i class="ri-group-line fs-5 align-middle"></i
                                  >&nbsp;{{ item?.unique_user }}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </template>
                    <template v-else>
                      <div class="text-center text-muted py-5">
                        <i class="ri-information-line fs-24 d-block mb-2"></i>
                        Không có dữ liệu để hiển thị
                      </div>
                    </template>
                  </BCardBody>
                </BCard>
              </AccordionRecord>
            </div>
            <div class="col-md-6">
              <RegionChart
                :dateStart="dateStart"
                :dateEnd="dateEnd"
                :timeRange="selectedFilter.name"
              ></RegionChart>
            </div>
          </div>
          <DashboardLog
            :dateStart="dateStart"
            :dateEnd="dateEnd"
          ></DashboardLog>
        </div>
      </div>
    </div>
  </Layout>
</template>
