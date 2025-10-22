<script>
import { useFetch } from "@/helpers/api/api.js";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import AccordionRecord from "@/base/components/accordion/AccordionRecord.vue";
export default {
  setup() {
    const colorStr = '["--vz-primary", "--vz-warning", "--vz-info"]';
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
        },
        legend: {
          show: false,
          position: "bottom",
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
      isLoading: false,
    };
  },
  props: {
    dateStart: String,
    dateEnd: String,
    timeRange: String,
  },
  watch: {
    dateStart() {
      if (this.dateStart && this.dateEnd) {
        this.fetchData();
      }
    },
    dateEnd() {
      if (this.dateStart && this.dateEnd) {
        this.fetchData();
      }
    },
  },
  mounted() {
    if (this.dateStart && this.dateEnd) {
      this.fetchData();
    }
  },
  methods: {
    async fetchData() {
      this.isLoading = true;
      await useFetch(
        API_SERVER_URL +
          "/log-auth/report/?type&date_start=" +
          this.dateStart +
          "&date_end=" +
          this.dateEnd
      )
        .then((data) => {
          this.tableData = data;
          if (!data.nations || data.nations.length === 0) {
            this.series = [];
            this.chartOptions.labels = [];
            return;
          }
          this.series = data.nations.map((item) => item.quantity);
          this.chartOptions.labels = data.nations.map((item) => item.name);
        })
        .catch((error) => {
          console.error("Error fetching candidate data:", error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  components: { AccordionRecord },
};
</script>
<template>
  <AccordionRecord
    :title="`Thống kê quốc gia của người dùng trong ${this.timeRange}`"
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
        <template v-else-if="tableData?.nations?.length > 0">
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
                <tr v-for="(item, index) in tableData?.nations" :key="index">
                  <td>
                    <h4 class="text-truncate fs-14 fs-medium mb-0">
                      <i
                        class="ri-stop-fill align-middle fs-18 me-2"
                        :style="{
                          color: getChartColorsArray(colorStr)[index],
                        }"
                      ></i
                      >{{ item?.name }}
                    </h4>
                  </td>
                  <td class="text-start">
                    <p class="text-muted mb-0">
                      <i class="ri-bar-chart-line fs-5 align-middle"></i>&nbsp;
                      {{ item?.quantity }}
                    </p>
                  </td>
                  <td class="text-start">
                    <p class="text-muted fw-medium fs-12 mb-0">
                      <i class="ri-group-line fs-5 align-middle"></i>&nbsp;{{
                        item?.unique_user
                      }}
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
</template>
