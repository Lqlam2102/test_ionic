<script>
import { CountTo } from "vue3-count-to";

import getChartColorsArray from "@/app_dashboard_reports/common/getChartColorsArray";
import { useFetch } from "@/helpers/api/api";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import Select from "@/base/components/select/Select.vue";
import TreeSelect from "@/base/components/tree-select/TreeSelect.vue";
export default {
  components: {
    CountTo,
    Select,
    TreeSelect,
  },
  data() {
    const ranges = [
      { id: "hourly", name: "1 Giờ" },
      { id: "daily", name: "1 Ngày" },
      { id: "weekly", name: "1 Tuần" },
    ];
    return {
      series: [
        {
          name: "Lao động đang làm",
          type: "area",
          data: [],
        },
        {
          name: "Ứng viên",
          type: "bar",
          data: [],
        },
        {
          name: "Lao động đã nghỉ",
          type: "line",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 370,
          type: "line",
          toolbar: {
            show: true,
          },
        },
        stroke: {
          curve: "straight",
          dashArray: [0, 0, 8],
          width: [2, 0, 2.2],
        },
        fill: {
          opacity: [0.1, 0.9, 1],
        },
        markers: {
          size: [0, 0, 0],
          strokeWidth: 2,
          hover: {
            size: 4,
          },
        },
        xaxis: {
          categories: [],
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
        grid: {
          show: true,
          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: {
            lines: {
              show: false,
            },
          },
          padding: {
            top: 0,
            right: -2,
            bottom: 15,
            left: 10,
          },
        },
        legend: {
          show: true,
          horizontalAlign: "center",
          offsetX: 0,
          offsetY: -5,
          markers: {
            width: 9,
            height: 9,
            radius: 6,
          },
          itemMargin: {
            horizontal: 10,
            vertical: 0,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "30%",
            barHeight: "70%",
          },
        },
        colors: getChartColorsArray(
          '["--vz-primary", "--vz-success", "--vz-danger"]'
        ),
        tooltip: {
          shared: true,
          y: [
            {
              formatter: function (y) {
                if (typeof y !== "undefined") {
                  return y.toFixed(0);
                }
                return y;
              },
            },
            {
              formatter: function (y) {
                if (typeof y !== "undefined") {
                  return y.toFixed(0);
                }
                return y;
              },
            },
            {
              formatter: function (y) {
                if (typeof y !== "undefined") {
                  return y.toFixed(0);
                }
                return y;
              },
            },
          ],
        },
      },
      isLoading: true,
      currentRange: "daily",
      ranges,
      departmentAPI: API_SERVER_URL + "/department/?all",
      campaignAPI: API_SERVER_URL + "/campaign/?all",
      selectedCampaign: null,
      selectedDepartment: null,
      campaignKeyFilter: "campaign_id=",
      departmentKeyFilter: "department_id=",
      currentFilter: "",
      filterType: "all",
      filterTypes: [
        { id: "all", name: "Tất cả" },
        { id: "department", name: "Phòng ban" },
        { id: "campaign", name: "Chiến dịch" },
      ],
    };
  },
  computed: {
    total_candidate() {
      return this.series[1].data.reduce((accumulator, current) => accumulator + current, 0);
    },
    total_active_worker() {
      return this.series[0].data.reduce((accumulator, current) => accumulator + current, 0);
    },
    total_inactive_worker() {
      return this.series[2].data.reduce((accumulator, current) => accumulator + current, 0);
    },
    total_worker() {
      return this.total_active_worker + this.total_inactive_worker
    }
  }, 
  async mounted() {
    // This is where you can perform any actions after the component is mounted
    this.fetchChartData();
  },
  methods: {
    async fetchChartData() {
      this.isLoading = true;
      const data = await useFetch(
        API_SERVER_URL +
          "/demo-chart/?range=" +
          this.currentRange +
          "&" +
          this.currentFilter
      );
      this.chartOptions.xaxis.categories = data.labels;
      this.series[0].data = data.active_workers;
      this.series[1].data = data.candidates;
      this.series[2].data = data.inactive_workers;
      this.isLoading = false;
    },
    handleChangeRange(range) {
      this.currentRange = range;
      this.fetchChartData();
    },
    handleChangeFilter(_type) {
      if (_type == this.departmentKeyFilter) {
        this.currentFilter =
          this.departmentKeyFilter + this.selectedDepartment?.id;
        this.fetchChartData();
      } else if (_type == this.campaignKeyFilter) {
        this.currentFilter = this.campaignKeyFilter + this.selectedCampaign?.id;
        this.fetchChartData();
      } else if (_type == "all") {
        this.currentFilter = "";
        this.fetchChartData();
      } else {
        this.currentFilter = "";
        this.selectedCampaign = null;
        this.selectedDepartment = null;
      }
    },
    handleSelectedData(_type, data) {
      if (_type == this.campaignKeyFilter) {
        this.selectedCampaign = data;
        this.handleChangeFilter(this.campaignKeyFilter);
      } else if (_type == this.departmentKeyFilter) {
        this.selectedDepartment = data;
        this.handleChangeFilter(this.departmentKeyFilter);
      }
    },
  },
};
</script>

<template>
  <BCard no-body>
    <BCardHeader class="border-0 align-items-center d-flex">
      <BCardTitle
        class="mb-0 flex-grow-1 w-auto position-relative d-flex gap-2"
      >
        <select
          id="filter-type"
          name="filter-type"
          v-model="filterType"
          @change="handleChangeFilter(filterType)"
          class="form-select form-control w-auto"
        >
          <option
            :value="option.id"
            v-for="(option, index) in filterTypes"
            :key="index"
          >
            {{ option.name }}
          </option>
        </select>
        <div class="position-relative">
          <Select
            v-if="filterType == 'campaign'"
            :api="campaignAPI"
            :isCloseOnSelect="true"
            @change-data="
              (data) => handleSelectedData(this.campaignKeyFilter, data)
            "
          >
          </Select>
        </div>
        <div class="position-relative">
          <TreeSelect
            v-if="filterType == 'department'"
            :api="departmentAPI"
            :convert="true"
            @on-selected="
              (data) => handleSelectedData(this.departmentKeyFilter, data)
            "
          >
          </TreeSelect>
        </div>
      </BCardTitle>
      <div class="hstack gap-1">
        <template v-for="(range, index) in ranges" :key="index">
          <BButton
            v-if="currentRange == range.id"
            type="button"
            variant="soft-secondary"
            size="sm"
            @click="handleChangeRange(range.id)"
          >
            {{ range.name }}
          </BButton>
          <BButton
            v-else
            type="button"
            variant="soft-primary"
            size="sm"
            @click="handleChangeRange(range.id)"
          >
            {{ range.name }}
          </BButton>
        </template>
      </div>
    </BCardHeader>

    <BCardHeader class="p-0 border-0 bg-light-subtle">
      <BRow class="g-0 text-center">
        <BCol cols="6" sm="3">
          <div class="p-3 border border-dashed border-start-0">
            <h5 class="mb-1">
              <count-to
                :startVal="0"
                :endVal="total_candidate"
                :duration="4000"
              ></count-to>
            </h5>
            <p class="text-muted mb-0">Ứng viên</p>
          </div>
        </BCol>
        <BCol cols="6" sm="3">
          <div class="p-3 border border-dashed border-start-0">
            <h5 class="mb-1">
              <count-to
                :startVal="0"
                :endVal="total_worker"
                :duration="4000"
              ></count-to
              >
            </h5>
            <p class="text-muted mb-0">Lao động</p>
          </div>
        </BCol>
        <BCol cols="6" sm="3">
          <div class="p-3 border border-dashed border-start-0">
            <h5 class="mb-1">
              <count-to :startVal="0" :endVal="total_active_worker" :duration="4000"></count-to>
            </h5>
            <p class="text-muted mb-0">LĐ đang làm</p>
          </div>
        </BCol>
        <BCol cols="6" sm="3">
          <div class="p-3 border border-dashed border-start-0 border-end-0">
            <h5 class="mb-1 text-primary">
              <count-to :startVal="0" :endVal="total_inactive_worker" :duration="4000"></count-to>
            </h5>
            <p class="text-muted mb-0">LĐ đã nghỉ</p>
          </div>
        </BCol>
      </BRow>
    </BCardHeader>

    <BCardBody class="p-0 pb-2">
      <div class="w-100" v-if="!isLoading">
        <apexchart
          class="apex-charts"
          height="370"
          type="line"
          dir="ltr"
          :series="series"
          :options="chartOptions"
        >
        </apexchart>
      </div>
    </BCardBody>
  </BCard>
</template>
