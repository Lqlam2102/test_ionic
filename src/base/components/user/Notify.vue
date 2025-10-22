<template>
  <div class="dropdown topbar-head-dropdown ms-1 header-item">
    <button
      type="button"
      class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
      id="page-header-notifications-dropdown"
      data-bs-toggle="dropdown"
      data-bs-auto-close="outside"
      aria-expanded="true"
    >
      <i class="bx bx-bell fs-22"></i>
      <span
        class="position-absolute fs-10 translate-middle bg-danger dot-new-notifications"
        v-if="getUnReadNotifications().length > 0"
      >
      </span>
    </button>
    <div
      class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
      aria-labelledby="page-header-notifications-dropdown"
    >
      <div class="dropdown-head bg-primary bg-pattern rounded-top">
        <div class="p-3">
          <b-row class="align-items-center">
            <b-col>
              <h6 class="m-0 fs-16 fw-semibold text-white">Thông báo</h6>
            </b-col>
            <b-col cols="auto" class="dropdown-tabs">
              <button
                class="btn btn-outline-primary btn-icon waves-effect waves-light text-bg-primary"
                type="button"
                title="table"
              >
                <i class="ri-check-double-line"></i>
              </button>

              <button
                class="btn btn-outline-primary btn-icon waves-effect waves-light text-bg-primary"
                type="button"
                title="table"
              >
                <i class="ri-settings-5-fill"></i>
              </button>

              <button
                class="btn btn-outline-primary btn-icon waves-effect waves-light text-bg-primary"
                type="button"
                title="table"
              >
                <i class="ri-mist-line fs-18"></i>
              </button>
            </b-col>
          </b-row>
        </div>
      </div>
      <div class="position-relative">
        <div class="px-2 pt-2">
          <ul
            class="nav nav-tabs dropdown-tabs nav-tabs-custom"
            data-dropdown-tabs="true"
            id="notificationItemsTab"
            role="tablist"
          >
            <li class="nav-item" v-for="(tab, index) in tabs" :key="index">
              <b-link
                :class="{ 'nav-link': true, active: tab.active }"
                data-bs-toggle="tab"
                :href="`#${tab.id}`"
                style="padding: 10px 13px"
                role="tab"
                aria-selected="false"
                @click.capture.stop
              >
                {{ tab.label }}
              </b-link>
              <span
                class="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger"
                v-if="getUnReadNotifications(tab.belong_to).length"
              >
                {{ getUnReadNotifications(tab.belong_to).length
                }}<span class="visually-hidden">unread messages</span></span
              >
            </li>
          </ul>
        </div>
        <div class="tab-content" id="notificationItemsTabContent">
          <div
            :class="{ 'tab-pane py-2 ps-2 px-2': true, active: tab.active }"
            :id="tab.id"
            role="tabpanel"
            aria-labelledby="alerts-tab"
            v-for="(tab, index) in tabs"
            :key="index"
          >
            <SimpleBar data-simplebar style="max-height: 300px" class="pe-2">
              <template
                v-for="(notify, index) in filteredNotifications"
                :key="index"
              >
                <div
                  class="text-reset notification-item d-block dropdown-item position-relative"
                  v-if="notify.belong_to == tab.belong_to"
                >
                  <div class="d-flex">
                    <div class="avatar-xs me-3">
                      <span
                        :class="{
                          'avatar-title rounded-circle fs-16': true,
                          'text-info bg-soft-info': notify.type.id == 'INFO',
                          'text-warning bg-soft-warning':
                            notify.type.id == 'WARNING',
                        }"
                      >
                        <i
                          :class="{
                            bx: true,
                            'bx-info-circle': notify.type.id == 'INFO',
                            'bx-error': notify.type.id == 'WARNING',
                          }"
                        ></i>
                      </span>
                    </div>
                    <div class="flex-1">
                      <b-link href="#!" class="stretched-link">
                        <h6
                          class="mt-0 mb-2 fs-13 lh-base"
                          v-html="notify.title"
                        ></h6>
                      </b-link>
                      <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                        <span
                          ><i class="mdi mdi-clock-outline"></i>
                          {{ timeAgo(notify.created_at) }}</span
                        >
                      </p>
                    </div>
                    <div class="px-2 fs-15">
                      <input class="form-check-input" type="checkbox" />
                    </div>
                  </div>
                </div>
              </template>
              <div
                class="tab-pane fade p-4 active show"
                id="alerts-tab"
                role="tabpanel"
                v-show="!getNumberOfNotifications(tab.belong_to).length"
                aria-labelledby="alerts-tab"
              >
                <div class="empty-notification-elem">
                  <div class="w-25 w-sm-50 pt-3 mx-auto">
                    <img
                      src="@/assets/images/bell.svg"
                      class="img-fluid"
                      alt="user-pic"
                    />
                  </div>
                  <div class="text-center pb-5 mt-2">
                    <h6 class="fs-18 fw-semibold lh-base">
                      Không có thông báo từ {{ tab.label }}
                      <span
                        v-show="
                          tab.id != 'systems-tab' && tab.id != 'personals-tab'
                        "
                        >nào</span
                      >
                      !
                    </h6>
                  </div>
                </div>
              </div>
              <div class="my-3 text-center">
                <b-button type="button" variant="soft-success">
                  View All Messages
                  <i class="ri-arrow-right-line align-middle"></i>
                </b-button>
              </div>
            </SimpleBar>
          </div>
        </div>
      </div>

      <div
        v-show="false"
        class="position-absolute"
        style="inset: 0; z-index: 1"
      >
        <div class="card overflow-auto shadow-sm h-100">
          <div class="card-header d-flex align-items-center gap-2">
            <i class="hover-text-primary mdi mdi-keyboard-backspace fs-20"></i>
            <h5 class="m-0 fs-18 fw-bold">Bộ lọc thông báo</h5>
          </div>
          <div class="card-body">
            <!-- Trạng thái thông báo -->
            <h6 class="fw-bold">Trạng thái thông báo</h6>
            <div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="statusFilter"
                  id="statusAll"
                  value="all"
                  v-model="statusFilter"
                />
                <label class="form-check-label" for="statusAll">Tất cả</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="statusFilter"
                  id="statusUnread"
                  value="unread"
                  v-model="statusFilter"
                />
                <label class="form-check-label" for="statusUnread"
                  >Chưa đọc</label
                >
              </div>
            </div>

            <!-- Loại thông báo -->
            <h6 class="fw-bold mt-3">Loại thông báo</h6>
            <div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="typeFilter"
                  id="typeAll"
                  value="all"
                  v-model="typeFilter"
                />
                <label class="form-check-label" for="typeAll">Tất cả</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="typeFilter"
                  id="typeActivity"
                  value="activity"
                  v-model="typeFilter"
                />
                <label class="form-check-label" for="typeActivity"
                  >Hoạt động</label
                >
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="typeFilter"
                  id="typeSystem"
                  value="system"
                  v-model="typeFilter"
                />
                <label class="form-check-label" for="typeSystem"
                  >Hệ thống</label
                >
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="typeFilter"
                  id="typePromo"
                  value="promo"
                  v-model="typeFilter"
                />
                <label class="form-check-label" for="typePromo"
                  >Khuyến mãi</label
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-show="false"
        class="position-absolute"
        style="inset: 0; z-index: 1"
      >
        <div class="card overflow-auto shadow-sm h-100">
          <div class="card-header d-flex align-items-center gap-2">
            <i class="hover-text-primary mdi mdi-keyboard-backspace fs-20"></i>
            <h5 class="m-0 fs-18 fw-bold">Tuỳ chỉnh</h5>
          </div>
          <div class="card-body">
            <div
              class=""
              v-for="(category, index) in applications"
              :key="index"
            >
              <h4 class="text-warning text-uppercase">
                {{ category.title }}
              </h4>
              <div
                v-for="(app, i) in category.listPage"
                :key="i"
                class="d-flex align-items-center justify-content-between cursor-pointer dropdown-item form-check form-switch px-2 ellipsis border-bottom"
              >
                <div class="d-flex align-items-center gap-2">
                  <i :class="app.meta.icon" class="fs-22 text-primary"></i>
                  <span>{{ app.meta.name }}</span>
                </div>

                <input
                  class="form-check-input m-0"
                  role="switch"
                  type="checkbox"
                  v-model="app.enabled"
                />
              </div>
              <div class="mb-3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccessToken } from "@/helpers/api/token";
import SimpleBar from "simplebar-vue";
import { WS } from "@/helpers/utils/config_system";
import { applications } from "@/helpers/user/applications.js";
export default {
  setup() {
    return { applications };
  },
  data() {
    return {
      tabs: [
        {
          id: "systems-tab",
          label: "Hệ thống",
          active: true,
          belong_to: "system",
        },
        {
          id: "departments-tab",
          label: "Phòng ban",
          active: false,
          belong_to: "department",
        },
        { id: "groups-tab", label: "Nhóm", active: false, belong_to: "group" },
        {
          id: "personals-tab",
          label: "Cá nhân",
          active: false,
          belong_to: "personal",
        },
      ],
      notifications: [],
      socket: null,
      socketOpen: false, // Add a flag to check if the WebSocket is open
      timer: null, // Timer for real-time updates
      statusFilter: "all",
      typeFilter: "all",
    };
  },
  components: { SimpleBar },
  computed: {
    filteredNotifications() {
      return [...this.notifications].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    },
  },
  mounted() {
    if (!this.socketOpen) {
      this.connectWebSocket();
    }
    this.startTimer();
    console.log(this.applications);
  },
  methods: {
    setStatusFilter(status) {
      this.statusFilter = status;
    },
    setTypeFilter(type) {
      this.typeFilter = type;
    },
    connectWebSocket() {
      this.socket = new WebSocket(
        `${WS}/ws/notify/?token=${getAccessToken().replace("Bearer ", "")}`
      );

      this.socket.onopen = () => {
        this.socketOpen = true; // Set the flag to true when the connection is open
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.del) {
          const index = this.notifications.findIndex((notify) => {
            return notify.id == data.id;
          });

          if (index !== -1) {
            this.notifications.splice(index, 1);
          }
        } else {
          const index = this.notifications.findIndex((notify) => {
            return notify.id == data.id;
          });
          if (index == -1) this.notifications.unshift(data);
        }
      };

      // this.socket.onclose = () => {
      //   console.log("WebSocket connection closed.");
      // };

      this.socket.onerror = (event) => {
        console.error("WebSocket error: ", event);
      };
    },
    timeAgo(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);

      const intervals = [
        { label: "năm", seconds: 31536000 },
        { label: "tháng", seconds: 2592000 },
        { label: "ngày", seconds: 86400 },
        { label: "giờ", seconds: 3600 },
        { label: "phút", seconds: 60 },
        { label: "giây", seconds: 1 },
      ];

      for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
          return `${count} ${interval.label} trước`;
        }
      }
      return "Vừa xong";
    },
    getNumberOfNotifications(belong_to) {
      return this.notifications.filter((notify) => {
        return notify.belong_to == belong_to;
      });
    },
    getUnReadNotifications(belong_to) {
      if (belong_to) {
        return this.notifications.filter((notify) => {
          return notify.belong_to == belong_to && notify.is_read == false;
        });
      } else {
        return this.notifications.filter((notify) => {
          return notify.is_read == false;
        });
      }
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.$forceUpdate(); // Force re-render to update time ago
      }, 60000); // Update every minute (60000 ms)
    },
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.close();
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style scoped>
.dot-new-notifications {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  top: 7px;
  right: 0px;
}
.topbar-badge {
  z-index: 10;
  right: -15px !important;
  top: 3px !important;
}
</style>
