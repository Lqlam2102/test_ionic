<script setup>
import { CompanyInfor } from "@/helpers/user/company.js";
</script>
<template>
  <footer class="custom-footer bg-dark py-5 position-relative">
    <b-container>
      <b-row>
        <b-col lg="4">
          <div>
            <div>
              <div class="align-items-center d-flex gap-2">
                <img :src="CompanyInfor.photo" alt="logo light" height="42" />
                <h5 class="text-white fs-16 text-uppercase mb-0 pb-0">
                  {{ CompanyInfor.name }}
                </h5>
              </div>
              <p class="fs-11 mt-3">{{ CompanyInfor.short_name }}</p>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="card-body">
                  <p>
                    <i class="ri-map-pin-line me-1 align-bottom"></i>
                    Địa chỉ: {{ CompanyInfor.address ?? "_" }}
                  </p>
                  <p>
                    <i class="ri-building-line me-1 align-bottom"></i>
                    Văn Phòng: {{ CompanyInfor.address ?? "_" }}
                  </p>
                  <p>
                    <i class="ri-phone-line me-1 align-bottom"></i>
                    Điện thoại: {{ CompanyInfor.phone_number ?? "_" }}
                  </p>
                  <p>
                    <i class="mdi mdi-email me-1 align-bottom"></i>
                    Email: {{ CompanyInfor.email ?? "_" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </b-col>

        <b-col lg="7" class="ms-lg-auto">
          <b-row>
            <b-col sm="4" class="mt-4">
              <h5 class="text-white mb-0">
                {{ CompanyInfor.short_name }}
              </h5>
              <div class="text-muted mt-3">
                <ul class="list-unstyled ff-secondary footer-list">
                  <li>
                    <router-link to="#">Tài khoản</router-link>
                  </li>
                  <li>
                    <router-link to="#">Phương thức thanh toán</router-link>
                  </li>
                </ul>
              </div>
            </b-col>
            <b-col sm="4" class="mt-4">
              <h5 class="text-white mb-0">Điều khoản & Chính sách</h5>
              <div class="text-muted mt-3">
                <ul class="list-unstyled ff-secondary footer-list">
                  <li>
                    <router-link to="#">Chính sách quy định</router-link>
                  </li>
                  <li>
                    <router-link to="#">Điều khoản</router-link>
                  </li>
                </ul>
              </div>
            </b-col>
            <b-col sm="4" class="mt-4">
              <h5 class="text-white mb-0">Về chúng tôi</h5>
              <div class="text-muted mt-3">
                <ul class="list-unstyled ff-secondary footer-list">
                  <li>
                    <router-link to="#">Giới thiệu</router-link>
                  </li>
                  <li>
                    <router-link to="#">Tin tức & Sự kiện</router-link>
                  </li>
                  <li>
                    <router-link to="#">Liên hệ</router-link>
                  </li>
                </ul>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-row class="text-center text-sm-start align-items-center mt-5">
        <b-col sm="6">
          <div>
            <p class="copy-rights mb-0 currentyear">
              © {{ new Date().getFullYear() }} {{ CompanyInfor.name }} | Powered
              by METATWIN
            </p>
          </div>
        </b-col>
        <b-col sm="6">
          <div class="text-sm-end mt-3 mt-sm-0">
            <ul class="list-inline mb-0 footer-social-link">
              <li class="list-inline-item">
                <b-link
                  :href="
                    `https://www.facebook.com/${CompanyInfor.social_network_link.facebook}` ||
                    '#'
                  "
                  class="avatar-xs d-block"
                >
                  <div class="avatar-title rounded-circle">
                    <i class="ri-facebook-fill"></i>
                  </div>
                </b-link>
              </li>
              <li class="list-inline-item">
                <b-link
                  :href="
                    `https://www.tiktok.com/@${CompanyInfor.social_network_link.tiktok}` ||
                    '#'
                  "
                  class="avatar-xs d-block"
                >
                  <div class="avatar-title rounded-circle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-tiktok"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"
                      ></path>
                    </svg>
                  </div>
                </b-link>
              </li>
              <li class="list-inline-item">
                <b-link
                  :href="
                    `https://zalo.me/${CompanyInfor.social_network_link.zalo}` ||
                    '#'
                  "
                  class="avatar-xs d-block"
                >
                  <div class="avatar-title rounded-circle">
                    <img
                      height="16"
                      width="16"
                      src="@/assets/images/icon/zalo-logo.png"
                    />
                  </div>
                </b-link>
              </li>
            </ul>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </footer>
</template>
<style scoped>
* {
  font-size: 12px;
}
</style>
