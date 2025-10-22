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


const form_hamlet_add = reactive({
  id: "",
  name: "",
  id_parent: "",
  geom: "",
})

const form_hamlet = reactive({
  id: "",
  name: "",
  id_parent: "",
  geom: "",
})

const have_new_file_update = ref(false)
const list_commune = ref([])

watch(record_target, () => {
  getDetail()
})

const getCommune = async () => {
  const response = await http.get(`/commune?all`);
  if (response.status === 200) {
    list_commune.value = response.data.results
  }
}
getCommune()

const getDetail = async () => {
  form_hamlet.id = ""
  form_hamlet.name = ""
  form_hamlet.id_parent = ""
  form_hamlet.geom = ""

  const response = await http.get(`/${source_api}/${record_target.value}/`);
  if (response.status === 200) {
    const keys = Object.keys(form_hamlet)
    for (let i = 0; i < keys.length; i++) {
      form_hamlet[keys[i]] = response.data[keys[i]]
    }
  }
}

const onFileChange_add = (e) => {
  const file = e.target.files[0];
  form_hamlet_add.geom = file
};
const onFileChange = (e) => {
  const file = e.target.files[0];
  form_hamlet.geom = file
  have_new_file_update.value = true
};

function resetForm(id) {
  document.getElementById(id).reset()
  record_target.value = ""
  if (id == 'add') {
    form_hamlet_add.id = ""
    form_hamlet_add.name = ""
    form_hamlet_add.id_parent = ""
    form_hamlet_add.geom = ""
  }
  else {
    form_hamlet.id = ""
    form_hamlet.name = ""
    form_hamlet.id_parent = ""
    form_hamlet.geom = ""
  }
}

function checkValidate(type) {
  if (type == 'add') {
    if (form_hamlet_add.id == "") {
      errorToast("Bạn cần nhập mã thôn")
      return false
    }
    if (form_hamlet_add.name == "") {
      errorToast("Bạn cần nhập tên thôn")
      return false
    }
    if (form_hamlet_add.id_parent == "") {
      errorToast("Bạn cần nhập mã xã")
      return false
    }
    if (form_hamlet_add.geom == "") {
      errorToast("Bạn cần nhập tệp bản đồ")
      return false
    }
  }
  else {
    if (form_hamlet.id == "") {
      errorToast("Bạn cần nhập mã thôn")
      return false
    }
    if (form_hamlet.name == "") {
      errorToast("Bạn cần nhập tên thôn")
      return false
    }
    if (form_hamlet.id_parent == "") {
      errorToast("Bạn cần nhập mã xã")
      return false
    }
    if (form_hamlet.geom == "") {
      errorToast("Bạn cần nhập tệp bản đồ")
      return false
    }
  }
  return true
}

const submitForm_add = async () => {
  if (checkValidate('add')) {
    const formData = new FormData();
    for (let i = 0; i < Object.keys(form_hamlet_add).length; i++) {
      formData.append(Object.keys(form_hamlet_add)[i], form_hamlet_add[Object.keys(form_hamlet_add)[i]]);
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
    for (let i = 0; i < Object.keys(form_hamlet).length; i++) {
      if (Object.keys(form_hamlet)[i] == "geom") {
        if (have_new_file_update.value) {
          formData.append(Object.keys(form_hamlet)[i], form_hamlet[Object.keys(form_hamlet)[i]]);
        }
      }
      else {
        formData.append(Object.keys(form_hamlet)[i], form_hamlet[Object.keys(form_hamlet)[i]]);
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
  handleGetPolygon("hamlet", form_hamlet.id)
}

</script>

<template>
  <LayoutRecord id="Hamlet" title="Thêm mới">
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
                  THÔNG TIN THÔN
                </button>
              </b-col>
              <b-row>
                <b-col lg="6" class="mb-3">
                  <label for="id" class="form-label">
                    Mã thôn
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="id" placeholder="Mã thôn ..." v-model="form_hamlet_add.id"
                    :class="{ 'is-invalid': !form_hamlet_add.id }">
                  <div class="invalid-feedback d-block" v-if="!form_hamlet_add.id">
                    Vui lòng nhập mã thôn
                  </div>
                </b-col>
                <b-col lg="6" class="mb-3">
                  <label for="name" class="form-label">
                    Tên thôn
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="name" placeholder="Tên thôn ..."
                    v-model="form_hamlet_add.name" :class="{ 'is-invalid': !form_hamlet_add.name }">
                  <div class="invalid-feedback d-block" v-if="!form_hamlet_add.name">
                    Vui lòng nhập tên thôn
                  </div>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="id_parent" class="form-label">
                    Mã xã
                    <span class="text-danger">*</span>
                  </label>
                  <select class="form-select mb-3" aria-label="Mã xã" v-model="form_hamlet_add.id_parent">
                    <option value="" selected>Chọn xã ...</option>
                    <option :value="item.id" v-for="item in list_commune" :key="item.id">{{ item.name }}</option>
                  </select>
                  <div class="invalid-feedback d-block" v-if="!form_hamlet_add.id_parent">
                    Vui lòng chọn xã
                  </div>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="file" class="form-label">
                    Tệp bản đồ
                    <span class="text-danger">*</span>
                  </label>
                  <input type="file" class="form-control" id="file" accept="geojson"
                    :class="{ 'is-invalid': !form_hamlet_add.geom }" @change="onFileChange_add">
                  <div class="invalid-feedback d-block" v-if="!form_hamlet_add.geom">
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

  <LayoutRecord id="Hamlet-update" title="Chỉnh sửa">
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
                  THÔNG TIN THÔN
                </button>
              </b-col>
              <b-row>
                <b-col lg="6" class="mb-3">
                  <label for="id" class="form-label">
                    Mã thôn
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="id" placeholder="Mã thôn ..." v-model="form_hamlet.id"
                    :class="{ 'is-invalid': !form_hamlet.id }">
                  <div class="invalid-feedback d-block" v-if="!form_hamlet.id">
                    Vui lòng nhập mã thôn
                  </div>
                </b-col>
                <b-col lg="6" class="mb-3">
                  <label for="name" class="form-label">
                    Tên thôn
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="name" placeholder="Tên thôn ..." v-model="form_hamlet.name"
                    :class="{ 'is-invalid': !form_hamlet.name }">
                  <div class="invalid-feedback d-block" v-if="!form_hamlet.name">
                    Vui lòng nhập tên thôn
                  </div>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="id_parent" class="form-label">
                    Mã xã
                    <span class="text-danger">*</span>
                  </label>
                  <select class="form-select mb-3" aria-label="Mã xã" v-model="form_hamlet.id_parent">
                    <option value="" selected>Chọn xã ...</option>
                    <option :value="item.id" v-for="item in list_commune" :key="item.id">{{ item.name }}</option>
                  </select>
                  <div class="invalid-feedback d-block" v-if="!form_hamlet.id_parent">
                    Vui lòng chọn xã
                  </div>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="file" class="form-label">
                    Tệp bản đồ mới
                    <span class="text-danger">*</span>
                  </label>
                  <input type="file" class="form-control" id="file" accept="geojson"
                    :class="{ 'is-invalid': !form_hamlet.geom }" @change="onFileChange">
                  <div class="invalid-feedback d-block" v-if="!form_hamlet.geom">
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

  <LayoutRecord id="Hamlet-view" title="Xem chi tiết">
    <template #header>
      <!-- <button type="button" class="btn btn-soft-primary waves-effect waves-light">
        Xem chi tiết
      </button> -->
      <button type="button" class="btn btn-warning btn-icon waves-effect waves-light" data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasHamlet-update" aria-controls="#offcanvasHamlet-update" @click="handleClickUpdate"><i
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
                  THÔNG TIN THÔN
                </button>
              </b-col>
              <b-row>
                <b-col lg="6" class="mb-3">
                  <label for="id" class="form-label">
                    Mã thôn
                  </label>
                  <input type="text" class="form-control" id="id" placeholder="Mã thôn ..." v-model="form_hamlet.id"
                    disabled>
                </b-col>
                <b-col lg="6" class="mb-3">
                  <label for="name" class="form-label">
                    Tên thôn
                  </label>
                  <input type="text" class="form-control" id="name" placeholder="Tên thôn ..." v-model="form_hamlet.name"
                    disabled>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="id_parent" class="form-label">
                    Mã xã
                  </label>
                  <select class="form-select mb-3" aria-label="Mã xã" v-model="form_hamlet.id_parent" disabled>
                    <option :value="item.id" v-for="item in list_commune" :key="item.id">{{ item.name }}</option>
                  </select>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="" class="form-label">
                    Tệp bản đồ mới
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