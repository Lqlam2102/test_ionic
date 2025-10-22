<script setup>
import Swal from "sweetalert2";
import { defineProps, provide, ref } from "vue";
import API from "@/helpers/api/useAxios.js";
import classManageData from "@/app_manage_dynamic_api/hook/state/manage_data.js";
import Layout from "@/app_manage_dynamic_api/layout/main.vue";
import LayoutDemo from "@/app_manage_dynamic_api/layout/LayoutDemo.vue";
import OffcanvasUser from "./Offcanvas.vue";
import { toast } from "vue3-toastify";
// import { errorToast, successToast } from "@/helpers/api/toastStyle.js";
// import { createObjectFile } from "@/app_manage_dynamic_api/common/common.js";

const address = {
  title: props.nameKCN,
  details: [{ name: "Quản lý " + props.nameKCN, to: "#" }],
};
const props = defineProps({
  slug: {
    type: String,
    default: "sipm-base",
  },
  nameKCN: {
    type: String,
    default: "SAO LƯU",
  },
  sourceApi: {
    type: String,
    default: "backup",
  },
});

const record_target = ref(null);
const manage_data = new classManageData(
  `${props.sourceApi}`,
  "action=Backup media"
);
provide("source-api", props.sourceApi);
provide("manage-data", manage_data);
provide("record-target", record_target);

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

// const handleClickDetail = ($event) => {
//   const item = getValueItem($event);
//   record_target.value = item.id;
// };

// const handleClickDownload = async ($event) => {
//   const item = getValueItem($event);

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
//       `${BASE_URL}/api/dowload-backup/${item.id}/`,
//       "arraybuffer"
//     );
//     createObjectFile(res, `${item.app_name}.zip`, "application/zip");
//     successToast("Tải xuống thành công");
//   } catch (error) {
//     errorToast("Lỗi khi tải xuống");
//   }
//   close();
// };

const handleClickRestore = async ($event) => {
  const item = getValueItem($event);
  const result = await Swal.fire({
    title: "Bạn có muốn khôi phục bản backup này không?",
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
  notify("Đang backup ...");
  await API().post(
    `restore/`,
    { id: item.id },
    "đã Khôi phục",
    "Không thể khôi phụccjf"
  );
  close();
};

const handleClickDelete = async ($event) => {
  const item = getValueItem($event);
  const result = await Swal.fire({
    title: "Bạn có muốn xoá bản backup này không?",
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
  API().remove(`backup/${item.id}/`, "Đã xoá thành công!");
  manage_data.handleCallApi();
};
const handleClickEdit = ($event) => {
  const item = getValueItem($event);
  record_target.value = item.id;
};

const getValueItem = ($event) => {
  const target = $event.target.closest("ul");
  if (target) {
    const dataTarget = target.getAttribute("item");
    return JSON.parse(dataTarget);
  }
  return null;
};
</script>

<template>
  <Layout
    :address="address"
    :items="address.details"
    chooseMenu="ban-do"
    :slug="props.slug"
  >
    <LayoutDemo toolbarId="Backup">
      <template v-slot:actions-field>
        <!-- <li>
          <div
            class="dropdown-item"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasview-backup"
            aria-controls="offcanvasview-backup"
            @click="handleClickDetail"
          >
            <i class="ri-eye-fill align-bottom me-2 text-muted"></i>
            Xem chi tiết
          </div>
        </li>
        <li>
          <div class="dropdown-item" @click="handleClickDownload">
            <i class="ri-file-download-line align-bottom me-2 text-muted"></i>
            Tải xuống
          </div>
        </li> -->
        <li @click="handleClickEdit">
          <div
            class="dropdown-item"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasedit-backup"
            aria-controls="offcanvasedit-backup"
          >
            <i class="ri-pencil-fill align-bottom me-2 text-muted"></i> Chỉnh
            sửa
          </div>
        </li>
        <li>
          <div class="dropdown-item" @click="handleClickRestore">
            <i class="ri-restart-line align-bottom me-2 text-muted"></i>
            Khôi phục
          </div>
        </li>
        <li @click="handleClickDelete">
          <div class="dropdown-item text-danger">
            <i class="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Xóa
          </div>
        </li>
      </template>
    </LayoutDemo>
    <OffcanvasUser></OffcanvasUser>
  </Layout>
</template>
