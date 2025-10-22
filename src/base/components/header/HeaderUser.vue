<script setup>
/* eslint-disable */
// import Notification from "@/app_portal/components/header/structure/Notification.vue";
import { computed, inject } from "vue";
import { BASE_URL } from "@/helpers/api/axiosHttp";
import ShowApp from "../user/ShowApp.vue";
import { useRouter } from "vue-router";
import Notify from "../user/Notify.vue";
import CallWidget from "@/callcenter/CallWidget.vue";
const router = useRouter();
const user = inject("user");

const isSmallScreen = computed(() => {
  return window.screen.width < 768;
});
const handleClickViewApp = () => {
  if (isSmallScreen.value) {
    router.push({ name: "AppsPage" });
  }
};
</script>
<template>
  <div class="d-flex align-items-center h-100 position-relative map-header">
    <div class="d-flex align-items-center">
      <CallWidget v-show="user?.id"></CallWidget>
      <template v-if="user?.id">
        <!-- <Notification></Notification> -->
        <div
          class="dropdown topbar-head-dropdown"
          :class="{ 'ms-1': !isSmallScreen }"
        >
          <button
            @click="handleClickViewApp"
            type="button"
            class="btn btn-topbar btn-ghost-info rounded-circle p-0"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            :class="{ 'w-100': isSmallScreen, 'btn-icon': !isSmallScreen }"
          >
            <i class="bx bx-category-alt fs-20"></i>
          </button>
          <ShowApp></ShowApp>
        </div>
      </template>
      <Notify></Notify>
      <div
        class="d-flex align-items-center justify-content-center cursor-pointer dropdown p-1 ms-2"
        v-if="user?.id"
      >
        <b-link
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          class="w-100"
          :class="{
            'd-flex align-items-center justify-content-center': isSmallScreen,
          }"
        >
          <img
            :src="user?.photo"
            alt="user"
            class="avatar-xs rounded-circle"
            v-if="user?.photo"
          />
          <img
            src="@/assets/images/users/user-dummy-img.jpg"
            alt="user"
            class="avatar-xs rounded-circle"
            v-else
          />
        </b-link>
        <div class="dropdown-menu dropdown-menu-end">
          <h6 class="dropdown-header">Welcome&nbsp;{{ user.username }}!</h6>
          <router-link class="dropdown-item" to="/profile/detail"
            ><i
              class="mdi mdi-account-circle text-muted fs-16 align-middle me-1"
            ></i>
            <span class="align-middle">Thông tin</span>
          </router-link>
          <template v-if="user.cooperative_manage">
            <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" to="/cooperative"
              ><i class="ri-team-line text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle">Hợp tác xã</span>
            </router-link>
          </template>
          <div class="dropdown-divider"></div>
          <router-link class="dropdown-item" to="/change-password">
            <i
              class="ri-rotate-lock-fill text-muted fs-16 align-middle me-1"
            ></i>
            <span class="align-middle">Đổi mật khẩu</span>
          </router-link>
          <router-link :to="{ name: 'Logout' }">
            <div class="dropdown-item">
              <i class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle" data-key="t-logout">Đăng xuất</span>
            </div></router-link
          >
        </div>
      </div>
      <router-link
        :to="{ name: 'Login' }"
        type="button"
        v-else
        @click="handleClickLogOut"
        class="btn btn-soft-info p-0"
        :class="{
          'd-flex btn-sm rounded-pill border-info fw-semibold align-items-center p-1':
            !isSmallScreen,
          'rounded-circle w-100': isSmallScreen,
        }"
      >
        <i class="ri-login-box-line" :class="{ 'fs-4': isSmallScreen }"></i>
        <span class="login-text">Đăng nhập</span>
      </router-link>
    </div>
  </div>
</template>
<style>
.line__inital--app {
  line-height: initial;
  min-height: 35px;
  align-items: center;
  font-size: 13px;
}

.dropdown__notis--small {
  width: 300px;

  @media (min-width: 768px) {
    transform: translate3d(45px, 55.6667px, 0px) !important;
  }
}
</style>
