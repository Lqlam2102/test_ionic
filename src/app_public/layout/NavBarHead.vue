<script setup>
import { reactive, ref } from "vue";
import ButtonIcon from "@/base/components/baseUI/ButtonIcon.vue";
import { useRoute } from "vue-router";
import { CompanyInfor } from "@/helpers/user/company.js";

const route = useRoute();

// eslint-disable-next-line no-unused-vars
const setNavbarItem = (name, blink = "#", active = false) => {
  return {
    name: name,
    to: blink,
    active: active,
  };
};
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const valueScreen = reactive({
  isSearch: false,
});

const handleClickSearchIcon = () => {
  valueScreen.isSearch = !valueScreen.isSearch;
};
const initCheck = (nameR) => {
  if (nameR == route.name) {
    return true;
  } else {
    return false;
  }
};
const navbarPortal = ref([
  // setNavbarItem("Trang chủ", ""),
  // setNavbarItem("Tuyển dụng", ""),
  // setNavbarItem("Nền tảng", ""),
  // setNavbarItem("Về chúng tôi", ""),
]);

const handleClickMenu = (menu) => {
  scrollToSection(menu.to);
  for (let item of navbarPortal.value) {
    item.active = false;
  }
  menu.active = true;
};
</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-landing navbar-light fixed-top"
    id="navbar"
  >
    <BContainer class="gap-5">
      <div class="d-flex align-items-center gap-3">
        <router-link
          class="navbar-brand d-flex align-items-center gap-2"
          to="/"
        >
          <template v-if="CompanyInfor?.photo">
            <img
              :src="CompanyInfor?.photo"
              class="card-logo card-logo-dark"
              alt="logo dark"
              height="42"
            />
            <img
              :src="CompanyInfor?.photo"
              class="card-logo card-logo-light"
              alt="logo light"
              height="42"
            />
          </template>
          <template v-else>
            <img
              src="@/assets/images/logo/metadatawin.png"
              class="card-logo card-logo-dark"
              alt="logo dark"
              height="42"
            />
            <img
              src="@/assets/images/logo/metadatawin.png"
              class="card-logo card-logo-light"
              alt="logo light"
              height="42"
            />
          </template>
          <div
            class="fw-light text-white-75 d-flex flex-column justify-content-center navbar-nav border-start ps-2"
          >
            <div class="nav-item">
              <span class="fs-10 nav-link p-0"> <br /></span>
              <span class="nav-link p-0">3SAO</span>
            </div>
          </div>
        </router-link>

        <div class="navbar-collapse">
          <div v-show="valueScreen.isSearch" class="d-sm-none p-3 pb-0">
            <div class="form-group m-0">
              <div class="input-group">
                <input
                  class="form-control"
                  placeholder="Tìm kiếm việc làm..."
                />
                <button
                  class="btn"
                  style="
                    position: absolute;
                    top: 55%;
                    right: -10px;
                    transform: translateY(-50%);
                    cursor: pointer;
                    color: rgb(89, 89, 89);
                  "
                >
                  <i class="mdi mdi-magnify fs-22"></i>
                </button>
              </div>
            </div>
          </div>

          <ul class="navbar-nav mt-2 mt-lg-0">
            <li
              class="nav-item"
              v-for="(menu, indexMenu) in navbarPortal"
              :key="indexMenu"
            >
              <router-link
                class="nav-link fs-14"
                :to="menu.to"
                @click="handleClickMenu(menu)"
              >
                <span
                  class="pb-1"
                  :class="{
                    'border-bottom-success text-success': menu.active,
                  }"
                >
                  {{ menu.name }}
                </span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="d-none flex-1 gap-3" style="max-width: 450px">
        <div class="flex-1 text-end position-relative">
          <div class="d-flex align-items-center justify-content-end gap-3">
            <div
              v-if="valueScreen.isSearch"
              class="flex-1 d-none d-sm-block d-lg-none"
            >
              <input class="form-control" placeholder="Tìm kiếm việc làm..." />
            </div>

            <div class="flex-1 d-none d-lg-block">
              <input class="form-control" placeholder="Tìm kiếm việc làm..." />
            </div>

            <i
              class="ri-search-line fs-20 search-icon text-black-50 cursor-pointer d-lg-none"
              @click="handleClickSearchIcon"
            ></i>
          </div>
          <button
            class="btn d-none d-lg-block"
            style="
              position: absolute;
              top: 55%;
              right: -10px;
              transform: translateY(-50%);
              cursor: pointer;
              color: #595959;
            "
          >
            <i class="mdi mdi-magnify fs-22"></i>
          </button>
        </div>
        <router-link class="d-none d-lg-block" to="/login">
          <ButtonIcon
            classIcon="bx bx-category-alt"
            :name="initCheck('AppStore') ? 'Mở ứng dụng' : 'Đăng nhập'"
            style="background: #ff8132"
            class="border-0"
          ></ButtonIcon>
        </router-link>
      </div>
    </BContainer>
  </nav>
</template>
<style scoped>
@media screen and (max-width: 991.98px) {
  .navbar-light .navbar-nav .nav-item .nav-link {
    color: #333;
  }
  .navbar-collapse {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(56, 65, 74, 0.15);
  }
  .navbar-collapse ul {
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    padding-bottom: 10px;
  }

  .navbar-landing.is-sticky .navbar-nav {
    display: none;
  }
}

.border-bottom-success {
  border-bottom: 2px solid #0ab39c;
}
</style>
