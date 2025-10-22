<script setup>
import { ref, reactive } from "vue";
import { useFetch } from "@/helpers/api/api.js";
import { BASE_URL } from "@/helpers/api/axiosHttp.js";
import { ID_ORGANIZATION } from "@/helpers/utils/config_system.js";
import { useUserStore } from "./userStore.js";
import flatPickr from "vue-flatpickr-component";
import AccordionRecord from "@/base/components/accordion/AccordionRecord.vue";
import Select from "@/base/components/select/Select.vue";
import TreeSelect from "@/base/components/tree-select/TreeSelect.vue";

const PROXY = BASE_URL.endsWith("/")
  ? BASE_URL + "api"
  : BASE_URL + "/" + "api";
const userStore = useUserStore();

const listRole = ref([]);

userStore.getListRole().then((data) => {
  listRole.value = data;
});

const userToAdd = userStore.userToAdd.value;

const usersCanAddToGroup = ref([]);

useFetch(PROXY + "/user/").then((data) => {
  usersCanAddToGroup.value = data["results"];

  usersCanAddToGroup.value.forEach((user) => {
    user.selected = false;
  });
});

// Username valid
const isExistUsername = ref(false);
const invalidUsername = ref(false);
const showPassword = ref(false);

// Email valid
const invalidEmail = ref(false);
const isExistEmail = ref(false);

// Phone valid
const invalidPhone = ref(false);

// Birth
const birthConfig = ref({
  allowInput: true, // Cho phép nhập tay
  altFormat: "d/m/Y",
  altInput: true,
  dateFormat: "Y-m-d",
});

const userData = reactive({
  preImg: require("@/assets/images/users/user-dummy-img.jpg"),
});
const onChangeUserLogo = ($e) => {
  let imgAvatar = $e.target.files[0];
  userData.preImg = window.URL.createObjectURL(imgAvatar);
  userToAdd.photo = imgAvatar;
};

const groups = ref([]);
console.log("BASE_URL", BASE_URL);
// Fetch all groups
useFetch(`${BASE_URL}/api/group/?all9`).then((res) => {
  groups.value = res.results;
});
</script>
<template>
  <form action="javascript:void(0)">
    <button class="d-none" type="reset" name="reset"></button>
    <b-row class="g-0 m-2">
      <b-col xl="12">
        <AccordionRecord title="THÔNG TIN NGƯỜI DÙNG">
          <b-row>
            <b-col lg="6" class="mb-3">
              <!-- Họ đệm -->
              <b-row>
                <b-col lg="6" class="mb-3">
                  <label for="fnameInput" class="form-label mb-1"
                    >Họ đệm <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="fnameInput"
                    placeholder="Nhập họ đệm"
                    name="first_name"
                    v-model="userToAdd.first_name"
                    :class="{ 'is-invalid': !userToAdd.first_name }"
                  />
                  <div
                    class="invalid-feedback d-block"
                    v-if="!userToAdd.first_name"
                  >
                    Vui lòng nhập họ đệm
                  </div>
                </b-col>
                <b-col lg="6" class="mb-3">
                  <!-- Tên -->
                  <label for="lnameInput" class="form-label mb-1"
                    >Tên <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="lnameInput"
                    placeholder="Nhập tên"
                    name="last_name"
                    v-model="userToAdd.last_name"
                    :class="{ 'is-invalid': !userToAdd.last_name }"
                  />
                  <div
                    class="invalid-feedback d-block"
                    v-if="!userToAdd.last_name"
                  >
                    Vui lòng nhập tên người dùng
                  </div>
                </b-col>
              </b-row>
              <!-- Tên tài khoản -->
              <div>
                <label for="usernameInput" class="form-label mb-1">
                  Tài khoản <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="usernameInput"
                  placeholder="Nhập tài khoản"
                  name="username"
                  v-model="userToAdd.username"
                  autocomplete="new-username"
                  :class="{
                    'is-invalid':
                      isExistUsername || invalidUsername || !userToAdd.username,
                  }"
                />
                <div
                  class="invalid-feedback d-block"
                  v-if="!userToAdd.username"
                >
                  Vui lòng nhập tên khoản
                </div>
                <div class="invalid-feedback d-block" v-if="isExistUsername">
                  Một người dùng với tên tài khoản này đã tồn tại
                </div>
                <div class="invalid-feedback d-block" v-if="invalidUsername">
                  Tên tài khoản không được chứa ký tự đặc biệt
                </div>
              </div>
              <!-- Mật khẩu -->
              <div>
                <label for="passwordInput" class="form-label mb-1 mt-3">
                  Mật khẩu <span class="text-danger">*</span>
                </label>
                <div class="position-relative auth-pass-inputgroup">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control pe-5 password-input"
                    placeholder="Nhập mật khẩu"
                    name="password"
                    id="passwordInput"
                    autocomplete="new-password"
                    v-model="userToAdd.password"
                    :class="{ 'is-invalid': !userToAdd.password }"
                  />
                  <button
                    :class="{ 'me-3': !userToAdd.password }"
                    @click="showPassword = !showPassword"
                    tabindex="-1"
                    class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                    type="button"
                    id="password-addon"
                  >
                    <i class="ri-eye-fill align-middle"></i>
                  </button>
                </div>
                <div
                  class="invalid-feedback d-block"
                  v-if="!userToAdd.password"
                >
                  Vui lòng nhập mật khẩu
                </div>
              </div>
            </b-col>
            <!-- Ảnh -->
            <b-col lg="6" class="mb-3">
              <label for="formFileLogoInput" class="form-label"
                >Ảnh đại diện</label
              >
              <div class="img-upload-slot">
                <div class="img-slot">
                  <img
                    class="img-custom"
                    :src="userData.preImg"
                    v-if="userData.preImg"
                  />
                  <div class="img-custom" v-else></div>
                </div>
                <input
                  class="form-control"
                  type="file"
                  id="formFileLogoInput"
                  @change="onChangeUserLogo"
                  style="display: none"
                />
                <label for="formFileLogoInput" class="label-upload-img"
                  ><i class="bx bx-camera fs-20"></i
                ></label>
              </div>
            </b-col>
            <!-- Email -->
            <b-col lg="6" class="mb-3">
              <b-row>
                <b-col sm="6">
                  <label for="emailInput" class="form-label mb-1">
                    Email <span class="text-danger">*</span></label
                  >
                </b-col>
                <b-col sm="6" class="text-end">
                  <router-link to="#">
                    <label class="text-danger pointer-cursor-custom"
                      ><i class="ri-close-circle-line"></i> Chưa xác nhận</label
                    >
                  </router-link>
                </b-col>
              </b-row>
              <div class="input-group">
                <input
                  type="email"
                  class="form-control"
                  id="emailInput"
                  placeholder="Nhập email"
                  name="email"
                  v-model="userToAdd.email"
                  :class="{
                    'is-invalid':
                      !userToAdd.email || invalidEmail || isExistEmail,
                  }"
                />
                <span class="input-group-text"
                  ><i class="ri-mail-line"></i
                ></span>
              </div>
              <div class="invalid-feedback d-block" v-if="!userToAdd.email">
                Vui lòng nhập email người dùng
              </div>
              <div class="invalid-feedback d-block" v-if="invalidEmail">
                Email không hợp lệ
              </div>
              <div class="invalid-feedback d-block" v-else-if="isExistEmail">
                Email này đã được đăng ký với tài khoản khác
              </div>
            </b-col>
            <!-- Số điện thoại -->
            <b-col lg="6" class="mb-3">
              <b-row>
                <b-col sm="6">
                  <label for="phoneInput" class="form-label mb-1">
                    Điện thoại</label
                  >
                </b-col>
                <b-col sm="6" class="text-end">
                  <router-link to="#">
                    <label class="text-danger pointer-cursor-custom"
                      ><i class="ri-close-circle-line"></i> Chưa xác nhận</label
                    >
                  </router-link>
                </b-col>
              </b-row>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  id="phoneInput"
                  placeholder="Nhập số điện thoại"
                  name="phone"
                  autocomplete="new-phone"
                  v-model="userToAdd.phone"
                />
                <span class="input-group-text"
                  ><i class="ri-phone-fill"></i
                ></span>
              </div>
              <div class="invalid-feedback d-block" v-if="invalidPhone">
                Số điện thoại không hợp lệ
              </div>
            </b-col>
            <!-- Ngày sinh -->
            <b-col lg="6" class="mb-3">
              <label class="form-label mb-1">Ngày sinh</label>
              <div
                class="input-group"
                style="
                  border: 1px solid #ced4da;
                  border-radius: 0.25rem;
                  overflow: hidden;
                "
              >
                <flat-pickr
                  placeholder="Nhập ngày sinh"
                  v-model="userData.birth"
                  :config="birthConfig"
                  class="form-control border-0 flatpickr-input"
                  id="caledate"
                ></flat-pickr>
                <span
                  class="input-group-text border-0"
                  style="border-left: 2px solid #ced4da !important"
                >
                  <i class="ri-calendar-event-line"></i
                ></span>
              </div>
            </b-col>
            <!-- Địa chỉ -->
            <b-col lg="6" class="mb-3">
              <label for="addressInput" class="form-label mb-1">Địa chỉ</label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  id="addressInput"
                  placeholder="Nhập địa chỉ"
                  name="address"
                  autocomplete="new-address"
                  v-model="userToAdd.address"
                />
                <span class="input-group-text"
                  ><i class="ri-building-line"></i
                ></span>
              </div> </b-col
          ></b-row>
        </AccordionRecord>

        <AccordionRecord title="QUYỀN NGƯỜI DÙNG">
          <b-row>
            <!-- Nhóm -->
            <b-col lg="6" class="mb-3">
              <label class="form-label mb-1">Nhóm</label>
              <Select
                :multiSelect="true"
                :localData="groups"
                v-model="userToAdd.groups"
                @change-data="
                  (data) => {
                    userToAdd.groups = data;
                  }
                "
              ></Select>
            </b-col>
            <!-- Phòng ban -->
            <b-col lg="6" class="mb-3">
              <label class="form-label mb-1">Phòng ban</label>
              <TreeSelect
                :api="`${PROXY}/organization/${ID_ORGANIZATION}/department/?all`"
                :convert="true"
                defaultValueLabel="Chọn phòng ban"
                @on-selected="(data) => {
                  userToAdd.department = [data];
                }"
              ></TreeSelect>
            </b-col>
            <!-- Vai trò -->
            <b-col lg="6" class="mb-3">
              <label class="form-label mb-1"
                >Vai trò <span class="text-danger">*</span></label
              >
              <Select
                :isCloseOnSelect="true"
                :localData="listRole"
                @change-data="
                  (data) => {
                    userToAdd.user_role = data.id;
                  }
                "
              ></Select>
            </b-col>
          </b-row>
        </AccordionRecord>
      </b-col>
    </b-row>
    <AccordionRecord title="TÀI KHOẢN STRINGEEX">
      <b-row>
        <b-col md="6" class="mb-3">
          <label for="usernameInput" class="form-label mb-1">
            Tài khoản đăng nhập StringeeX
          </label>
          <input
            type="text"
            class="form-control"
            id="usernameInput"
            placeholder="Nhập tài khoản"
            name="username"
            v-model="userToAdd.stringeex_id"
            autocomplete="new-username"
          />
        </b-col>
        <b-col md="6" class="mb-3">
          <label for="usernameInput" class="form-label mb-1">
            Mật khẩu đăng nhập StringeeX
          </label>
          <input
            type="text"
            class="form-control"
            id="usernameInput"
            placeholder="Nhập mật khẩu"
            name="username"
            v-model="userToAdd.stringeex_password"
            autocomplete="new-username"
          />
        </b-col>
      </b-row>
    </AccordionRecord>
    <AccordionRecord title="LIÊN KẾT">
      <b-row>
        <b-col md="6">
          <div class="mb-3 d-flex">
            <div class="avatar-xs d-block flex-shrink-0 me-2">
              <span class="avatar-title rounded-circle fs-16 bg-primary">
                <i class="ri-facebook-fill"></i>
              </span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Link to Faceook"
              v-model="userToAdd.social_network_link.facebook"
            />
          </div>
        </b-col>
        <b-col md="6">
          <div class="mb-3 d-flex">
            <div class="avatar-xs d-block flex-shrink-0 me-2">
              <span
                class="avatar-title rounded-circle fs-16 bg-dark text-light"
              >
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
                  />
                </svg>
              </span>
            </div>
            <input
              type="text"
              class="form-control"
              v-model="userToAdd.social_network_link.tiktok"
              placeholder="Link to Tiktok"
            />
          </div>
        </b-col>
        <b-col md="6">
          <div class="mb-3 d-flex">
            <div class="avatar-xs d-block flex-shrink-0 me-2">
              <span
                class="avatar-title rounded-circle fs-16 bg-white text-light"
              >
                <img
                  height="32"
                  width="32"
                  src="@/assets/images/icon/zalo-logo.png"
                />
              </span>
            </div>
            <input
              type="text"
              class="form-control"
              v-model="userToAdd.social_network_link.zalo"
              placeholder="Số điện thoại Zalo"
            />
          </div>
        </b-col>
      </b-row>
    </AccordionRecord>
  </form>
</template>
<style scoped>
.bg-head-title {
  background-color: #dbe4ff;
}

.bg-disabled {
  background-color: var(--vz-input-disabled-bg) !important;
}

.img-upload-slot {
  display: grid;
  place-items: center;
}

.label-upload-img {
  position: absolute;
  display: grid;
  padding: 10px;
  border-radius: 50%;
  border: 1px solid #393737;
  background: #d5d5d55c;
  color: #393737;
}

.img-slot {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem;
  background-color: var(--vz-body-bg);
  border: 1px solid var(--vz-border-color);
  border-radius: 0.25rem;
}

.img-custom {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.pointer-cursor-custom {
  cursor: pointer;
}
</style>
