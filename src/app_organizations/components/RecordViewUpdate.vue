<script setup>
import { BASE_URL } from "@/helpers/api/axiosHttp";
import { ref, defineProps, computed, watch, inject } from "vue";
import LayoutRecord from "../../app_manage_dynamic_api/layout/record/LayoutRecord.vue";
import { recordTreeNode } from "../useState/department.js";
import AccordionRecord from "@/base/components/accordion/AccordionRecord.vue";
import Select from "../../base/components/select/Select.vue";
import API from "../../app_manage_dynamic_api/helper/api/useAxios.js";
import Swal from "sweetalert2";
import { useFetch } from "../../helpers/api/api.js";
import TreeSelect from "../../base/components/tree-select/TreeSelect.vue";

const isViewOnly = computed(() => {
  return recordTreeNode.mode == "view" ? true : false;
});
const reloadData = inject("reload-department");
watch(
  () => recordTreeNode.departmentDetails,
  () => {
    // Cập nhật lại dữ liệu khi recordTreeNode.mode thay đổi
    updateData();
  }
);
const btnSubmit = ref(null);

const props = defineProps({
  idOffcanvas: {
    required: true,
  },
  organization: {},
});
const formData = ref({
  code: "",
  name: "",
  short_name: "",
  description: "",
  missions: "",
  phone_number: "",
  fax: "",
  email: "",
  address: "",
  department_head: "",
  parent: null,
  department_level: null,
  report_type: "",
});

const handleSubmitUpdateDepartment = () => {
  const temp = new FormData();
  Object.keys(formData.value).forEach((key) => {
    if (formData.value[key]) {
      temp.append(key, formData.value[key]);
    }
  });

  // Gửi dữ liệu lên API bằng axios
  API()
    .patch(
      `department/${recordTreeNode.idDepartment}/`,
      temp,
      "Cập nhật thành công"
    )
    .then(() => {
      reloadData();
    });
};
const handleClickDelete = async () => {
  const result = await Swal.fire({
    title: "Bạn có muốn xoá không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Không",
  });
  if (!result.isConfirmed) {
    return;
  }
  // Lấy thẻ div lớn theo id
  const parentDiv = document.getElementById(
    "offcanvasupdate-view-company-department"
  );

  // Truy vấn thẻ button bên trong thẻ div lớn
  const button = parentDiv.querySelector(
    'button.btn-icon[data-bs-dismiss="offcanvas"][aria-label="Close"]'
  );
  button.click();

  // Kiểm tra kết quả
  console.log(button);
  API()
    .remove(`department/${recordTreeNode.idDepartment}/`, "Đã xoá thành công")
    .then(() => {
      reloadData();
    });
};
const users = ref([]);
useFetch(`${BASE_URL}/api/user?all`).then((data) => {
  users.value = data?.results;
});
function updateData() {
  formData.value.code = recordTreeNode.departmentDetails.code;
  formData.value.name = recordTreeNode.departmentDetails.name;
  formData.value.short_name = recordTreeNode.departmentDetails.short_name;
  formData.value.description = recordTreeNode.departmentDetails.description;
  formData.value.missions = recordTreeNode.departmentDetails.missions;
  formData.value.phone_number = recordTreeNode.departmentDetails.phone_number;
  formData.value.fax = recordTreeNode.departmentDetails.fax;
  formData.value.email = recordTreeNode.departmentDetails.email;
  formData.value.address = recordTreeNode.departmentDetails.address;
  formData.value.department_head =
    recordTreeNode.departmentDetails.department_head?.id;
  formData.value.parent = recordTreeNode.departmentDetails.parent?.id;
  formData.value.department_level =
    recordTreeNode.departmentDetails.department_level?.id;
}
</script>
<template>
  <LayoutRecord
    :id="props.idOffcanvas"
    :title="recordTreeNode.mode == 'view' ? 'Xem chi tiết' : 'Chỉnh sửa'"
  >
    <template #header>
      <template v-if="recordTreeNode.mode == 'update'">
        <button
          @click="btnSubmit.click"
          type="button"
          class="btn btn-warning btn-icon waves-effect waves-light"
        >
          <i class="ri-save-2-fill"></i>
        </button>
        <button
          @click="updateData"
          type="button"
          class="btn btn-danger btn-icon waves-effect waves-light"
        >
          <i class="las la-undo-alt"></i>
        </button>
      </template>
      <template v-else>
        <button
          type="button"
          class="btn btn-warning btn-icon waves-effect waves-light"
          @click="recordTreeNode.mode = 'update'"
        >
          <i class="las la-edit"></i>
        </button>
        <button
          @click="handleClickDelete"
          type="button"
          class="btn btn-danger btn-icon waves-effect waves-light"
        >
          <i class="ri-delete-bin-5-line"></i>
        </button>
      </template>
    </template>
    <template #body>
      <form @submit.prevent="handleSubmitUpdateDepartment">
        <AccordionRecord title="THÔNG TIN CƠ BẢN">
          <!-- Tên phòng ban -->
          <div class="mb-3">
            <label for="name" class="form-label"
              >Tên phòng ban <span class="text-danger">*</span></label
            >
            <input
              v-model="formData.name"
              type="text"
              class="form-control"
              :placeholder="isViewOnly ? '' : 'Nhập tên phòng ban'"
              :disabled="isViewOnly"
              required
            />
          </div>
          <!-- Mã phòng ban -->
          <div class="mb-3">
            <label class="form-label"
              >Mã phòng ban <span class="text-danger">*</span></label
            >
            <input
              v-model="formData.code"
              type="text"
              class="form-control"
              :placeholder="isViewOnly ? '' : 'Nhập mã phòng ban'"
              :disabled="isViewOnly"
              required
            />
          </div>

          <!-- Tên viết tắt -->
          <div class="mb-3">
            <label for="short_name" class="form-label"
              >Tên viết tắt <span class="text-danger">*</span></label
            >
            <input
              v-model="formData.short_name"
              type="text"
              class="form-control"
              :placeholder="isViewOnly ? '' : 'Nhập tên viết tắt'"
              :disabled="isViewOnly"
              required
            />
          </div>

          <!-- ID của phòng ban trực thuộc -->
          <div class="mb-3 position-relative">
            <label for="parent" class="form-label">Phòng ban trực thuộc</label>
            <TreeSelect
              :treeData="props.organization"
              :convert="true"
              defaultValueLabel="Phòng ban trực thuộc"
              :defaultValue="recordTreeNode.departmentDetails?.parent"
              @on-selected="(value) => (formData.parent = value.id)"
              :disable="isViewOnly"
            ></TreeSelect>
          </div>

          <!-- ID của user -->
          <div class="mb-3">
            <label for="department_head" class="form-label">Trưởng phòng</label>
            <Select
              :localData="users"
              defaultValueLabel="Trưởng phòng"
              :isCloseOnSelect="true"
              labelField="str"
              :searchField="['str']"
              :isLocalSearch="true"
              :defaultValue="recordTreeNode.departmentDetails?.department_head"
              @change-data="(value) => (formData.department_head = value.id)"
              :disable="isViewOnly"
            ></Select>
          </div>
        </AccordionRecord>
        <AccordionRecord title="THÔNG TIN LIÊN HỆ">
          <!-- Số điện thoại -->
          <div class="mb-3">
            <label for="phone_number" class="form-label">Số điện thoại</label>
            <input
              v-model="formData.phone_number"
              type="tel"
              class="form-control"
              :placeholder="isViewOnly ? '' : 'Nhập số điện thoại'"
              :disabled="isViewOnly"
            />
          </div>

          <!-- Số Fax -->
          <div class="mb-3">
            <label for="fax" class="form-label">Số Fax</label>
            <input
              v-model="formData.fax"
              type="text"
              class="form-control"
              :placeholder="isViewOnly ? '' : 'Nhập số fax'"
              :disabled="isViewOnly"
            />
          </div>

          <!-- Thư điện tử -->
          <div class="mb-3">
            <label for="email" class="form-label">Thư điện tử</label>
            <input
              v-model="formData.email"
              type="email"
              class="form-control"
              :placeholder="isViewOnly ? '' : 'Nhập email'"
              :disabled="isViewOnly"
            />
          </div>

          <!-- Địa chỉ -->
          <div class="mb-3">
            <label for="address" class="form-label">Địa chỉ</label>
            <textarea
              v-model="formData.address"
              class="form-control"
              rows="3"
              :placeholder="isViewOnly ? '' : 'Nhập địa chỉ'"
              :disabled="isViewOnly"
            ></textarea>
          </div>
        </AccordionRecord>
        <AccordionRecord title="MÔ TẢ & NHIỆM VỤ">
          <!-- Mô tả -->
          <div class="mb-3">
            <label for="description" class="form-label">Mô tả</label>
            <textarea
              class="form-control"
              rows="3"
              :placeholder="isViewOnly ? '' : 'Nhập mô tả'"
              v-model="formData.description"
              :disabled="isViewOnly"
            ></textarea>
          </div>

          <!-- Chức năng/Nhiệm vụ -->
          <div class="mb-3">
            <label for="missions" class="form-label">Chức năng/Nhiệm vụ</label>
            <textarea
              v-model="formData.missions"
              class="form-control"
              rows="3"
              :placeholder="isViewOnly ? '' : 'Nhập chức năng hoặc nhiệm vụ'"
              :disabled="isViewOnly"
            ></textarea>
          </div>
        </AccordionRecord>

        <div class="mb-3">
          <label for="missions" class="form-label">Mẫu báo cáo</label>
          <select v-model="formData.report_type" class="form-select">
            <option disabled selected>Chọn mẫu báo cáo</option>
            <option value="quanly">Báo cáo Quản lý</option>
            <option value="telesale">Báo cáo Telesale</option>
          </select>
        </div>
        <!-- Nút Submit -->
        <div class="text-center" v-if="!isViewOnly">
          <button ref="btnSubmit" type="submit" class="btn btn-primary d-none">
            Cập Nhật
          </button>
        </div>
      </form>
    </template>
  </LayoutRecord>
</template>
