<template>
  <div class="card mb-2">
    <Tabs value="call-in">
      <TabList>
        <Tab v-for="(tab, index) in items" :key="index" :value="tab.id">
          <span>{{ tab.label }}</span>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="call-in">
          <h3>Thống kê cuộc gọi vào</h3>
          <div class="row">
            <div class="col-md-6 col-xl-3">
              <CardDemo
                name="Tổng cuộc gọi vào"
                :value="totalIncoming"
                :isLoading="isLoading"
              >
              </CardDemo>
            </div>
            <div class="col-md-6 col-xl-3">
              <CardDemo
                name="Tổng cuộc gọi vào"
                :value="totalIncomingNonZeroAnswer"
                :isLoading="isLoading"
              ></CardDemo>
            </div>
            <div class="col-md-6 col-xl-3">
              <CardDemo
                name="Tổng cuộc gọi vào"
                :value="totalIncomingNonZeroAnswer"
                :isLoading="isLoading"
              ></CardDemo>
            </div>
            <div class="col-md-6 col-xl-3">
              <CallDuration
                name="Tổng thời gian nghe"
                :value="totalIncomingDuration"
                :isLoading="isLoading"
              ></CallDuration>
            </div>
          </div>
        </TabPanel>
        <TabPanel value="call-out">
          <h3>Thống kê cuộc gọi ra</h3>
          <div class="row">
            <div class="col-md-6 col-xl-3">
              <CardDemo
                name="Tổng cuộc gọi vào"
                :value="totalOngoing"
                :isLoading="isLoading"
              ></CardDemo>
            </div>
            <div class="col-md-6 col-xl-3">
              <CardDemo
                name="Tổng cuộc gọi vào"
                :value="totalOngoingNonZeroAnswer"
                :isLoading="isLoading"
              ></CardDemo>
            </div>
            <div class="col-md-6 col-xl-3">
              <CardDemo
                name="Tổng cuộc gọi vào"
                :value="totalOngoingZeroAnswer"
                :isLoading="isLoading"
              ></CardDemo>
            </div>
            <div class="col-md-6 col-xl-3">
              <CallDuration
                name="Tổng thời gian nghe"
                :value="totalOngoingDuration"
                :isLoading="isLoading"
              ></CallDuration>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
  <DashboardTable></DashboardTable>
</template>

<script>
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";

import DashboardTable from "./DashboardTable.vue";
import { useFetch } from "@/helpers/api/api.js";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import CallDuration from "./CallDuration.vue";
import CardDemo from "./CardDemo.vue";

export default {
  data() {
    return {
      items: [
        {
          id: "call-in",
          label: "Thống kê gọi vào",
          icon: "bx bx-phone-incoming",
        },
        {
          id: "call-out",
          label: "Thống kê gọi ra",
          icon: "bx bx-phone-outgoing",
        },
      ],
      reportData: {},
      isLoading: true,
    };
  },
  computed: {
    totalIncoming() {
      return this.reportData?.incoming?.total ?? 0;
    },
    totalIncomingZeroAnswer() {
      return this.reportData?.incoming?.total_zero_answer_duration ?? 0;
    },
    totalIncomingNonZeroAnswer() {
      return this.reportData?.incoming?.total_non_zero_answer_duration ?? 0;
    },
    totalIncomingDuration() {
      const total = this.reportData?.incoming?.total_answer_duration ?? 0;
      if (total >= 60) return `${total / 60} phút`;
      else if (total > 0) return `${total} giây`;
      else return total;
    },
    totalOngoing() {
      let total = 0;
      return this.reportData?.ongoing?.total ?? total;
    },
    totalOngoingZeroAnswer() {
      let total = 0;
      return this.reportData?.ongoing?.total_zero_answer_duration ?? total;
    },
    totalOngoingNonZeroAnswer() {
      let total = 0;
      return this.reportData?.ongoing?.total_non_zero_answer_duration ?? total;
    },
    totalOngoingDuration() {
      const total = this.reportData?.ongoing?.total_answer_duration ?? 0;
      if (total >= 60) return `${(total / 60).toFixed(2)} phút`;
      else if (total > 0) return `${total} giây`;
      else return total;
    },
  },
  // eslint-disable-next-line
  components: {
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    DashboardTable,
    CallDuration,
    CardDemo,
  },
  async mounted() {
    await useFetch(API_SERVER_URL + "/call-center/history/report").then(
      (data) => {
        this.reportData = data;
      }
    );
    this.isLoading = false;
  },
};
</script>

<style scoped lang="scss">
.bg-success-subtle {
  background-color: #daf4f0;
}

.bg-secondary-subtle {
  background-color: #e1ebfd;
}

.bg-info-subtle {
  background-color: #dff0fa;
}

.bg-danger-subtle {
  background-color: #fde8e4;
}

.bg-warning-subtle {
  background-color: #fef4e4;
}
</style>
