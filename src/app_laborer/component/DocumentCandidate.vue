<template>
  <LayoutRecord
    :defaultFullScreen="true"
    title="Hồ sơ ứng viên"
    id="document-candidate"
  >
    <template #header>
      <!-- <button
        type="button"
        class="btn btn-warning btn-icon waves-effect waves-light"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasupdate"
        aria-controls="offcanvasupdate"
      >
        <i class="las la-edit"></i>
      </button> -->
      <button
        type="button"
        class="btn btn-danger btn-icon waves-effect waves-light"
        @click="handleClickResetWorker"
      >
        <i class="las la-undo-alt"></i>
      </button>
    </template>
    <template #body>
      <div class="w-100 h-100">
        <AccordionRecord class="card" title="Nhật kí người lao động">
          <!-- <div v-if="isLoadingForm" class="text-center">
            <FormLoading></FormLoading>
          </div> -->
          <div class="table-responsive px-2 mb-3">
            <table class="table align-middle table-striped table-bordered">
              <thead class="table-light text-dark text-center text-uppercase">
                <tr>
                  <th>STT</th>
                  <th>Danh mục</th>
                  <th>Ngày tạo</th>
                  <th>Đơn hàng</th>
                  <th>Mô tả ngắn</th>
                  <th>File đính kèm</th>
                  <th>Người tạo</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-if="isLoadingHistories">
                  <td colspan="7">
                    <div
                      class="d-flex justify-content-center align-items-center"
                    >
                      <div
                        class="spinner-border text-primary me-2"
                        role="status"
                      >
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-else-if="!workerHistories.data.length">
                  <td colspan="7">Chưa có dữ liệu để hiển thị</td>
                </tr>
                <template v-else>
                  <tr
                    v-for="(history, index) in workerHistories.data"
                    :key="index"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>
                      {{
                        categories.find((c) => c.id == history.category)
                          ?.name || "_"
                      }}
                    </td>
                    <td>
                      {{
                        new Date(history.created_date).toLocaleDateString(
                          "vi-VN"
                        )
                      }}
                    </td>
                    <td>{{ history.campaign?.str }}</td>
                    <td v-html="history.note"></td>
                    <td>
                      <button
                        type="button"
                        v-if="history.has_attachment"
                        @click="handleClickDownloadAttachment(history)"
                        class="btn btn-primary btn-sm"
                      >
                        Tải xuống
                      </button>
                      <span v-else class="text-muted"
                        >Không có file đính kèm</span
                      >
                    </td>
                    <td>{{ history.created_by?.str }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
            <PaginationUI
              @change="handleChangePage"
              :current-page="workerHistories.currentPage"
              :page-size="workerHistories.totalPages"
            ></PaginationUI>
          </div>
        </AccordionRecord>
        <div class="row">
          <div class="col-xl-6">
            <div class="row">
              <div class="col-12">
                <AccordionRecord class="card" title="Thêm nhật kí">
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="mb-3 position-relative">
                        <label class="form-label mb-1 d-flex">
                          Chọn danh mục
                        </label>
                        <select
                          name="category"
                          id="category"
                          v-model="historyData.category"
                          class="form-select form-control"
                        >
                          <option value="">Chọn danh mục</option>
                          <option
                            :value="category.id"
                            v-for="(category, index) in categories"
                            :key="index"
                          >
                            {{ category.name }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3 position-relative">
                        <label class="form-label mb-1 d-flex">
                          Chọn đơn hàng
                        </label>
                        <Select
                          :api="campaignAPI"
                          :searchField="'name'"
                          :isCloseOnSelect="true"
                          @change-data="(data) => (historyData.campaign = data)"
                        >
                        </Select>
                      </div>
                    </div>

                    <div class="col-12 mb-3">
                      <label class="form-label mb-1 d-flex">
                        Nội dung chi tiết
                      </label>
                      <TextEditor v-model="historyData.note"></TextEditor>
                    </div>

                    <div class="col-12">
                      <label class="form-label"> File đính kèm </label>
                      <input
                        class="form-control"
                        type="file"
                        @change="
                          (e) => (historyData.attachFile = e.target.files[0])
                        "
                      />
                    </div>
                  </div>
                  <div class="hstack p-3 gap-2 justify-content-end">
                    <button
                      class="btn btn-primary btn-md"
                      type="button"
                      @click="handleUpdateHistory"
                    >
                      <div class="btn-content">Cập nhật</div>
                    </button>
                  </div>
                </AccordionRecord>

                <AccordionRecord class="card" title="Lịch sử làm việc">
                  <div class="p-2">
                    <table
                      class="table align-middle table-striped table-bordered"
                    >
                      <thead
                        class="table-light text-dark text-center text-uppercase"
                      >
                        <tr>
                          <th>STT</th>
                          <th>Đơn hàng</th>
                          <th>Ngày PV đạt</th>
                          <th>Ngày nghỉ việc</th>
                          <th>NV Chăm sóc</th>
                        </tr>
                      </thead>
                      <tbody class="text-center">
                        <tr v-if="careerHistories.isLoading">
                          <td colspan="6">
                            <div
                              class="d-flex justify-content-center align-items-center"
                            >
                              <div
                                class="spinner-border text-primary me-2"
                                role="status"
                              >
                                <span class="visually-hidden">Loading...</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <template v-else-if="careerHistories.data.length">
                          <tr
                            v-for="(
                              careerHistory, index
                            ) in careerHistories.data"
                            :key="index"
                          >
                            <td>{{ index + 1 }}</td>
                            <td>{{ careerHistory.campaign?.str }}</td>
                            <td>{{ careerHistory.start_date }}</td>
                            <td>{{ careerHistory.end_date ?? "_" }}</td>
                            <td>{{ careerHistory.caregiver?.str ?? "_" }}</td>
                          </tr>
                        </template>
                        <tr v-else>
                          <td colspan="4">Chưa có dữ liệu để hiển thị</td>
                        </tr>
                      </tbody>
                    </table>
                    <PaginationUI
                      @change="handleChangeCareerPage"
                      :current-page="careerHistories.currentPage"
                      :page-size="careerHistories.totalPages"
                    />
                  </div>
                </AccordionRecord>

                <AccordionRecord class="card" title="Cộng tác viên">
                  <div class="row">
                    <div class="col-12 d-flex align-items-center mb-3 ms-2">
                      <div
                        class="form-check form-switch form-switch-md"
                        dir="ltr"
                      >
                        <input type="checkbox" class="form-check-input" />
                      </div>

                      <span>Bật cộng tác viên</span>
                    </div>

                    <div class="col-6">
                      <div class="position-relative">
                        <label
                          for="form-requirement-campaign-addabout_age"
                          class="form-label mb-1 d-flex"
                        >
                          Nhân viên quản lý &nbsp;
                        </label>
                        <input type="text" class="form-control" />
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="position-relative">
                        <label
                          for="form-requirement-campaign-addskills"
                          class="form-label mb-1 d-flex"
                          >Người lao động giới thiệu
                        </label>
                        <input type="text" class="form-control" />
                      </div>
                    </div>
                  </div>
                  <div class="hstack p-3 gap-2 justify-content-end">
                    <button class="btn btn-primary btn-md" type="button">
                      <div class="btn-content">Cập nhật</div>
                    </button>
                  </div>
                </AccordionRecord>
              </div>
            </div>
          </div>
          <div class="col-xl-6 h-100">
            <div class="row">
              <div class="col-12">
                <template v-if="isLoadingForm">
                  <FormLoading></FormLoading>
                </template>
                <template v-else>
                  <FormBody
                    :formStructures="formUpdateWorker"
                    ref="FUpdateWorker"
                  ></FormBody>
                  <div class="w-100 d-flex justify-content-end">
                    <button
                      class="btn btn-primary btn-md"
                      type="button"
                      @click="handleUpdateWorker"
                    >
                      <div class="btn-content">Cập nhật</div>
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </LayoutRecord>
</template>

<script setup>
import { defineProps, watch, ref, reactive } from "vue";
import { useFetch, usePost, usePatch } from "@/helpers/api/api.js";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import { successToast } from "@/helpers/api/toastStyle";
// import { debounce } from "lodash";
// import {ref, watch , defineProps, defineEmits } from "vue";
// import API from "@/helpers/api/useAxios.js";
// import DateInput from "@/base/components/date/date.vue";
import TextEditor from "@/base/components/editor/TextEditor.vue";
// import Modal from "@/base/components/dtwinUI/Modal.vue";
import AccordionRecord from "@/base/components/accordion/AccordionRecord.vue";
import LayoutRecord from "@/app_manage_dynamic_api/layout/record/LayoutRecord.vue";
import PaginationUI from "@/app_manage_dynamic_api/components/paging/PaginationUI.vue";
import FormLoading from "@/base/components/form/builder/components/FormLoading.vue";
// import FormOffcanvasBody from "@/base/components/form/builder/FormOffcanvasBody.vue";
import Select from "@/base/components/select/Select.vue";
import FormBody from "@/base/components/form/builder/FormOffcanvasBody.vue";

import { TokenKeyAuth } from "@/helpers/api/token";
const props = defineProps({
  workerId: {},
});
const campaignAPI = API_SERVER_URL + "/campaign";
const workerAPI = API_SERVER_URL + "/worker";
const workerDetailAPI = ref(workerAPI + `/${props.workerId}`);
const workerPath = ref(`worker/${props.workerId}`);
// Thay thế khai báo careerHistories
const careerHistories = reactive({
  data: [],
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
  totalObjects: 0,
  nextPageUrl: null,
  previousPageUrl: null,
  isLoading: false,
});

// Thêm hàm đổi trang cho careerHistories
const handleChangeCareerPage = (page) => {
  careerHistories.currentPage = page;
  getWorkerCareerHistories();
};
const workerHistories = reactive({
  data: [],
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
  totalObjects: 0,
  nextPageUrl: null,
  previousPageUrl: null,
});
const formUpdateWorker = ref(null);
const FUpdateWorker = ref(null);
const categories = ref([
  { id: 0, name: "Ứng lương" },
  { id: 1, name: "Cắt nghỉ" },
  { id: 2, name: "Chuyển đơn hàng" },
]);

const historyData = reactive({
  category: "",
  campaign: null,
  note: "",
  attachFile: null,
});

const isLoadingHistories = ref(false);
const isLoadingForm = ref(false);

const resetAllState = () => {
  careerHistories.value = [];
  workerHistories.value = [];
  formUpdateWorker.value = null;
  FUpdateWorker.value = null;
  categories.value = [
    { id: 0, name: "Ứng lương" },
    { id: 1, name: "Cắt nghỉ" },
    { id: 2, name: "Chuyển đơn hàng" },
  ];
  historyData.category = "";
  historyData.campaign = null;
  historyData.note = "";
  historyData.attachFile = null;
  isLoadingHistories.value = false;
  isLoadingForm.value = false;
};

const handleClickResetWorker = () => {
  resetAllState();
  getWorkerCareerHistories();
  getWorkerHistories();
  getFormUpdateWorker();
};
const handleChangePage = (page) => {
  workerHistories.currentPage = page;
  getWorkerHistories();
};
const handleUpdateHistory = async function () {
  const formData = new FormData();
  formData.append("category", historyData.category);
  formData.append("campaign", historyData.campaign?.id || "");
  formData.append("note", historyData.note);
  if (historyData.attachFile instanceof File) {
    formData.append("attach_file", historyData.attachFile);
  }
  // Gửi formData lên API tại đây
  const response = await usePost(
    workerPath.value + "/worker-histories",
    formData
  );
  const data = await response.json();
  console.log(data);
  getWorkerHistories();
};

const retrieveWorker = async function () {
  const data = await useFetch(workerDetailAPI.value);
  console.log(data);
};

const getWorkerHistories = async function () {
  isLoadingHistories.value = true;
  try {
    const url =
      workerDetailAPI.value +
      `/worker-histories/?page=${workerHistories.currentPage}`;
    const data = await useFetch(url);
    workerHistories.data = data.results || [];
    workerHistories.currentPage = data.current_page_number || 1;
    workerHistories.pageSize = data.page_size || 10;
    workerHistories.totalPages = data.total_pages || 1;
    workerHistories.totalObjects = data.total_objects || 0;
    workerHistories.nextPageUrl = data.next;
    workerHistories.previousPageUrl = data.previous;
  } catch (error) {
    console.error("Error fetching worker histories:", error);
  }
  isLoadingHistories.value = false;
};

const getWorkerCareerHistories = async function () {
  careerHistories.isLoading = true;
  const url =
    workerDetailAPI.value +
    `/career-histories/?page=${careerHistories.currentPage}`;
  const data = await useFetch(url);
  careerHistories.data = data.results || [];
  careerHistories.currentPage = data.current_page_number || 1;
  careerHistories.pageSize = data.page_size || 10;
  careerHistories.totalPages = data.total_pages || 1;
  careerHistories.totalObjects = data.total_objects || 0;
  careerHistories.nextPageUrl = data.next;
  careerHistories.previousPageUrl = data.previous;
  careerHistories.isLoading = false;
};

const getFormUpdateWorker = async function () {
  isLoadingForm.value = true;
  try {
    const data = await useFetch(
      workerAPI + "/form/update?id=" + props.workerId
    );
    formUpdateWorker.value = data;
  } catch (error) {
    console.error("Error fetching form update worker:", error);
  }
  isLoadingForm.value = false;
};

const handleUpdateWorker = async function () {
  try {
    const formData = FUpdateWorker.value.buildFormData(formUpdateWorker.value);
    if (formData == false) return;
    const response = await usePatch(workerPath.value, formData);
    const data = await response.json();
    console.log(data);
    successToast("Cập nhật thành công!");
  } catch (error) {
    console.error("Error building form data:", error);
    return;
  }
};

const handleClickDownloadAttachment = async (history) => {
  try {
    const response = await fetch(`${workerAPI}-history/${history.id}/download-file/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TokenKeyAuth}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // 🔍 Extract filename from header
    const disposition = response.headers.get('Content-Disposition');
    let filename = 'downloaded_file';

    if (disposition && disposition.includes('filename=')) {
      filename = disposition
        .split('filename=')[1]
        .replace(/['"]/g, '')
        .trim();
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download error:', err);
  }
};


watch(
  () => props.workerId,
  () => {
    workerDetailAPI.value = workerAPI + `/${props.workerId}`;
    workerPath.value = `worker/${props.workerId}`;
    retrieveWorker(props.workerId);
    getWorkerCareerHistories();
    getWorkerHistories();
    getFormUpdateWorker();
  }
);
</script>

<style scoped>
.timeline-2::after {
  background: var(--vz-light);
}
</style>
