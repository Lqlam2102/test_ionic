<script setup>
import { defineProps, provide, ref } from "vue";
import classManageData from "@/app_manage_dynamic_api/hook/state/manage_data.js";
import Layout from "@/app_manage_dynamic_api/layout/main.vue";
import LayoutDemo from "@/app_manage_dynamic_api/layout/LayoutDemo.vue";
import Offcanvas from "./Offcanvas.vue";
import { errorToast } from "../../../helpers/api/toastStyle";
import http from "../../../helpers/api/axiosHttp";
import Swal from "sweetalert2";


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
    default: "Vùng",
  },
  sourceApi: {
    type: String,
    default: "region",
  },
});

const manage_data = new classManageData(`${props.sourceApi}`);

const record_target = ref(null)
const type = ref("add")

provide("manage-data", manage_data);
provide("source-api", props.sourceApi);
provide("record-target", record_target);
provide("type", type);


const handleClickTest = () => {
  alert("demo");
};

const handleClickDelete = async ($event) => {
  const item = getValueItem($event)
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
  try {
    const response = await http.delete(`/${props.sourceApi}/${item.id}/`);
    if (response.status === 204) {
      for (let i = 0; i < manage_data.data.results.length; i++) {
        if (manage_data.data.results[i].id == item.id) {
          manage_data.data.results.splice(i, 1)
        }
      }
      // successToast("Đã xóa thành công!");
      Swal.fire("Deleted!", `Bạn đã xoá thành công`, "success");

    } else {
      errorToast("Xóa thất bại!")
    }
  }
  catch (error) {
      errorToast(error.response.data?.warning);
  }
}

const handleClickView = ($event) => {
  const item = getValueItem($event)
  record_target.value = item.id

  type.value = "view"
  handleGetPolygon("region", item.id)
}

const handleClickUpdate = ($event) => {
  const item = getValueItem($event)
  record_target.value = item.id

  type.value = "update"
  handleGetPolygon("region", item.id)
}


const getValueItem = ($event) => {
  const target = $event.target.closest("ul");
  if (target) {
    const dataTarget = target.getAttribute("item");
    return JSON.parse(dataTarget);
  }
  return null
}

// map
const handleGetPolygon = async () => {
}
</script>

<template>
  <Layout :address="address" :items="address.details" chooseMenu="ban-do" :slug="props.slug">
    <LayoutDemo toolbarId="Region">
      <template v-slot:actions-toolbar>
        <button class="btn btn-light d-flex" @click="handleClickTest" type="button">
          <!-- <i class="align-bottom me-2"></i> -->
          custom
        </button>
      </template>
      <template v-slot:actions-field>
        <li>
          <div class="dropdown-item" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRegion-view"
            @click="handleClickView" aria-controls="#offcanvasRegion-view">
            <i class="ri-eye-fill align-bottom me-2 text-muted"></i>
            Xem chi tiết
          </div>
        </li>
        <li>
          <div class="dropdown-item" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRegion-update"
            @click="handleClickUpdate" aria-controls="#offcanvasRegion-update">
            <i class="ri-pencil-fill align-bottom me-2 text-muted"></i>
            Chỉnh sửa
          </div>
        </li>
        <li>
          <div class="dropdown-item text-danger" @click="handleClickDelete">
            <i class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
            Xóa
          </div>
        </li>
      </template>
    </LayoutDemo>
    <Offcanvas></Offcanvas>
  </Layout>
</template>
