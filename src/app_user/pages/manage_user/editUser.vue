<script setup>
import { reactive, ref, watch } from "vue";
import { useUserStore } from "./userStore.js";
import flatPickr from "vue-flatpickr-component";
import { BASE_URL } from "@/helpers/api/axiosHttp.js";
import AccordionRecord from "@/base/components/accordion/AccordionRecord.vue";
import Select from "@/base/components/select/Select.vue";
import TreeSelect from "@/base/components/tree-select/TreeSelect.vue";
import { ID_ORGANIZATION } from "@/helpers/utils/config_system.js";
import { useFetch } from "@/helpers/api/api.js";

const userStore = useUserStore();

const listRole = ref([]);

userStore.getListRole().then((data) => {
  listRole.value = data;
});

const userToEdit = reactive({
  phone: "",
  username: "",
  password: "***********",
  last_name: "",
  first_name: "",
  user_role: "",
  gender: 0,
  photo: null,
  photoUrl: null,
  email: "",
  introduce: "",
  social_network_link: {
    facebook: "",
    tiktok: "",
    zalo: "",
  },
  address: "",
  birth: "",
  cover_img: null,
  info_public: "{}",
  is_baned: "",
  groups: [],
  department: [],
  stringeex_id: "",
  stringeex_password: "",
});

const userRole = ref({});

watch(userStore.currentUser, () => {
  const currentUser = userStore.currentUser.value;
  userToEdit.username = currentUser.username;
  userToEdit.phone = currentUser.phone;
  userToEdit.last_name = currentUser.last_name;
  userToEdit.first_name = currentUser.first_name;
  userToEdit.gender = currentUser.gender;
  userToEdit.photoUrl =
    currentUser.photo != "/media/null"
      ? currentUser.photo
      : require("@/assets/images/users/user-dummy-img.jpg");
  userToEdit.photo = currentUser.photo;
  userToEdit.email = currentUser.email;
  userToEdit.introduce = currentUser.introduce;
  userToEdit.social_network_link.facebook =
    currentUser.social_network_link?.facebook ?? "";
  userToEdit.social_network_link.tiktok =
    currentUser.social_network_link?.tiktok ?? "";
  userToEdit.social_network_link.zalo =
    currentUser.social_network_link?.zalo ?? "";
  userToEdit.address = currentUser.address;
  userToEdit.birth = currentUser.birth;
  userToEdit.cover_img = currentUser.cover_img;
  userToEdit.info_public = currentUser.info_public;
  userToEdit.is_baned = currentUser.is_baned;
  userToEdit.user_role = currentUser.user_role;
  userToEdit.groups = currentUser.groups;
  userToEdit.department = currentUser.department;
  if (currentUser.user_role) {
    userToEdit.user_role = currentUser.user_role.id;
  }
  userRole.value = currentUser.user_role;
  userToEdit.stringeex_id = currentUser.stringeex_id;
  userToEdit.stringeex_password = currentUser.stringeex_password;
});

watch(userToEdit, () => {
  console.log("userToEdit changed", userToEdit);
  userStore.userToEdit.value = userToEdit;
});

// Username valid
const isExistUsername = ref(false);
const invalidUsername = ref(false);
// const showPassword = ref(false)

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

const onChangeUserLogo = ($e) => {
  let imgAvatar = $e.target.files[0];

  userToEdit.photoUrl = window.URL.createObjectURL(imgAvatar);
  userToEdit.photo = imgAvatar;
};

const groups = ref([]);
useFetch(`${BASE_URL}/api/group/?all9`).then((res) => {
  groups.value = res.results;
});
</script>
<template>
  <form action="#">
    <button class="d-none" type="reset" name="reset"></button>
    <b-row class="g-0 m-2">
      <b-col xl="12">
        <b-row>
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
                      placeholder="Nhập họ và tên đệm"
                      name="first_name"
                      v-model="userToEdit.first_name"
                      :class="{ 'is-invalid': !userToEdit.first_name }"
                    />
                    <div
                      class="invalid-feedback d-block"
                      v-if="!userToEdit.first_name"
                    >
                      Vui lòng nhập họ đệm
                    </div>
                  </b-col>
                  <b-col lg="6" class="mb-3">
                    <!-- Tên -->
                    <label for="lnameInput" class="form-label mb-1">
                      Tên
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="lnameInput"
                      placeholder="Nhập tên"
                      name="last_name"
                      v-model="userToEdit.last_name"
                      :class="{ 'is-invalid': !userToEdit.last_name }"
                    />
                    <div
                      class="invalid-feedback d-block"
                      v-if="!userToEdit.last_name"
                    >
                      Vui lòng nhập tên người dùng
                    </div>
                  </b-col>
                </b-row>
                <!-- Tên tài khoản -->
                <div class="mb-3">
                  <b-row>
                    <b-col sm="6">
                      <label for="usernameInput" class="form-label mb-1">
                        Tài khoản <span class="text-danger">*</span>
                      </label>
                    </b-col>
                    <b-col sm="6" class="text-end">
                      <router-link to="#">
                        <label
                          class="pointer-cursor-custom"
                          :class="
                            userToEdit?.is_baned?.boolean === false
                              ? 'text-success'
                              : 'text-danger'
                          "
                          ><i
                            :class="
                              userToEdit?.is_baned?.boolean === false
                                ? 'mdi mdi-account-heart-outline'
                                : 'mdi mdi-account-lock-outline'
                            "
                          ></i>
                          {{ userToEdit?.is_baned?.title }}</label
                        >
                      </router-link>
                    </b-col>
                  </b-row>
                  <input
                    type="text"
                    class="form-control"
                    id="usernameInput"
                    placeholder="Nhập tên tài khoản"
                    name="username"
                    v-model="userToEdit.username"
                    autocomplete="new-username"
                    disabled
                    :class="{
                      'is-invalid':
                        isExistUsername ||
                        invalidUsername ||
                        !userToEdit.username,
                    }"
                  />
                  <div
                    class="invalid-feedback d-block"
                    v-if="!userToEdit.username"
                  >
                    Vui lòng nhập tài khoản người dùng
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
                  <b-row>
                    <b-col sm="6">
                      <label for="passwordInput" class="form-label mb-1">
                        Mật khẩu <span class="text-danger">*</span></label
                      >
                    </b-col>
                    <b-col sm="6" class="text-end">
                      <router-link to="#">
                        <label
                          class="text-secondary pointer-cursor-custom"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvaspass-user"
                          aria-controls="offcanvaspass-user"
                          ><i class="mdi mdi-form-textbox-password"></i> Đổi mật
                          khẩu</label
                        >
                      </router-link>
                    </b-col>
                  </b-row>
                  <div class="position-relative auth-pass-inputgroup">
                    <input
                      type="password"
                      class="form-control pe-5 password-input"
                      placeholder="Nhập mật khẩu"
                      name="password"
                      id="passwordInput"
                      autocomplete="new-password"
                      v-model="userToEdit.password"
                      disabled
                    />
                    <!-- <button :class="{ 'me-3': !userToEdit.password }" @click="showPassword = !showPassword" tabindex="-1"
                    class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                    type="button" id="password-addon">
                    <i class="ri-eye-fill align-middle"></i>
                  </button> -->
                  </div>
                </div>
              </b-col>
              <!-- Ảnh -->
              <b-col lg="6" class="mb-3">
                <label for="formFileBannerInput_edit" class="form-label"
                  >Ảnh đại diện</label
                >
                <div class="img-upload-slot">
                  <div class="img-slot">
                    <img
                      class="img-custom"
                      :src="userToEdit.photoUrl"
                      v-if="userToEdit.photo"
                    />
                    <img
                      class="img-custom"
                      src="@/assets/images/users/user-dummy-img.jpg"
                      v-else
                    />
                  </div>
                  <input
                    class="form-control"
                    type="file"
                    id="formFileBannerInput_edit"
                    @change="onChangeUserLogo"
                    style="display: none"
                  />
                  <label for="formFileBannerInput_edit" class="label-upload-img"
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
                        ><i class="ri-close-circle-line"></i> Chưa xác
                        nhận</label
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
                    v-model="userToEdit.email"
                    :class="{
                      'is-invalid':
                        !userToEdit.email || invalidEmail || isExistEmail,
                    }"
                  />
                  <span class="input-group-text"
                    ><i class="ri-mail-line"></i
                  ></span>
                </div>
                <div class="invalid-feedback d-block" v-if="!userToEdit.email">
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
                        ><i class="ri-close-circle-line"></i> Chưa xác
                        nhận</label
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
                    v-model="userToEdit.phone"
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
                <div class="input-group">
                  <flat-pickr
                    v-model="userToEdit.birth"
                    name="birth"
                    :config="birthConfig"
                    class="form-control flatpickr-input"
                    placeholder="Nhập ngày sinh"
                  />
                  <span class="input-group-text"
                    ><i class="ri-calendar-event-line"></i
                  ></span>
                </div>
              </b-col>
              <!-- Địa chỉ -->
              <b-col lg="6" class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Địa chỉ</label
                >
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    id="addressInput"
                    placeholder="Nhập địa chỉ"
                    name="address"
                    autocomplete="new-address"
                    v-model="userToEdit.address"
                  />
                  <span class="input-group-text"
                    ><i class="ri-building-line"></i
                  ></span>
                </div>
              </b-col>
            </b-row>
          </AccordionRecord>

          <AccordionRecord title="QUYỀN NGƯỜI DÙNG">
            <b-row>
              <!-- Nhóm -->
              <b-col lg="6" class="mb-3">
                <label class="form-label mb-1">Nhóm</label>

                <Select
                  :multiSelect="true"
                  :localData="groups"
                  :defaultValue="userToEdit.groups"
                  @change-data="
                    (data) => {
                      userToEdit.groups = data;
                    }
                  "
                ></Select>
              </b-col>
              <!-- Phòng ban -->
              <b-col lg="6" class="mb-3">
                <label class="form-label mb-1">Phòng ban</label>

                <TreeSelect
                  :api="`${BASE_URL}/api/organization/${ID_ORGANIZATION}/department/?all`"
                  :convert="true"
                  defaultValueLabel="Chọn phòng ban"
                  :defaultSelected="userToEdit.department[0]"
                  @on-selected="
                    (data) => {
                      userToEdit.department = [data];
                    }
                  "
                ></TreeSelect>
              </b-col>
              <!-- Vai trò -->
              <b-col lg="6" class="mb-3">
                <label class="form-label mb-1"
                  >Vai trò <span class="text-danger">*</span></label
                >
                <Select
                  :localData="listRole"
                  :isCloseOnSelect="true"
                  :defaultValue="userRole"
                  @change-data="
                    (data) => {
                      userToEdit.user_role = data?.id;
                    }
                  "
                ></Select>
              </b-col>
            </b-row>
          </AccordionRecord>
        </b-row>
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
            v-model="userToEdit.stringeex_id"
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
            v-model="userToEdit.stringeex_password"
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
              v-model="userToEdit.social_network_link.facebook"
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
              v-model="userToEdit.social_network_link.tiktok"
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
              v-model="userToEdit.social_network_link.zalo"
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
