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


const form_region_add = reactive({
  id: "",
  name: "",
  id_parent: "84",
  geom: ""
})

const form_region = reactive({
  id: "",
  name: "",
  id_parent: "84",
  geom: ""
})

const have_new_file_update = ref(false)


watch(record_target, () => {
  getDetail()
})


const getDetail = async () => {
  form_region.id = ""
  form_region.name = ""
  form_region.id_parent = ""
  form_region.geom = ""

  const response = await http.get(`/${source_api}/${record_target.value}/`);
  if (response.status === 200) {
    const keys = Object.keys(form_region)
    for (let i = 0; i < keys.length; i++) {
      form_region[keys[i]] = response.data[keys[i]]
    }
  }
}

const onFileChange_add = (e) => {
  const file = e.target.files[0];
  form_region_add.geom = file
};
const onFileChange = (e) => {
  const file = e.target.files[0];
  form_region.geom = file
  have_new_file_update.value = true
};

function resetForm(id) {
  document.getElementById(id).reset()
  record_target.value = ""
  if (id == 'add') {
    form_region_add.id = ""
    form_region_add.name = ""
    form_region_add.id_parent = "84"
    form_region_add.geom = ""
  }
  else {
    form_region.id = ""
    form_region.name = ""
    form_region.id_parent = "84"
    form_region.geom = ""
  }
}

function checkValidate(type) {
  if (type == 'add') {
    if (form_region_add.id == "") {
      errorToast("Bạn cần nhập mã vùng")
      return false
    }
    if (form_region_add.name == "") {
      errorToast("Bạn cần nhập tên vùng")
      return false
    }
    if (form_region_add.id_parent == "") {
      errorToast("Bạn cần nhập mã quốc gia")
      return false
    }
    if (form_region_add.geom == "") {
      errorToast("Bạn cần nhập tệp bản đồ")
      return false
    }
  }
  else {
    if (form_region.id == "") {
      errorToast("Bạn cần nhập mã vùng")
      return false
    }
    if (form_region.name == "") {
      errorToast("Bạn cần nhập tên vùng")
      return false
    }
    if (form_region.id_parent == "") {
      errorToast("Bạn cần nhập mã quốc gia")
      return false
    }
    if (form_region.geom == "") {
      errorToast("Bạn cần nhập tệp bản đồ")
      return false
    }
  }
  return true
}

const submitForm_add = async () => {
  if (checkValidate('add')) {
    const formData = new FormData();
    for (let i = 0; i < Object.keys(form_region_add).length; i++) {
      formData.append(Object.keys(form_region_add)[i], form_region_add[Object.keys(form_region_add)[i]]);
    }
    try {
      const response = await http.post(`/${source_api}/`, formData);
      if (response.status === 201) {
        manage_data.handleCallApi()
        resetForm('add')
        successToast("Đã thêm mới thành công!");
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
    for (let i = 0; i < Object.keys(form_region).length; i++) {
      if (Object.keys(form_region)[i] == "geom") {
        if (have_new_file_update.value) {
          formData.append(Object.keys(form_region)[i], form_region[Object.keys(form_region)[i]]);
        }
      }
      else {
        formData.append(Object.keys(form_region)[i], form_region[Object.keys(form_region)[i]]);
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
      console.log(response.data);
      errorToast(response.data)
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
  handleGetPolygon("region", form_region.id)
}

</script>

<template>
  <LayoutRecord id="Region" title="Thêm mới">
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
                  THÔNG TIN VÙNG
                </button>
              </b-col>
              <b-row>
                <b-col lg="4" class="mb-3">
                  <label for="id" class="form-label">
                    Mã vùng
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="id" placeholder="Mã Vùng ..." v-model="form_region_add.id"
                    :class="{ 'is-invalid': !form_region_add.id }">
                  <div class="invalid-feedback d-block" v-if="!form_region_add.id">
                    Vui lòng nhập mã vùng
                  </div>
                </b-col>
                <b-col lg="4" class="mb-3">
                  <label for="name" class="form-label">
                    Tên Vùng
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="name" placeholder="Tên Vùng ..."
                    v-model="form_region_add.name" :class="{ 'is-invalid': !form_region_add.name }">
                  <div class="invalid-feedback d-block" v-if="!form_region_add.name">
                    Vui lòng nhập tên vùng
                  </div>
                </b-col>
                <b-col lg="4" class="mb-3">
                  <label for="id_parent" class="form-label">
                    Mã quốc gia
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="id_parent" placeholder="84" disabled>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="file" class="form-label">
                    Tệp bản đồ
                    <span class="text-danger">*</span>
                  </label>
                  <input type="file" class="form-control" id="file" accept="geojson"
                    :class="{ 'is-invalid': !form_region_add.geom }" @change="onFileChange_add">
                  <div class="invalid-feedback d-block" v-if="!form_region_add.geom">
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

  <LayoutRecord id="Region-update" title="Chỉnh sửa">
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
                  THÔNG TIN VÙNG
                </button>
              </b-col>
              <b-row>
                <b-col lg="4" class="mb-3">
                  <label for="id" class="form-label">
                    Mã vùng
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="id" placeholder="Mã Vùng ..." v-model="form_region.id"
                    :class="{ 'is-invalid': !form_region.id }">
                  <div class="invalid-feedback d-block" v-if="!form_region.id">
                    Vui lòng nhập mã vùng
                  </div>
                </b-col>
                <b-col lg="4" class="mb-3">
                  <label for="name" class="form-label">
                    Tên Vùng
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="name" placeholder="Tên Vùng ..." v-model="form_region.name"
                    :class="{ 'is-invalid': !form_region.name }">
                  <div class="invalid-feedback d-block" v-if="!form_region.name">
                    Vui lòng nhập tên vùng
                  </div>
                </b-col>
                <b-col lg="4" class="mb-3">
                  <label for="id_parent" class="form-label">
                    Mã quốc gia
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="id_parent" placeholder="84" disabled>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="file" class="form-label">
                    Tệp bản đồ mới
                    <span class="text-danger">*</span>
                  </label>
                  <input type="file" class="form-control" id="file" accept="geojson"
                    :class="{ 'is-invalid': !form_region.geom }" @change="onFileChange">
                  <div class="invalid-feedback d-block" v-if="!form_region.geom">
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
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </form>
    </template>
  </LayoutRecord>

  <LayoutRecord id="Region-view" title="Xem chi tiết">
    <template #header>
      <!-- <button type="button" class="btn btn-soft-primary waves-effect waves-light">
        Xem chi tiết
      </button> -->
      <button type="button" class="btn btn-warning btn-icon waves-effect waves-light" data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRegion-update" aria-controls="#offcanvasRegion-update" @click="handleClickUpdate"><i
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
                  THÔNG TIN VÙNG
                </button>
              </b-col>
              <b-row>
                <b-col lg="4" class="mb-3">
                  <label for="id" class="form-label">
                    Mã vùng
                  </label>
                  <input type="text" class="form-control" id="id" placeholder="Mã Vùng ..." v-model="form_region.id"
                    disabled>
                </b-col>
                <b-col lg="4" class="mb-3">
                  <label for="name" class="form-label">
                    Tên Vùng
                  </label>
                  <input type="text" class="form-control" id="name" placeholder="Tên Vùng ..." v-model="form_region.name"
                    disabled>
                </b-col>
                <b-col lg="4" class="mb-3">
                  <label for="id_parent" class="form-label">
                    Mã quốc gia
                  </label>
                  <input type="text" class="form-control" id="id_parent" placeholder="Mã quốc gia ..."
                    v-model="form_region.id_parent" disabled>
                </b-col>
                <b-col lg="4" class="mb-3">
                  <label for="file" class="form-label">
                    Tệp bản đồ
                  </label>
                </b-col>
              </b-row>
            </b-row>

            <b-card no-body class="mb-2" v-if="type_form == 'view'">
              <b-card-body class="card-body__custom--scroll p-2 map-card">
                <!---------------------------------------- map---------------------------------------- -->
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
  height: 550px;
  border: 1px solid #ababab;
}

.bg-head-title {
  background-color: #DBE4FF;
}
</style>