<script setup>
import { computed, inject, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();
const user = inject("user");

const AvatarUser = computed(() => {
  if (user.value?.photo) return `${user.value.photo}`;
  if (user.value?.gender == 0) {
    return require("@/assets/images/users/boy.png");
  }
  if (user.value?.gender == 1) {
    return require("@/assets/images/users/girl.png");
  }
  return require("@/assets/images/users/user-dummy-img.jpg");
});

const changeToDarkMode = () => {
  if (store.state.layout.mode == "light") {
    store.dispatch("layout/changeMode", { mode: "dark" });
    localStorage.setItem("theme", "dark");
  } else {
    store.dispatch("layout/changeMode", { mode: "light" });
    localStorage.setItem("theme", "light");
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    store.dispatch("layout/changeMode", { mode: savedTheme });
  }
});
</script>

<template>
  <div v-if="user?.id" class="dropdown ms-sm-3 header-item topbar-user">
    <button
      type="button"
      class="btn"
      id="page-header-user-dropdown"
      data-bs-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <span class="d-flex align-items-center">
        <img
          class="rounded-circle header-profile-user"
          :src="AvatarUser"
          alt="Header Avatar"
        />
        <span class="text-start ms-xl-2">
          <span
            class="d-none d-xl-inline-block ms-1 fw-medium user-name-text"
            >{{ user.username }}</span
          >
          <span
            class="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text"
            >{{ user.user_role?.name }}</span
          >
        </span>
      </span>
    </button>
    <div class="dropdown-menu dropdown-menu-end">
      <h6 class="dropdown-header">Welcome&nbsp;{{ user.username }}!</h6>
      <router-link class="dropdown-item" to="/profile/detail"
        ><i
          class="mdi mdi-account-circle text-muted fs-16 align-middle me-1"
        ></i>
        <span class="align-middle">Thông tin</span>
      </router-link>
      <div class="dropdown-divider"></div>
      <router-link class="dropdown-item" :to="{ name: 'AppMyApp' }"
        ><i class="ri-apps-line text-muted fs-16 align-middle me-1"></i>
        <span class="align-middle">Quản lý ứng dụng</span>
      </router-link>
      <div class="dropdown-divider"></div>
      <router-link class="dropdown-item" to="/change-password">
        <i class="ri-rotate-lock-fill text-muted fs-16 align-middle me-1"></i>
        <span class="align-middle">Đổi mật khẩu</span>
      </router-link>
      <div class="dropdown-item" @click="changeToDarkMode">
        <i
          class="text-muted fs-16 align-middle me-1"
          :class="
            store.state.layout.mode == 'light' ? 'bx bx-moon' : 'bx bx-sun'
          "
        ></i>
        <span class="align-middle"
          >{{
            `Chuyển chế độ ${
              store.state.layout.mode == "light" ? "tối" : "sáng"
            }`
          }}
        </span>
      </div>
      <router-link :to="{ name: 'Logout' }">
        <div class="dropdown-item">
          <i class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
          <span class="align-middle" data-key="t-logout">Đăng xuất</span>
        </div>
      </router-link>
    </div>
  </div>

  <div v-else class="dropdown ms-sm-3 header-item topbar-user">
    <button
      type="button"
      class="btn"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <router-link :to="'/login'" type="button">
        <span class="d-flex align-items-center">
          <i
            class="rounded-circle header-profile-user ri-login-box-line fs-20"
          />
          <span class="text-start ms-xl-2">
            <span
              class="d-none d-xl-inline-block ms-1 fw-medium user-name-text fw-bold"
              >Đăng nhập</span
            >
          </span>
        </span>
      </router-link>
    </button>
  </div>
</template>
