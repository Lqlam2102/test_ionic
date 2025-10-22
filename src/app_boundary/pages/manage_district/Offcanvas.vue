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

const form_district_add = reactive({
  id: "",
  name: "",
  id_parent: "",
  geom: "",
  description: ""
})

const form_district = reactive({
  id: "",
  name: "",
  id_parent: "",
  geom: "",
  description: ""
})

const have_new_file_update = ref(false)
const list_province = ref([])


watch(record_target, () => {
  getDetail()
})


const getProvince = async () => {
  const response = await http.get(`/province?all`);
  if (response.status === 200) {
    list_province.value = response.data.results
  }
}
getProvince()

const getDetail = async () => {
  form_district.id = ""
  form_district.name = ""
  form_district.id_parent = ""
  form_district.geom = ""
  form_district.description = ""

  const response = await http.get(`/${source_api}/${record_target.value}/`);
  if (response.status === 200) {
    const keys = Object.keys(form_district)
    for (let i = 0; i < keys.length; i++) {
      form_district[keys[i]] = response.data[keys[i]]
    }
    console.log(form_district);
  }
}

const onFileChange_add = (e) => {
  const file = e.target.files[0];
  form_district_add.geom = file
};
const onFileChange = (e) => {
  const file = e.target.files[0];
  form_district.geom = file
  have_new_file_update.value = true
};

function resetForm(id) {
  document.getElementById(id).reset()
  record_target.value = ""
  if (id == 'add') {
    form_district_add.id = ""
    form_district_add.name = ""
    form_district_add.id_parent = ""
    form_district_add.geom = ""
    form_district_add.description = ""
  }
  else {
    form_district.id = ""
    form_district.name = ""
    form_district.id_parent = ""
    form_district.geom = ""
    form_district.description = ""
  }
}

function checkValidate(type) {
  if (type == 'add') {
    if (form_district_add.id == "") {
      errorToast("Bạn cần nhập mã huyện")
      return false
    }
    if (form_district_add.name == "") {
      errorToast("Bạn cần nhập tên huyện")
      return false
    }
    if (form_district_add.id_parent == "") {
      errorToast("Bạn cần nhập mã tỉnh")
      return false
    }
    if (form_district_add.geom == "") {
      errorToast("Bạn cần nhập tệp bản đồ")
      return false
    }
  }
  else {
    if (form_district.id == "") {
      errorToast("Bạn cần nhập mã huyện")
      return false
    }
    if (form_district.name == "") {
      errorToast("Bạn cần nhập tên huyện")
      return false
    }
    if (form_district.id_parent == "") {
      errorToast("Bạn cần nhập mã tỉnh")
      return false
    }
    if (form_district.geom == "") {
      errorToast("Bạn cần nhập tệp bản đồ")
      return false
    }
  }
  return true
}

const submitForm_add = async () => {
  if (checkValidate('add')) {
    const formData = new FormData();
    for (let i = 0; i < Object.keys(form_district_add).length; i++) {
      formData.append(Object.keys(form_district_add)[i], form_district_add[Object.keys(form_district_add)[i]]);
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
    for (let i = 0; i < Object.keys(form_district).length; i++) {
      if (Object.keys(form_district)[i] == "geom") {
        if (have_new_file_update.value) {
          formData.append(Object.keys(form_district)[i], form_district[Object.keys(form_district)[i]]);
        }
      }
      else {
        formData.append(Object.keys(form_district)[i], form_district[Object.keys(form_district)[i]]);
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

// map
const handleGetPolygon = async () => {
}

function handleClickUpdate() {
  type_form.value = 'update';
  handleGetPolygon("district", form_district.id)
}
</script>

<template>
  <LayoutRecord id="District" title="Thêm mới">
    <template #header>
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
                  THÔNG TIN HUYỆN
                </button>
              </b-col>
              <b-row>
                <b-col lg="6" class="mb-3">
                  <label for="id" class="form-label">
                    Mã Huyện
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="id" placeholder="Mã Huyện ..."
                    v-model="form_district_add.id" :class="{ 'is-invalid': !form_district_add.id }">
                  <div class="invalid-feedback d-block" v-if="!form_district_add.id">
                    Vui lòng nhập mã huyện
                  </div>
                </b-col>
                <b-col lg="6" class="mb-3">
                  <label for="name" class="form-label">
                    Tên Huyện
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="name" placeholder="Tên Huyện ..."
                    v-model="form_district_add.name" :class="{ 'is-invalid': !form_district_add.name }">
                  <div class="invalid-feedback d-block" v-if="!form_district_add.name">
                    Vui lòng nhập tên huyện
                  </div>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="id_parent" class="form-label">
                    Mã tỉnh
                    <span class="text-danger">*</span>
                  </label>
                  <select class="form-select mb-3" aria-label="Mã tỉnh" v-model="form_district_add.id_parent">
                    <option value="">Chọn tỉnh ...</option>
                    <option :value="item.id" v-for="item in list_province" :key="item.id">{{ item.name }}</option>
                  </select>
                  <div class="invalid-feedback d-block" v-if="!form_district_add.id_parent">
                    Vui lòng chọn tỉnh
                  </div>
                </b-col>
                <!-- <b-col lg="12" class="mb-3">
                  <label for="description" class="form-label">
                    Mô tả
                  </label>
                  <UseEditor id="description" v-model="form_district_add.description"></UseEditor>
                </b-col> -->
                <b-col lg="12" class="mb-3">
                  <label for="file" class="form-label">
                    Tệp bản đồ
                    <span class="text-danger">*</span>
                  </label>
                  <input type="file" class="form-control" id="file" accept="geojson"
                    :class="{ 'is-invalid': !form_district_add.geom }" @change="onFileChange_add">
                  <div class="invalid-feedback d-block" v-if="!form_district_add.geom">
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

  <LayoutRecord id="District-update" title="Chỉnh sửa">
    <template #header>
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
                  THÔNG TIN HUYỆN
                </button>
              </b-col>
              <b-row>
                <b-col lg="6" class="mb-3">
                  <label for="id" class="form-label">
                    Mã Huyện
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="id" placeholder="Mã Huyện ..." v-model="form_district.id"
                    :class="{ 'is-invalid': !form_district.id }">
                  <div class="invalid-feedback d-block" v-if="!form_district.id">
                    Vui lòng nhập mã huyện
                  </div>
                </b-col>
                <b-col lg="6" class="mb-3">
                  <label for="name" class="form-label">
                    Tên Huyện
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="name" placeholder="Tên Huyện ..."
                    v-model="form_district.name" :class="{ 'is-invalid': !form_district.name }">
                  <div class="invalid-feedback d-block" v-if="!form_district.name">
                    Vui lòng nhập tên huyện
                  </div>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="id_parent" class="form-label">
                    Mã tỉnh
                    <span class="text-danger">*</span>
                  </label>
                  <select class="form-select mb-3" aria-label="Mã tỉnh" v-model="form_district.id_parent">
                    <option value="" selected>Chọn tỉnh ...</option>
                    <option :value="item.id" v-for="item in list_province" :key="item.id">{{ item.name }}</option>
                  </select>
                  <div class="invalid-feedback d-block" v-if="!form_district.id_parent">
                    Vui lòng chọn tỉnh
                  </div>
                </b-col>
                <!-- <b-col lg="12" class="mb-3">
                  <label for="description" class="form-label">
                    Mô tả
                  </label>
                  <UseEditor id="description" v-model="form_district.description"></UseEditor>
                </b-col> -->
                <b-col lg="12" class="mb-3">
                  <label for="file" class="form-label">
                    Tệp bản đồ mới
                    <span class="text-danger">*</span>
                  </label>
                  <input type="file" class="form-control" id="file" accept="geojson"
                    :class="{ 'is-invalid': !form_district.geom }" @change="onFileChange">
                  <div class="invalid-feedback d-block" v-if="!form_district.geom">
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

  <LayoutRecord id="District-view" title="Chi tiết">
    <template #header>
      <button type="button" class="btn btn-warning btn-icon waves-effect waves-light" data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasDistrict-update" aria-controls="#offcanvasDistrict-update" @click="handleClickUpdate"><i
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
                  THÔNG TIN HUYỆN
                </button>
              </b-col>
              <b-row>
                <b-col lg="6" class="mb-3">
                  <label for="id" class="form-label">
                    Mã Huyện
                  </label>
                  <input type="text" class="form-control" id="id" placeholder="Mã Huyện ..." v-model="form_district.id"
                    disabled>
                </b-col>
                <b-col lg="6" class="mb-3">
                  <label for="name" class="form-label">
                    Tên Huyện
                  </label>
                  <input type="text" class="form-control" id="name" placeholder="Tên Huyện ..."
                    v-model="form_district.name" disabled>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="id_parent" class="form-label">
                    Mã tỉnh
                  </label>
                  <select class="form-select mb-3" aria-label="Mã tỉnh" v-model="form_district.id_parent" disabled>
                    <option :value="item.id" v-for="item in list_province" :key="item.id">{{ item.name }}</option>
                  </select>
                </b-col>
                <!-- <b-col lg="12" class="mb-3">
                  <label for="description" class="form-label">
                    Mô tả
                  </label>
                  <input type="text" class="form-control" id="description" placeholder="Mô tả ..."
                    v-model="form_district.description" disabled>
                </b-col> -->
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
</style>