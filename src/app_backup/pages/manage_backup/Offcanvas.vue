<script setup>
import API from "@/helpers/api/useAxios.js";
import { BASE_URL } from "@/helpers/api/axiosHttp";
import { inject, ref, watch } from "vue";
import LayoutRecord from "@/app_manage_dynamic_api/layout/record/LayoutRecord.vue";
// import http from "@/helpers/api/axiosHttp";
import { toast } from "vue3-toastify";
// import { errorToast, successToast } from "@/helpers/api/toastStyle.js";
// import Swal from "sweetalert2";
// import { getTime } from "@/app_manage_dynamic_api/common/common";
// import { createObjectFile } from "@/app_manage_dynamic_api/common/common.js";

// const source_api = inject("source-api");
const record_target = inject("record-target");
const manage_data = inject("manage-data");

// const form_backup = reactive({
//   app_name: "",
//   action_time: "",
//   handler: "",
// });

const nameBackup = ref("");

const toastId = ref("");
const notify = (text) =>
  (toastId.value = toast.loading(text, {
    autoClose: false,
    transition: toast.TRANSITIONS.SLIDE,
    position: toast.POSITION.BOTTOM_RIGHT,
    icon: false,
  }));
const close = () => {
  toast.remove(toastId.value);
};

watch(record_target, () => {
  getDetail();
});

const getDetail = async () => {
  // form_backup.app_name = "";
  // form_backup.action_time = "";
  // form_backup.handler = "";

  // const response = await http.get(`/${source_api}/${record_target.value}/`);
  // if (response.status === 200) {
  //   form_backup.app_name = response.data.app_name;
  //   form_backup.action_time = response.data.action_time;
  //   form_backup.handler = response.data.handler.username;
  // }

  const { data } = manage_data.getData();
  
  nameBackup.value =
    (data?.results ?? []).find((item) => item.id === record_target.value)
      ?.name ?? "";
};

async function handleClickAdd() {
  notify("Đang tạo mới ...");

  const res = await API().post(
    `${BASE_URL}/api/backup/`,
    { name: nameBackup.value },
    "Tạo mới thành công!",
    "Không thể tạo mới"
  );
  if (res?.ok) {
    manage_data.handleCallApi();
  }
  close();
}
const handleClickSaveEdit = async () => {
  const res = await API().patch(
    `backup/${record_target.value}/`,
    { name: nameBackup.value },
    "Chỉnh sửa thành công!",
    "Không thể chỉnh sửa"
  );
  if (res?.ok) {
    manage_data.handleCallApi();
  }
};

// async function handleClickDownload() {
//   const result = await Swal.fire({
//     title: "Bạn có muốn tải xuống bản backup này không?",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#3085d6",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "Đồng ý",
//     cancelButtonText: "Không",
//   });
//   if (!result.isConfirmed) {
//     return;
//   }
//   notify("Đang tải xuống ...");

//   try {
//     const res = await API().get(
//       `${BASE_URL}/api/dowload-backup/${record_target.value}/`,
//       "arraybuffer"
//     );
//     createObjectFile(res, `${form_backup.app_name}.zip`, "application/zip");
//     successToast("Tải xuống thành công");
//   } catch (error) {
//     errorToast("Lỗi khi tải xuống");
//   }
//   close();
// }

// const handleClickRestore = async () => {
//   const result = await Swal.fire({
//     title: "Bạn có muốn khôi phục bản backup này không?",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#3085d6",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "Đồng ý",
//     cancelButtonText: "Không",
//   });
//   if (!result.isConfirmed) {
//     return;
//   }
//   Swal.fire("Khôi phục", `Bạn đã khôi phục thành công`, "success");
// };
</script>

<template>
  <LayoutRecord id="Backup" title="Thêm mới">
    <template #header>
      <button
        type="button"
        class="btn btn-warning btn-icon waves-effect waves-light"
        @click="handleClickAdd"
      >
        <i class="ri-save-2-fill"></i>
      </button>
      <button
        type="button"
        class="btn btn-danger btn-icon waves-effect waves-light"
        @click="
          () => {
            nameBackup = '';
          }
        "
      >
        <i class="las la-undo-alt"></i>
      </button>
    </template>
    <template #body>
      <form action="#" id="view">
        <b-row class="g-0 m-2">
          <b-col xl="12">
            <b-row>
              <b-col lg="12" class="mb-3">
                <label class="form-label me-3"> Tên Backup: </label>
                <input
                  v-model="nameBackup"
                  placeholder="Nhập tên bản backup..."
                  class="form-control"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </form>
    </template>
  </LayoutRecord>
  <LayoutRecord id="edit-backup" title="Chỉnh sửa">
    <template #header>
      <button
        type="button"
        class="btn btn-warning btn-icon waves-effect waves-light"
        @click="handleClickSaveEdit"
      >
        <i class="ri-save-2-fill"></i>
      </button>
      <button
        type="button"
        class="btn btn-danger btn-icon waves-effect waves-light"
        @click="getDetail"
      >
        <i class="las la-undo-alt"></i>
      </button>
    </template>
    <template #body>
      <form action="#">
        <b-row class="g-0 m-2">
          <b-col xl="12">
            <b-row>
              <b-col lg="12" class="mb-3">
                <label class="form-label me-3"> Tên Backup: </label>
                <input
                  v-model="nameBackup"
                  placeholder="Nhập tên bản backup..."
                  class="form-control"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </form>
    </template>
  </LayoutRecord>
  <!-- <LayoutRecord id="view-backup" title="Xem chi tiết">
    <template #header> </template>
    <template #body>
      <form action="#" id="view">
        <b-row class="g-0 m-2">
          <b-col xl="12">
            <b-row>
              <b-col class="mb-3" lg="12">
                <button
                  class="accordion-button p-2 bg-head-title"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#accor_iconExamplecollapse1"
                  aria-expanded="true"
                  aria-controls="accor_iconExamplecollapse1"
                >
                  THÔNG TIN BACKUP
                </button>
              </b-col>
              <b-col lg="12" class="mb-3">
                <label for="name" class="form-label"> Tên </label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="form_backup.app_name"
                  disabled
                />
              </b-col>
              <b-col lg="6" class="mb-3">
                <label for="handler" class="form-label">
                  Tài khoản thực hiện
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="handler"
                  v-model="form_backup.handler"
                  disabled
                />
              </b-col>
              <b-col lg="6" class="mb-3">
                <label for="action_time" class="form-label"> Thời gian </label>
                <input
                  type="text"
                  class="form-control"
                  id="action_time"
                  :value="getTime(form_backup.action_time)"
                  disabled
                />
              </b-col>
              <b-col lg="6" class="mb-3">
                <button
                  type="button"
                  class="btn btn-success waves-effect waves-light me-3"
                  @click="handleClickDownload"
                >
                  Tải xuống
                </button>
                <button
                  type="button"
                  class="btn btn-warning waves-effect waves-light"
                  @click="handleClickRestore"
                >
                  Khôi phục
                </button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </form>
    </template>
  </LayoutRecord> -->
</template>

<style>
.pre-img {
  width: 200px;
  border: 1px solid #ababab;
}

.bg-head-title {
  background-color: #dbe4ff !important;
}
</style>
