<script setup>
import LayoutRecord from "@/app_manage_dynamic_api/layout/record/LayoutRecord.vue";
import { reactive, inject, watch, ref } from "vue";
import { errorToast, successToast } from "../../../helpers/api/toastStyle";
import http from "../../../helpers/api/axiosHttp";
import Swal from "sweetalert2";


const manage_data = inject("manage-data");
const source_api = inject("source-api");
const record_target = inject("record-target");
const type_form = inject("type");

const form_commune_add = reactive({
  id: "",
  name: "",
  id_parent: "",
  geom: "",
})

const form_commune = reactive({
  id: "",
  name: "",
  id_parent: "",
  geom: "",
})

const have_new_file_update = ref(false)
const list_district = ref([])


watch(record_target, () => {
  getDetail()
})

const getDistrict = async () => {
  const response = await http.get(`/district?all`);
  if (response.status === 200) {
    list_district.value = response.data.results
  }
}
getDistrict()


const getDetail = async () => {
  form_commune.id = ""
  form_commune.name = ""
  form_commune.id_parent = ""
  form_commune.geom = ""

  const response = await http.get(`/${source_api}/${record_target.value}/`);
  if (response.status === 200) {
    const keys = Object.keys(form_commune)
    for (let i = 0; i < keys.length; i++) {
      form_commune[keys[i]] = response.data[keys[i]]
    }
  }
}

const onFileChange_add = (e) => {
  const file = e.target.files[0];
  form_commune_add.geom = file
};
const onFileChange = (e) => {
  const file = e.target.files[0];
  form_commune.geom = file
  have_new_file_update.value = true
};

function resetForm(id) {
  document.getElementById(id).reset()
  record_target.value = ""
  if (id == 'add') {
    form_commune_add.id = ""
    form_commune_add.name = ""
    form_commune_add.id_parent = ""
    form_commune_add.geom = ""
  }
  else {
    form_commune.id = ""
    form_commune.name = ""
    form_commune.id_parent = ""
    form_commune.geom = ""
  }
}

function checkValidate(type) {
  if (type == 'add') {
    if (form_commune_add.id == "") {
      errorToast("Bạn cần nhập mã xã")
      return false
    }
    if (form_commune_add.name == "") {
      errorToast("Bạn cần nhập tên xã")
      return false
    }
    if (form_commune_add.id_parent == "") {
      errorToast("Bạn cần nhập mã huyện")
      return false
    }
    if (form_commune_add.geom == "") {
      errorToast("Bạn cần nhập tệp bản đồ")
      return false
    }
  }
  else {
    if (form_commune.id == "") {
      errorToast("Bạn cần nhập mã xã")
      return false
    }
    if (form_commune.name == "") {
      errorToast("Bạn cần nhập tên xã")
      return false
    }
    if (form_commune.id_parent == "") {
      errorToast("Bạn cần nhập mã huyện")
      return false
    }
    if (form_commune.geom == "") {
      errorToast("Bạn cần nhập tệp bản đồ")
      return false
    }
  }
  return true
}

const submitForm_add = async () => {
  if (checkValidate('add')) {
    const formData = new FormData();
    for (let i = 0; i < Object.keys(form_commune_add).length; i++) {
      formData.append(Object.keys(form_commune_add)[i], form_commune_add[Object.keys(form_commune_add)[i]]);
    }
    try {
      const response = await http.post(`/${source_api}/`, formData);
      if (response.status === 201) {
        manage_data.handleCallApi()
        resetForm('add')
        successToast("Đã thêm mới thành công!");
      } else {
        errorToast("Thêm mới thất bại!")
      }
    }
    catch (error) {
      if (error.response.status != 500) {
        try {
          const keys = Object.keys(error.response.data)
          for (let i = 0; i < keys.length; i++) {
            if (error.response.data[keys[i]] != String) {
              errorToast(error.response.data[keys[i]][0]);
            }
            else {
              errorToast(error.response.data[keys[i]]);
            }
          }
        } catch (error) {
          errorToast("Thêm mới thất bại!")
        }
      }
      else {
        errorToast("Thêm mới thất bại!")
      }
    }
  }
}

const submitForm_update = async () => {
  if (checkValidate('update')) {
    const formData = new FormData();
    for (let i = 0; i < Object.keys(form_commune).length; i++) {
      if (Object.keys(form_commune)[i] == "geom") {
        if (have_new_file_update.value) {
          formData.append(Object.keys(form_commune)[i], form_commune[Object.keys(form_commune)[i]]);
        }
      }
      else {
        formData.append(Object.keys(form_commune)[i], form_commune[Object.keys(form_commune)[i]]);
      }
    }
    try {
      const response = await http.patch(`/${source_api}/${record_target.value}/`, formData);
      if (response.status === 200) {
        manage_data.handleCallApi()
        successToast("Đã sửa thành công!");
      } else {
        errorToast("Sửa thất bại!")
      }
    }
    catch (error) {
      if (error.response.status != 500) {
        try {
          const keys = Object.keys(error.response.data)
          for (let i = 0; i < keys.length; i++) {
            if (error.response.data[keys[i]] != String) {
              errorToast(error.response.data[keys[i]][0]);
            }
            else {
              errorToast(error.response.data[keys[i]]);
            }
          }
        } catch (error) {
          errorToast("Sửa thất bại!")
        }
      }
      else {
        errorToast("Sửa thất bại!")
      }
    }
  }
}

const deleteRecord = async () => {
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
    const response = await http.delete(`/${source_api}/${record_target.value}/`);
    if (response.status === 204) {
      manage_data.handleCallApi()
      resetForm('view')
      Swal.fire("Deleted!", `Bạn đã xoá thành công`, "success");
    } else {
      errorToast("Xóa thất bại!")
    }
  }
  catch (error) {
    errorToast(error.response.data?.warning);
  }
}

const handleGetPolygon = async () => {
}

function handleClickUpdate() {
  type_form.value = 'update';
  handleGetPolygon("commune", form_commune.id)
}
</script>

<template>
  <LayoutRecord id="Commune" title="Thêm mới">
    <template #header>
      <!-- <button type="button" class="btn btn-soft-primary waves-effect waves-light">
        Thêm mới
      </button> -->
      <button type="button" class="btn btn-warning btn-icon waves-effect waves-light" @click="submitForm_add"><i
          class="ri-save-2-fill"></i></button>
      <button type="button" class="btn btn-danger btn-icon waves-effect waves-light" @click="resetForm('add')"><i
          class="las la-undo-alt"></i></button>
      <!-- <div class="px-2 py-1" style="background-color: #ecedf3; border-radius: 4px;">
        <div class="fs-11"><b>Trạng thái</b></div>
        <span class="fs-10">Cập nhật gần nhất lúc: dd/mm/yyyy</span>
      </div> -->
    </template>
    <template #body>
      <form action="#" id="add">
        <b-row class="g-3">
          <b-col xl="12">
            <b-row>
              <b-col class="mb-2 bg-head-title">
                <button class="accordion-button p-2 " type="button" data-bs-toggle="collapse"
                  data-bs-target="#accor_iconExamplecollapse1" aria-expanded="true"
                  aria-controls="accor_iconExamplecollapse1">
                  THÔNG TIN XÃ
                </button>
              </b-col>
              <b-row>
                <b-col lg="6" class="mb-3">
                  <label for="id" class="form-label">
                    Mã xã
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="id" placeholder="Mã Xã ..." v-model="form_commune_add.id"
                    :class="{ 'is-invalid': !form_commune_add.id }">
                  <div class="invalid-feedback d-block" v-if="!form_commune_add.id">
                    Vui lòng nhập mã xã
                  </div>
                </b-col>
                <b-col lg="6" class="mb-3">
                  <label for="name" class="form-label">
                    Tên Xã
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="name" placeholder="Tên Xã ..."
                    v-model="form_commune_add.name" :class="{ 'is-invalid': !form_commune_add.name }">
                  <div class="invalid-feedback d-block" v-if="!form_commune_add.name">
                    Vui lòng nhập tên xã
                  </div>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="id_parent" class="form-label">
                    Mã huyện
                    <span class="text-danger">*</span>
                  </label>
                  <select class="form-select mb-3" aria-label="Mã huyện" v-model="form_commune_add.id_parent">
                    <option value="">Chọn huyện ...</option>
                    <option :value="item.id" v-for="item in list_district" :key="item.id">{{ item.name }}</option>
                  </select>
                  <div class="invalid-feedback d-block" v-if="!form_commune_add.id_parent">
                    Vui lòng chọn huyện
                  </div>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="file" class="form-label">
                    Tệp bản đồ
                    <span class="text-danger">*</span>
                  </label>
                  <input type="file" class="form-control" id="file" accept="geojson"
                    :class="{ 'is-invalid': !form_commune_add.geom }" @change="onFileChange_add">
                  <div class="invalid-feedback d-block" v-if="!form_commune_add.geom">
                    Vui lòng thêm tệp bản đồ
                  </div>
                </b-col>
              </b-row>
            </b-row>
          </b-col>
        </b-row>
      </form>
    </template>
  </LayoutRecord>

  <LayoutRecord id="Commune-update" title="Chỉnh sửa">
    <template #header>
      <!-- <button type="button" class="btn btn-soft-primary waves-effect waves-light">
        Chỉnh sửa
      </button> -->
      <button type="button" class="btn btn-warning btn-icon waves-effect waves-light" @click="submitForm_update"><i
          class="ri-save-2-fill"></i></button>
      <button type="button" class="btn btn-danger btn-icon waves-effect waves-light" @click="resetForm('update')"><i
          class="las la-undo-alt"></i></button>
      <!-- <div class="px-2 py-1" style="background-color: #ecedf3; border-radius: 4px;">
        <div class="fs-11"><b>Trạng thái</b></div>
        <span class="fs-10">Cập nhật gần nhất lúc: dd/mm/yyyy</span>
      </div> -->
    </template>
    <template #body>
      <form action="#" id="update">
        <b-row class="g-3">
          <b-col xl="12">
            <b-row>
              <b-col class="mb-2 bg-head-title">
                <button class="accordion-button p-2 " type="button" data-bs-toggle="collapse"
                  data-bs-target="#accor_iconExamplecollapse1" aria-expanded="true"
                  aria-controls="accor_iconExamplecollapse1">
                  THÔNG TIN XÃ
                </button>
              </b-col>
              <b-row>
                <b-col lg="6" class="mb-3">
                  <label for="id" class="form-label">
                    Mã xã
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="id" placeholder="Mã xã ..." v-model="form_commune.id"
                    :class="{ 'is-invalid': !form_commune.id }">
                  <div class="invalid-feedback d-block" v-if="!form_commune.id">
                    Vui lòng nhập mã xã
                  </div>
                </b-col>
                <b-col lg="6" class="mb-3">
                  <label for="name" class="form-label">
                    Tên xã
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="name" placeholder="Tên xã ..." v-model="form_commune.name"
                    :class="{ 'is-invalid': !form_commune.name }">
                  <div class="invalid-feedback d-block" v-if="!form_commune.name">
                    Vui lòng nhập tên xã
                  </div>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="id_parent" class="form-label">
                    Mã huyện
                    <span class="text-danger">*</span>
                  </label>
                  <select class="form-select mb-3" aria-label="Mã huyện" v-model="form_commune.id_parent">
                    <option value="">Chọn huyện ...</option>
                    <option :value="item.id" v-for="item in list_district" :key="item.id">{{ item.name }}</option>
                  </select>
                  <div class="invalid-feedback d-block" v-if="!form_commune.id_parent">
                    Vui lòng chọn huyện
                  </div>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="file" class="form-label">
                    Tệp bản đồ mới
                    <span class="text-danger">*</span>
                  </label>
                  <input type="file" class="form-control" id="file" accept="geojson"
                    :class="{ 'is-invalid': !form_commune.geom }" @change="onFileChange">
                  <div class="invalid-feedback d-block" v-if="!form_commune.geom">
                    Vui lòng thêm tệp bản đồ
                  </div>
                </b-col>
              </b-row>
            </b-row>

            <b-card no-body class="mb-2" v-if="type_form == 'update'">
              <label class="form-label">
                Tệp bản đồ cũ
              </label>
              <b-card-body class="card-body__custom--scroll p-2 map-card">
                <!---------------------------------------- map---------------------------------------- -->
                <MapIotLink></MapIotLink>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </form>
    </template>
  </LayoutRecord>

  <LayoutRecord id="Commune-view" title="Xem chi tiết">
    <template #header>
      <!-- <button type="button" class="btn btn-soft-primary waves-effect waves-light">
        Xem chi tiết
      </button> -->
      <button type="button" class="btn btn-warning btn-icon waves-effect waves-light" data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasCommune-update" aria-controls="#offcanvasCommune-update" @click="handleClickUpdate"><i
          class="las la-edit"></i></button>
      <button type="button" class="btn btn-danger btn-icon waves-effect waves-light" @click="deleteRecord"><i
          class="ri-delete-bin-5-line"></i></button>
      <!-- <div class="px-2 py-1" style="background-color: #ecedf3; border-radius: 4px;">
        <div class="fs-11"><b>Trạng thái</b></div>
        <span class="fs-10">Cập nhật gần nhất lúc: dd/mm/yyyy</span>
      </div> -->
    </template>
    <template #body>
      <form action="#" id="view">
        <b-row class="g-3">
          <b-col xl="12">
            <b-row>
              <b-col class="mb-2 bg-head-title">
                <button class="accordion-button p-2 " type="button" data-bs-toggle="collapse"
                  data-bs-target="#accor_iconExamplecollapse1" aria-expanded="true"
                  aria-controls="accor_iconExamplecollapse1">
                  THÔNG TIN XÃ
                </button>
              </b-col>
              <b-row>
                <b-col lg="6" class="mb-3">
                  <label for="id" class="form-label">
                    Mã xã
                  </label>
                  <input type="text" class="form-control" id="id" placeholder="Mã xã ..." v-model="form_commune.id"
                    disabled>
                </b-col>
                <b-col lg="6" class="mb-3">
                  <label for="name" class="form-label">
                    Tên xã
                  </label>
                  <input type="text" class="form-control" id="name" placeholder="Tên xã ..." v-model="form_commune.name"
                    disabled>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="id_parent" class="form-label">
                    Mã huyện
                  </label>
                  <select class="form-select mb-3" aria-label="Mã huyện" v-model="form_commune.id_parent" disabled>
                    <option value="">Chọn huyện ...</option>
                    <option :value="item.id" v-for="item in list_district" :key="item.id">{{ item.name }}</option>
                  </select>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="" class="form-label">
                    Tệp bản đồ
                  </label>
                </b-col>
              </b-row>
            </b-row>
            <b-card no-body class="mb-2" v-if="type_form == 'view'">
              <b-card-body class="card-body__custom--scroll p-2 map-card">
                <!---------------------------------------- map---------------------------------------- -->
                <MapIotLink></MapIotLink>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </form>
    </template>
  </LayoutRecord>
</template>

<style>
.map-card {
  height: 500px;
  border: 1px solid #ababab;
}

.bg-head-title {
  background-color: #DBE4FF;
}

.bg-head-title {
  background-color: #DBE4FF;
}
</style>