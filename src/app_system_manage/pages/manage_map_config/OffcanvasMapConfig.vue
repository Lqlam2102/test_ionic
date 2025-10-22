<script setup>

import LayoutRecord from "@/app_manage_dynamic_api/layout/record/LayoutRecord.vue";
// import { ref, watch } from "vue";
import { inject } from "vue";
import { usePost, usePatch } from "@/helpers/api/api.js"
// import { BASE_URL } from "@/helpers/api/axiosHttp.js";
import { useMapConfigStore } from "./mapConfigStore.js"
import { errorToast, successToast } from "@/helpers/api/toastStyle.js";
import addMapConfig from "./addMapConfig.vue"
import editMapConfig from "./editMapConfig.vue"
import detailMapConfig from "./detailMapConfig.vue"

const apiPath = "map-config"
// const PROXY = BASE_URL.endsWith('/') ? BASE_URL + 'api' : BASE_URL + '/' + 'api'
const mapConfigStore = useMapConfigStore()
const manage_data = inject('manage-data')

const successCode = [200, 201]

function handleaddMapConfig() {
  const mapConfigToAdd = mapConfigStore.mapConfigToAdd.value

  if (mapConfigStore.validateObj(mapConfigToAdd)) {
    const formData = new FormData()

    formData.append("name", mapConfigToAdd.name)
    formData.append("config", JSON.stringify(mapConfigToAdd.config))
    formData.append("is_main", mapConfigToAdd.is_main)
    usePost(apiPath, formData).then(res => {
      if (successCode.includes(res.status)) {
        successToast("Thêm cấu hình bản đồ thành công!")
      }
      else {
        errorToast("Thêm thất bại, vui lòng thử lại sau!")
      }
      manage_data.handleCallApi()
    })

  }
}


function handleEditMapConfig() {
  const mapConfigToEdit = mapConfigStore.mapConfigToEdit.value
  const currentMapConfig = mapConfigStore.currentMapConfig.value

  if (mapConfigStore.validateObj(mapConfigToEdit)) {
    const formData = new FormData()

    formData.append("name", mapConfigToEdit.name)
    formData.append("config", JSON.stringify(mapConfigToEdit.config))
    formData.append("is_main", mapConfigToEdit.is_main)

    usePatch(`${apiPath}/${currentMapConfig.id}`, formData).then(res => {
      if (successCode.includes(res.status)) {
        successToast("Cập nhật cấu hình bản đồ thành công!")
      }
      else {
        errorToast("Thêm thất bại, vui lòng thử lại sau!")
      }
      manage_data.handleCallApi()
    })
  }

}

function handleDeleteUser() {
  manage_data.handleDelete(mapConfigStore.currentMapConfig.value)
}

function handleClickEdit() {
  mapConfigStore.actionType = "edit"
}

const handleClickReset = ($e, type ="add") => {
  if (type == "add") {
    let btnReset = $e.target.offsetParent.querySelector('button[name="reset"]')
    if (btnReset) {
      btnReset.click()
    }
    else {
      btnReset = $e.target.offsetParent.offsetParent.querySelector('button[name="reset"]')
      if (btnReset) {
        btnReset.click()
      }
      else {
        btnReset = $e.target.offsetParent.offsetParent.offsetParent.querySelector('button[name="reset"]')
        if (btnReset) {
          btnReset.click()
        }
      }
    }
  }
  else {
    mapConfigStore.resetFromUpdate()
  }
}

</script>


<template>
  <LayoutRecord id="add-user" title="Thêm mới">
    <template #header>
      <!-- <button type="button" class="btn btn-soft-primary waves-effect waves-light">
        Thêm mới
      </button> -->
      <button type="button" class="btn btn-warning btn-icon waves-effect waves-light" @click="handleaddMapConfig"><i
          class="ri-save-2-fill"></i></button>
      <button type="button" class="btn btn-danger btn-icon waves-effect waves-light"
        @click="$e => handleClickReset($e)"><i class="las la-undo-alt"></i></button>
      <!-- <div class="px-2 py-1" style="background-color: #ecedf3; border-radius: 4px;">
        <div class="fs-11"><b>Trạng thái</b></div>
        <span class="fs-10">Cập nhật gần nhất lúc: dd/mm/yyyy</span>
      </div> -->
    </template>
    <template #body>
      <form action="#">
        <addMapConfig></addMapConfig>
      </form>
    </template>
  </LayoutRecord>
  <LayoutRecord id="update-user" title="Chỉnh sửa">
    <template #header>
      <!-- <button type="button" class="btn btn-soft-primary waves-effect waves-light">
        Chỉnh sửa
      </button> -->
      <button type="button" class="btn btn-warning btn-icon waves-effect waves-light" @click="handleEditMapConfig"><i
          class="ri-save-2-fill"></i></button>
      <button type="button" class="btn btn-danger btn-icon waves-effect waves-light"
        @click="$e => handleClickReset($e, `update`)"><i class="las la-undo-alt"></i></button>
      <!-- <div class="px-2 py-1" style="background-color: #ecedf3; border-radius: 4px;">
        <div class="fs-11"><b>Trạng thái</b></div>
        <span class="fs-10">Cập nhật gần nhất lúc: dd/mm/yyyy</span>
      </div> -->
    </template>
    <template #body>
      <form action="#">
        <editMapConfig></editMapConfig>
      </form>
    </template>
  </LayoutRecord>
  <LayoutRecord id="view-user" title="Xem chi tiết">
    <template #header>
      <!-- <button type="button" class="btn btn-soft-primary waves-effect waves-light">
        Xem chi tiết
      </button> -->
      <button type="button" class="btn btn-warning btn-icon waves-effect waves-light" data-bs-toggle="offcanvas"
        @click="handleClickEdit" data-bs-target="#offcanvasupdate-user" aria-controls="offcanvasupdate-user"><i
          class="las la-edit"></i></button>
      <button type="button" class="btn btn-danger btn-icon waves-effect waves-light" @click="handleDeleteUser"><i
          class="ri-delete-bin-5-line"></i></button>
      <!-- <div class="px-2 py-1" style="background-color: #ecedf3; border-radius: 4px;">
        <div class="fs-11"><b>Trạng thái</b></div>
        <span class="fs-10">Cập nhật gần nhất lúc: dd/mm/yyyy</span>
      </div> -->
    </template>
    <template #body>
      <form action="#">
        <detailMapConfig></detailMapConfig>
      </form>
    </template>
  </LayoutRecord>
</template>
<style scoped>
.bg-head-title {
  background-color: #DBE4FF;
}

.bg-disabled {
  background-color: var(--vz-input-disabled-bg) !important;
}
</style>