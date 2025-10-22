<template>
  <LayoutMain v-cloak class="pt-5 pt-lg-0">
    <div class="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
      <div class="container">
        <div class="d-flex justify-content-center mt-3">
          <div class="col-md-10" style="max-width: 768px">
            <div class="card">
              <div class="bg-warning-subtle position-relative">
                <div class="card-body p-5">
                  <div class="text-center">
                    <h3>Thông tin ứng viên</h3>
                    <p class="mb-0 text-muted">
                      Biểu mẫu điền thông tin cá nhân
                    </p>
                  </div>
                </div>
                <div class="shape">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xmlns:svgjs="http://svgjs.com/svgjs"
                    width="1440"
                    height="60"
                    preserveAspectRatio="none"
                    viewBox="0 0 1440 60"
                  >
                    <g mask='url("#SvgjsMask1001")' fill="none">
                      <path
                        d="M 0,4 C 144,13 432,48 720,49 C 1008,50 1296,17 1440,9L1440 60L0 60z"
                        style="fill: var(--vz-secondary-bg)"
                      ></path>
                    </g>
                    <defs>
                      <mask id="SvgjsMask1001">
                        <rect width="1440" height="60" fill="#ffffff"></rect>
                      </mask>
                    </defs>
                  </svg>
                </div>
              </div>
              <div class="card-footer">
                <p class="card-text">
                  <small class="text-danger">* Biểu thị câu hỏi bắt buộc</small>
                </p>
              </div>
            </div>
            <div class="card">
              <div class="card-body p-4">
                <form @submit.prevent="handleSubmit">
                  <AccordionRecord class="card" title="THÔNG TIN ỨNG VIÊN">
                    <div class="card-body pt-0">
                      <div class="row">
                        <div class="mb-3 col-md-6">
                          <label for="fullName" class="form-label fw-bold"
                            >Họ: <span class="text-danger">*</span></label
                          >
                          <input
                            type="text"
                            class="form-control"
                            required
                            v-model="formData.first_name"
                          />
                        </div>
                        <div class="mb-3 col-md-6">
                          <label for="fullName" class="form-label fw-bold"
                            >Tên: <span class="text-danger">*</span></label
                          >
                          <input
                            type="text"
                            class="form-control"
                            required
                            v-model="formData.last_name"
                          />
                        </div>
                      </div>
                      <div class="mb-3">
                        <label for="gender" class="form-label fw-bold"
                          >Giới tính: <span class="text-danger">*</span></label
                        >
                        <div class="row">
                          <div class="col-3 d-flex align-items-center gap-2">
                            <input
                              type="radio"
                              id="male"
                              value="Nam"
                              v-model="formData.gender_display"
                              required
                            />
                            <label class="mb-0" for="male">Nam</label>
                          </div>
                          <div class="col-3 d-flex align-items-center gap-2">
                            <input
                              type="radio"
                              id="female"
                              value="Nữ"
                              v-model="formData.gender_display"
                              required
                            />
                            <label class="mb-0" for="female">Nữ</label>
                          </div>
                        </div>
                      </div>
                      <div class="mb-3">
                        <label
                          for="identificationNumber"
                          class="form-label fw-bold"
                          >Số CMND/CCCD:
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="identificationNumber"
                          v-model="formData.identification_number"
                        />
                      </div>
                      <div class="mb-3">
                        <label
                          for="permanentResidence"
                          class="form-label fw-bold"
                          >Địa chỉ thường trú:</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="permanentResidence"
                          v-model="formData.permanent_residence"
                        />
                      </div>
                      <form
                        @submit.prevent="handleSubmitCCCD"
                        class="mb-3 col-12"
                      >
                        <label for="fullName" class="form-label fw-bold">
                          Lấy dữ liệu từ CCCD
                        </label>
                        <div class="input-group">
                          <input
                            type="file"
                            name="photo"
                            class="form-control"
                            required
                          />
                          <button class="btn btn-outline-success" type="submit">
                            Đọc dữ liệu
                          </button>
                        </div>
                      </form>
                    </div>
                  </AccordionRecord>

                  <AccordionRecord
                    class="card"
                    title="THÔNG TIN LIÊN HỆ ỨNG VIÊN"
                  >
                    <div class="card-body pt-0">
                      <div class="mb-3">
                        <label for="phone" class="form-label fw-bold"
                          >Điện thoại: <span class="text-danger">*</span></label
                        >
                        <input
                          type="text"
                          class="form-control"
                          required
                          v-model="formData.phone"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="currentResidence" class="form-label fw-bold"
                          >Nơi ở hiện tại:</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="currentResidence"
                          v-model="formData.current_residence"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="email" class="form-label fw-bold"
                          >Email:
                        </label>
                        <input
                          type="email"
                          class="form-control"
                          id="email"
                          v-model="formData.email"
                        />
                      </div>
                    </div>
                  </AccordionRecord>

                  <AccordionRecord
                    class="card"
                    title="THÔNG TIN NĂNG LỰC ỨNG VIÊN"
                  >
                    <div class="card-body pt-0">
                      <div class="mb-3">
                        <label for="hometown" class="form-label fw-bold"
                          >Quê quán:</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="hometown"
                          v-model="formData.hometown"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="educationalLevel" class="form-label fw-bold"
                          >Trình độ học vấn:</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="educationalLevel"
                          v-model="formData.educational_level"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="skill" class="form-label fw-bold"
                          >Kỹ năng:</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="skill"
                          v-model="formData.skill"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="skill" class="form-label fw-bold"
                          >Chiến dịch:</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          :value="ValueView.campaign?.name"
                          disabled
                        />
                      </div>
                      <div class="mb-3">
                        <label for="skill" class="form-label fw-bold"
                          >Mã giới thiệu:</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          :value="ValueView.affiliate?.username"
                          :disabled="ValueView.affiliate?.username"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="description" class="form-label fw-bold"
                          >Mô tả:</label
                        >
                        <textarea
                          class="form-control"
                          id="description"
                          v-model="formData.description"
                        ></textarea>
                      </div>
                    </div>
                  </AccordionRecord>
                  <div class="text-end hstack gap-2 justify-content-end d-none">
                    <button
                      ref="btnSubmit"
                      type="submit"
                      class="btn btn-success"
                    >
                      Lưu thông tin
                    </button>
                    <button
                      ref="btnReset"
                      type="reset"
                      class="btn btn-outline-danger"
                    >
                      <i class="ri-close-line align-bottom me-1"></i> Hủy bỏ
                    </button>
                  </div>
                  <div class="text-end hstack gap-2 justify-content-end">
                    <button type="submit" class="btn btn-success">
                      Lưu thông tin
                    </button>
                    <button type="reset" class="btn btn-outline-danger">
                      <i class="ri-close-line align-bottom me-1"></i> Hủy bỏ
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <!--end col-->
        </div>
      </div>
    </div></LayoutMain
  >
</template>

<script setup>
import { reactive } from "vue";
import { useRoute } from "vue-router";
import API from "@/helpers/api/useAxios.js";
import LayoutMain from "../layout/LayoutMain.vue";
import AccordionRecord from "@/base/components/accordion/AccordionRecord.vue";

const route = useRoute();
const formData = reactive({
  first_name: "",
  last_name: "",
  gender_display: "",
  description: "",
  phone: null,
  email: null,
  permanent_residence: "",
  current_residence: "",
  hometown: "",
  household_head: "",
  identification_number: "",
  skill: "",
  educational_level: "",
  introducer: route.query.aff ?? "",
  campaign: route.query.campaign_id ?? "",
});

const ValueView = reactive({
  campaign: {},
  affiliate: {},
});

if (route.query?.aff) {
  API()
    .get(`user/${route.query.aff}/`)
    .then((responsive) => {
      if (responsive?.id) ValueView.affiliate = { ...responsive };
    })
    .catch((error) => {
      console.error(error);
    });
}

if (route.query?.campaign_id) {
  API()
    .get(`campaign/${route.query.campaign_id}/`)
    .then((responsive) => {
      if (responsive?.id) ValueView.campaign = { ...responsive };
    })
    .catch((error) => {
      console.error(error);
    });
}

const handleSubmit = () => {
  API().post(
    "candidate/",
    formData,
    "Đã lưu lại thông tin của bạn",
    "Vui lòng kiểm tra lại thông tin!"
  );
};

const handleSubmitCCCD = (event) => {
  let temp_formData = new FormData(event.target);
  API()
    .post(
      "scan-qr/",
      temp_formData,
      "Vui lòng kiểm tra lại thông tin!",
      "Cần đúng ảnh CCCD"
    )
    .then((res) => {
      // Tách tên đầy đủ thành họ và tên
      const nameParts = res.full_name.split(" ");
      const firstName = nameParts.shift();
      const lastName = nameParts.join(" ");

      // Gán giá trị vào formData
      formData.first_name = firstName;
      formData.last_name = lastName;
      formData.gender_display = res.sex;
      formData.permanent_residence = res.place_of_residence;
      formData.identification_number = res.cccd;
    });
};
</script>

<style scoped>
.bg-warning-subtle {
  background-color: #fff3cd;
}
.shape {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
