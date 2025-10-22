<script setup>
import { SimpleBar } from "simplebar-vue3";
import { applications } from "@/helpers/user/applications.js";
</script>

<template>
  <div class="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
    <SimpleBar style="max-height: 60vh">
      <div class="p-2">
        <template v-if="applications.length">
          <div
            v-for="(typeApp, indexTypeApp) in applications"
            :key="indexTypeApp"
          >
            <div class="p-2 border-dashed border-0 border-bottom">
              <div
                class="row align-items-center pb-1"
                style="border-bottom: 1px dotted #d5b9b9"
              >
                <div class="col">
                  <h6 class="m-0 text-uppercase text-success">
                    {{ typeApp.title }}
                  </h6>
                </div>
              </div>
            </div>
            <b-row class="g-0 mt-1">
              <template v-if="typeApp.listPage.length <= 5">
                <b-col
                  class="col-4"
                  v-for="(app, indexApp) in typeApp.listPage"
                  :key="indexApp"
                  sm="4"
                  md="4"
                >
                  <router-link :to="{ path: `/${app.path}` }">
                    <div class="dropdown-icon-item">
                      <i
                        class="display-6 text-primary"
                        :class="app?.meta.icon"
                      ></i>
                      <span class="mx-2" v-html="app?.meta?.name"></span>
                    </div>
                  </router-link>
                </b-col>
              </template>
              <template v-else>
                <b-col
                  class="col-4"
                  v-for="item in Math.min(typeApp.listPage?.length || 0, 5)"
                  :key="item"
                  md="4"
                >
                  <router-link
                    :to="{ path: `/${typeApp.listPage[item - 1].path}` }"
                  >
                    <div class="dropdown-icon-item">
                      <i
                        class="display-6 text-primary"
                        :class="typeApp.listPage[item - 1]?.meta.icon"
                      ></i>
                      <span
                        class="mx-2"
                        v-html="typeApp.listPage[item - 1]?.meta?.name"
                      ></span>
                    </div>
                  </router-link>
                </b-col>
                <b-col class="col-4" md="4">
                  <router-link :to="{ name: 'AppsPage' }">
                    <div class="dropdown-icon-item">
                      <i class="display-6 text-primary"></i>
                      <img src="@/assets/images/icon/apps/more.png" />
                      <span class="mx-2">Xem thêm</span>
                    </div>
                  </router-link>
                </b-col>
              </template>
            </b-row>
          </div>
        </template>
        <p v-else>Bạn không có quyền truy cập vào ứng dụng nào!</p>
      </div>
    </SimpleBar>
  </div>
</template>

<style scoped>
.dropdown-menu {
  background-color: #e9e9e9;
}

@media (min-width: 600px) {
  .dropdown-menu-lg {
    width: 380px;
  }
}
</style>
