<script setup>
import {
  defineExpose,
  defineProps,
  defineEmits,
  ref,
  watch,
  reactive,
} from "vue";
import API from "@/app_manage_dynamic_api/helper/api/useAxios";
import AccordionRecord from "@/base/components/accordion/AccordionRecord.vue";

// Nhập props và emit
const emit = defineEmits(["submit", "update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  valueView: {
    type: Object,
    default: function () {
      return {
        affiliate: {},
        campaign: {},
      };
    },
  },
});

const btnReset = ref(undefined);
const btnSubmit = ref(undefined);

// Tạo một ref để lưu trữ dữ liệu
const formData = reactive({ ...props.modelValue });
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

// Theo dõi sự thay đổi trong formData và emit lại "update:modelValue"
watch(
  formData,
  (newValue) => {
    console.log(newValue);
    
    emit("update:modelValue", newValue);
  },
  { deep: true } // Theo dõi sâu các thay đổi trong object
);

const handleSubmit = () => {
  emit("submit");
};

defineExpose({
  btnReset,
  btnSubmit,
});
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <AccordionRecord class="card" title="THÔNG TIN ỨNG VIÊN">
      <div class="card-body pt-0">
        <div class="row">
          <div class="mb-3 col-md-6">
            <label for="fullName" class="form-label fw-bold">
              Họ: <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              required
              v-model="formData.first_name"
            />
          </div>
          <div class="mb-3 col-md-6">
            <label for="fullName" class="form-label fw-bold">
              Tên: <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              required
              v-model="formData.last_name"
            />
          </div>
        </div>
        <div class="mb-3">
          <label for="gender" class="form-label fw-bold">
            Giới tính: <span class="text-danger">*</span>
          </label>
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
          <label for="identificationNumber" class="form-label fw-bold">
            Số CMND/CCCD:
          </label>
          <input
            type="text"
            class="form-control"
            id="identificationNumber"
            v-model="formData.identification_number"
          />
        </div>
        <div class="mb-3">
          <label for="permanentResidence" class="form-label fw-bold">
            Địa chỉ thường trú:
          </label>
          <input
            type="text"
            class="form-control"
            id="permanentResidence"
            v-model="formData.permanent_residence"
          />
        </div>
        <form @submit.prevent="handleSubmitCCCD" class="mb-3 col-12">
          <label for="cccdFile" class="form-label fw-bold">
            Lấy dữ liệu từ CCCD
          </label>
          <div class="input-group">
            <input type="file" name="photo" class="form-control" required />
            <button class="btn btn-outline-success" type="submit">
              Đọc dữ liệu
            </button>
          </div>
        </form>
      </div>
    </AccordionRecord>
    <AccordionRecord class="card" title="THÔNG TIN LIÊN HỆ ỨNG VIÊN">
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
          <label for="email" class="form-label fw-bold">Email: </label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="formData.email"
          />
        </div>
      </div>
    </AccordionRecord>
    <AccordionRecord class="card" title="THÔNG TIN NĂNG LỰC ỨNG VIÊN">
      <div class="card-body pt-0">
        <div class="mb-3">
          <label for="hometown" class="form-label fw-bold">Quê quán:</label>
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
          <label for="skill" class="form-label fw-bold">Kỹ năng:</label>
          <input
            type="text"
            class="form-control"
            id="skill"
            v-model="formData.skill"
          />
        </div>
        <div class="mb-3">
          <label for="skill" class="form-label fw-bold">Chiến dịch:</label>
          <input
            type="text"
            class="form-control"
            :value="valueView.campaign?.name"
            disabled
          />
        </div>
        <div class="mb-3">
          <label for="skill" class="form-label fw-bold">Mã giới thiệu:</label>
          <input
            type="text"
            class="form-control"
            :value="valueView.affiliate?.username"
            :disabled="valueView.affiliate?.username"
          />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label fw-bold">Mô tả:</label>
          <textarea
            class="form-control"
            id="description"
            v-model="formData.description"
          ></textarea>
        </div>
      </div>
    </AccordionRecord>
    <div class="text-end hstack gap-2 justify-content-end d-none">
      <button ref="btnSubmit" type="submit" class="btn btn-success">
        Lưu thông tin
      </button>
      <button ref="btnReset" type="reset" class="btn btn-outline-danger">
        <i class="ri-close-line align-bottom me-1"></i> Hủy bỏ
      </button>
    </div>
  </form>
</template>
