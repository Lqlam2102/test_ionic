<template>
  <LayoutRecord
    :defaultFullScreen="true"
    title="Lịch sử liên hệ"
    id="contact-history"
    @open-offcanvas="openOffcanvasEv"
  >
    <template #header>
      <button
        type="button"
        class="btn btn-warning btn-icon waves-effect waves-light"
        @click="handleClickEdit"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasupdate"
        aria-controls="offcanvasupdate"
      >
        <i class="las la-edit"></i>
      </button>
      <button
        type="button"
        class="btn btn-danger btn-icon waves-effect waves-light"
        @click="loadDataApi"
        :disabled="isLoadingForm || isLoadingLog"
      >
        <i class="las la-undo-alt"></i>
      </button>
    </template>
    <template #body>
      <Modal
        :id="`modal-edit-candidate`"
        v-model="showModalEditCandidate"
        hide-footer
        size="xl"
        :title="`Chỉnh sửa thông tin ứng viên`"
        cancelVariant="light"
      >
        <template v-if="isLoadingEditForm">
          <FormLoading></FormLoading>
        </template>
        <div v-else-if="isOnSubmitForm">
          Đang cập nhật, vui long đợi!

          <FormLoading></FormLoading>
        </div>
        <template v-else>
          <div class="d-flex gap-3 mb-3">
            <button class="btn btn-primary" @click="updateCandidate">
              Cập nhật
            </button>
            <button
              type="button"
              @click="handleGetEditForm"
              :disabled="isLoadingEditForm || isOnSubmitForm"
              class="btn btn-warning waves-effect waves-light"
            >
              <i class="bx bx-revision fs-16"></i>
            </button>
          </div>
          <FormOffcanvasBody
            :formStructures="candidateEditForm"
            ref="formEditCandidate"
          />
        </template>
      </Modal>

      <div class="w-100 h-100 row flex-row-reverse">
        <div class="col-xl-4">
          <!-- Cột bên phải nhé -->
          <AccordionRecord class="card" title="Thông tin ứng viên">
            <div v-if="isLoadingForm" class="text-center">
              <FormLoading></FormLoading>
            </div>
            <div v-else class="table-responsive px-2">
              <div class="d-flex w-100 justify-content-end">
                <button
                  type="button"
                  @click="
                    () => {
                      showModalEditCandidate = true;
                      handleGetEditForm();
                    }
                  "
                  class="btn btn-light waves-effect waves-light ml-auto"
                >
                  <i class="las la-edit fs-16"></i>
                </button>
              </div>
              <table class="table table-borderless mb-0">
                <tbody>
                  <template
                    v-for="(filed, indField) in formCandidate"
                    :key="indField"
                  >
                    <tr
                      class="mb-2"
                      v-if="
                        filed.form_type == 'text' ||
                        filed.form_type == 'date' ||
                        filed.form_type == 'textarea'
                      "
                    >
                      <template v-if="excludeKeys.includes(filed.field)">
                      </template>
                      <template v-else>
                        <th class="ps-0" scope="row">{{ filed.name }}:</th>
                        <td class="text-muted">
                          <input
                            v-if="filed.form_type == 'text'"
                            :placeholder="filed.name"
                            type="text"
                            v-model="filed.value"
                            class="form-control"
                            @change="handleEditCandidate"
                            :disabled="filed.disable"
                          />
                          <textarea
                            v-else-if="filed.form_type == 'textarea'"
                            :placeholder="filed.name"
                            v-model="filed.value"
                            class="form-control"
                            @change="handleEditCandidate"
                            :disabled="filed.disable"
                          ></textarea>
                          <span v-else>
                            <DateInput
                              :placeholder="filed.name"
                              v-model="filed.value"
                              @update:modelValue="debouncedHandleEditCandidate"
                              :disabled="filed.disable"
                            ></DateInput>
                          </span>
                        </td>
                      </template>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </AccordionRecord>
          <!-- end card body -->
          <AccordionRecord class="card" title="Lịch sử chỉnh sửa gần nhất">
            <div v-if="isLoadingLog" class="text-center">
              <FormLoading></FormLoading>
            </div>
            <div v-else class="timeline-2 w-100">
              <div
                style="max-height: 550px; overflow-y: auto; overflow-x: hidden"
                v-if="logCanDidate?.length"
              >
                <div
                  class="timeline-continue"
                  v-for="log in logCanDidate"
                  :key="log.id"
                >
                  <div class="row timeline-right">
                    <div class="col-12">
                      <p class="timeline-date">
                        {{ log.history_user }} -
                        {{ new Date(log.history_date).toLocaleTimeString() }}
                      </p>
                    </div>
                    <div class="col-12">
                      <div class="timeline-box mb-0">
                        <div class="timeline-text">
                          <p class="text-muted mb-0">
                            <span
                              >Loại chỉnh sửa: {{ log.history_type }} <br
                            /></span>
                            <template v-if="log.changes">
                              <span
                                v-for="change in log.changes.filter(
                                  (c) =>
                                    c.field !== 'history_date' &&
                                    c.field !== 'history_id'
                                )"
                                :key="change.field"
                              >
                                {{ change.verbose_name }}:
                                {{ change.old_value }} →
                                {{ change.new_value }}
                                <br />
                              </span>
                            </template>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-2" v-else>
                <span class="text-mute">Không có lịch sử chỉnh sửa nào!</span>
              </div>
            </div>
          </AccordionRecord>
        </div>
        <div class="col-xl-8 h-100">
          <div class="row">
            <div class="col-12">
              <div class="card mb-0">
                <!-- Form thêm liên hệ -->
                <!-- <div class="card-header">
                  <ul
                    class="nav nav-tabs-custom rounded card-header-tabs border-bottom-0"
                    role="tablist"
                  >
                    <li class="nav-item" role="presentation">
                      <a
                        class="nav-link active"
                        data-bs-toggle="tab"
                        href="#contact-history__note-private"
                        role="tab"
                        aria-selected="true"
                      >
                        <i class="fas fa-home"></i> Ghi chú nội bộ
                      </a>
                    </li>
                    <li class="nav-item" role="presentation">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#contact-history__tab"
                        role="tab"
                        aria-selected="false"
                        tabindex="-1"
                      >
                        <i class="far fa-user"></i> Tác vụ
                      </a>
                    </li>
                    <li class="nav-item" role="presentation">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#contact-history__sent-email"
                        role="tab"
                        aria-selected="false"
                        tabindex="-1"
                      >
                        <i class="far fa-envelope"></i> Gửi email
                      </a>
                    </li>
                  </ul>
                </div> -->
                <div class="card-body">
                  <div class="tab-content">
                    <div
                      class="tab-pane active show"
                      id="contact-history__note-private"
                      role="tabpanel"
                    >
                      <!-- element Form thêm ghi chú -->
                      <form class="row" @submit.prevent>
                        <b-form-group
                          class="col-lg-6"
                          label="Trạng thái lao động:"
                        >
                          <b-form-select
                            require
                            v-model="formData.labor_status"
                          >
                            <option value="0">Không liên hệ được</option>
                            <option value="1">Không có nhu cầu</option>
                            <option value="2">Không đủ yêu cầu</option>
                            <option value="3">Có nhu cầu</option>
                            <option value="4">Có lịch hẹn</option>
                          </b-form-select>
                        </b-form-group>
                        <b-form-group
                          class="col-lg-6"
                          require
                          label="Ngày hẹn:"
                          :disabled="formData.labor_status != 4"
                        >
                          <DateInput
                            required
                            v-model="formData.appointment_date"
                            placeholder="Chọn ngày hẹn"
                          >
                          </DateInput>
                        </b-form-group>
                        <b-form-group
                          class="col-lg-6"
                          label="Phương thức liên lạc:"
                        >
                          <b-form-select
                            require
                            v-model="formData.contact_method"
                            :options="contactMethods"
                          ></b-form-select>
                        </b-form-group>
                        <div class="d-flex justify-content-between">
                          <label>Ghi chú:</label>
                          <button
                            class="btn btn-sm btn-success mt-1 mb-1"
                            :disabled="isLoadingForm"
                            v-if="CallCenter.isAuth"
                            @click="makeCall()"
                          >
                            <i class="mdi mdi-phone-outgoing-outline"></i
                            >&nbsp;Gọi
                          </button>
                        </div>
                        <TextEditor
                          v-model="formData.note"
                          :data="formData.note"
                        ></TextEditor>
                      </form>
                      <div class="card mb-0">
                        <div class="card-body p-0">
                          <!-- <p class="text-muted bg-light p-2">
                            💡 Meo: Tổ hợp phím <kbd>Ctrl</kbd> +
                            <kbd>Enter</kbd> giúp viết ghi chú nhanh hơn đấy.
                          </p> -->
                          <div class="d-flex gap-2 px-2 pb-3 mt-1 mb-1">
                            <div class="flex-1">
                              <div class="input-group">
                                <i class="ri-attachment-2 text-muted fs-18"></i>
                              </div>
                            </div>
                            <div class="d-flex align-items-center">
                              <button
                                :disabled="isSubmit"
                                @click="handleClickBtnResetFormData"
                                class="btn btn-sm btn-light me-2"
                              >
                                ĐẶT LẠI
                              </button>
                              <button
                                :disabled="isSubmit"
                                class="btn btn-sm btn-primary"
                                @click="handleCickBtnSubmitFormdata"
                              >
                                THÊM GHI CHÚ
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--end tab-pane-->

                    <div
                      class="tab-pane"
                      id="contact-history__tab"
                      role="tabpanel"
                    ></div>
                  </div>
                </div>
              </div>

              <div v-if="candidates.isLoading" class="text-center">
                <FormLoading></FormLoading>
              </div>
              <div v-else class="card">
                <div class="card-header align-items-center d-flex">
                  <div class="flex-shrink-0 ms-2">
                    <ul
                      class="nav justify-content-end nav-tabs-custom rounded card-header-tabs border-bottom-0"
                      role="tablist"
                    >
                      <li class="nav-item" role="presentation">
                        <a
                          class="nav-link active"
                          data-bs-toggle="tab"
                          href="#tab__contact--history"
                          role="tab"
                          aria-selected="true"
                        >
                          Lịch sử trao đổi
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="flex-grow-1 oveflow-hidden">
                    <p class="text-muted text-truncates mb-0"></p>
                  </div>
                </div>
                <div class="card-body">
                  <!-- Tab panes -->
                  <div class="tab-content text-muted">
                    <div
                      class="active tab-pane"
                      id="tab__contact--history"
                      role="tabpanel"
                    >
                      <div class="tab-content text-muted">
                        <template v-if="candidates.results?.length">
                          <div
                            v-for="activity in candidates.results"
                            :key="activity.id"
                            class="d-flex mb-4"
                          >
                            <div class="flex-shrink-0">
                              <img
                                v-if="activity?.call_history?.assignee"
                                :src="
                                  BASE_URL +
                                  activity?.call_history?.assignee?.photo
                                "
                                alt="A"
                                class="avatar-xs rounded-circle"
                                style="border: 1px solid"
                              />
                              <div
                                v-else
                                class="text-center align-content-center bg-light text-success rounded-circle avatar-xs"
                              >
                                {{
                                  activity.contact_method
                                    .charAt(0)
                                    .toUpperCase()
                                }}
                              </div>
                            </div>
                            <div class="flex-grow-1 ms-3">
                              <h5 class="fs-13">
                                {{
                                  activity.call_history?.assignee?.str ||
                                  activity.created_by?.str
                                }}
                                <small class="text-muted ms-2">
                                  {{
                                    new Date(
                                      activity.contact_time
                                    ).toLocaleString()
                                  }}
                                </small>
                              </h5>
                              <div class="bg-soft-warning p-2">
                                <template v-if="activity.call_history">
                                  <div
                                    class="d-flex align-items-center gap-1 my-3"
                                  >
                                    <audio
                                      v-if="activity.call_history?.record_url"
                                      controls
                                      :src="activity.call_history?.record_url"
                                      preload="metadata"
                                    ></audio>
                                    <template v-else>
                                      <span> Không có bản ghi âm! </span>
                                    </template>
                                    <!-- <btn class="btn btn-icon btn-ghost-primary">
                                      <i class="ri-download-fill fs-20"></i>
                                    </btn>
                                    <btn class="btn btn-icon btn-ghost-primary">
                                      <i class="ri-pushpin-fill fs-20"></i>
                                    </btn> -->
                                  </div>

                                  <h4
                                    class="form-label text-body fs-15"
                                    v-if="activity.call_history"
                                  >
                                    {{ activity.call_history?.name }}
                                  </h4>
                                  <p class="text-muted">
                                    <span>
                                      Giao cho:
                                      {{
                                        activity?.call_history?.assignee?.str
                                      }}
                                    </span>
                                    <br />
                                    <span>
                                      Thời gian bắt đầu cuộc gọi:
                                      {{
                                        activity.call_history
                                          ?.start_timestamp_str
                                      }}
                                    </span>
                                    <br />
                                    <span>
                                      Độ dài cuộc gọi:
                                      {{ activity.call_history?.duration_str }}
                                      <br />
                                    </span>
                                  </p>
                                </template>
                                <div v-else class="text-muted">
                                  <span>
                                    Trạng thái:
                                    {{ activity.labor_status_display }}
                                  </span>
                                  <br />
                                  <span>
                                    Phương thức: {{ activity.contact_method }}
                                  </span>
                                  <br />
                                  <span v-if="activity.appointment_date">
                                    Ngày hẹn: {{ activity.appointment_date }}
                                  </span>
                                  <br />
                                  <span>Nội dung:</span>
                                  <div
                                    class="text-muted"
                                    v-html="activity.note"
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                        <div class="p-2" v-else>
                          <span class="text-mute"
                            >Không có lịch sử trao đổi nào!</span
                          >
                        </div>

                        <div class="text-center mb-3">
                          <button
                            v-if="
                              candidates.current_page_number <
                              candidates.total_pages
                            "
                            class="btn btn-link text-success mt-2"
                            @click="
                              fcCandidateContactHistory(
                                candidates.current_page_number + 1
                              )
                            "
                          >
                            <i
                              v-if="candidates.isLoadingContactMore"
                              class="mdi mdi-loading mdi-spin fs-20 align-middle me-2"
                            ></i>
                            Xem thêm
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- end card-body -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </LayoutRecord>
</template>

<script setup>
import Modal from "@/base/components/dtwinUI/Modal.vue";
import FormOffcanvasBody from "@/base/components/form/builder/FormOffcanvasBody.vue";
import { BASE_URL } from "@/helpers/api/axiosHttp";
import { debounce } from "lodash";
import { ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";
import API from "@/helpers/api/useAxios.js";
import { useFetch } from "@/helpers/api/api.js";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import LayoutRecord from "@/app_manage_dynamic_api/layout/record/LayoutRecord.vue";
import DateInput from "@/base/components/date/date.vue";
import TextEditor from "@/base/components/editor/TextEditor.vue";
import FormLoading from "@/base/components/form/builder/components/FormLoading.vue";
import { errorToast, successToast } from "@/helpers/api/toastStyle.js";
import { base64Encode } from "@/helpers/utils/stringHandle.js";
import AccordionRecord from "@/base/components/accordion/AccordionRecord.vue";
import { CallCenter } from "@/callcenter/utils/callcenter.js";

const emits = defineEmits(["handle-click-edit"]);
const formEditCandidate = ref(null);
const showModalEditCandidate = ref(false);
const candidateEditForm = ref({});
const isLoadingEditForm = ref(true);
const isOnSubmitForm = ref(false);

const handleClickEdit = () => {
  emits("handle-click-edit", {
    id: props.candidate.id,
  });
};

const props = defineProps({
  candidate: {
    required: true,
  },
  style: {},
});
const candidateDetail = ref({});
const makeCall = () => {
  CallCenter.makeCall(
    candidateDetail.value.phone,
    candidateDetail.value.str,
    candidateDetail?.value.id
  );
};

const excludeKeys = ["skill", "educational_level", "email", "nationality"];

// Cụm chức năng load DỮ LIỆU CHÍNH:
// + Thông tin lịch sử luên hệ
// + Thông tin ứng viên theo form update
// + Lịch sử chỉnh sửa thông tin ứng viên (logCandidate)
const candidates = ref({
  page_size: 0,
  total_objects: 1,
  total_pages: 1,
  current_page_number: 1,
  next: null,
  previous: null,
  results: [],
  isLoading: true,
  isLoadingContactMore: false,
});

const handleGetEditForm = async () => {
  isLoadingEditForm.value = true;
  try {
    await useFetch(
      API_SERVER_URL + "/candidate/form/update/?id=" + props.candidate?.id
    ).then((data) => {
      candidateEditForm.value = data;
    });
  } finally {
    isLoadingEditForm.value = false;
  }
};

const updateCandidate = async () => {
  isOnSubmitForm.value = true;
  const formData = formEditCandidate.value.buildFormData(
    candidateEditForm.value
  );
  try {
    await API()
      .patch(`candidate/${props.candidate.id}/`, formData)
      .then(() => {
        successToast("Đã lưu");
        fcLoadLog();
        fcLoadForm();
      });
  } finally {
    isOnSubmitForm.value = false;
    showModalEditCandidate.value = false;
  }
};
const checkLoadingContact = (page, type = false) => {
  if (page == 1) {
    candidates.value.isLoading = type;
  } else {
    candidates.value.isLoadingContactMore = type;
  }
};
const fcCandidateContactHistory = (
  page = candidates.value.current_page_number
) => {
  if (page > candidates.value.total_pages) return;
  if (page == 1) candidates.value.results = [];

  checkLoadingContact(page, true);
  API()
    .get(
      `candidate/${props.candidate.id}/cantact-history/?page=${page}&per_page=10`
    )
    .then((response) => {
      candidates.value.results = [
        ...candidates.value.results,
        ...response.results,
      ];
      candidates.value.current_page_number = response.current_page_number;
      candidates.value.total_pages = response.total_pages;
      checkLoadingContact(page, false);
    })
    .catch(() => {
      checkLoadingContact(page, false);
    });
};

const loadDataApi = debounce(() => {
  fcCandidateContactHistory(1);
  if (!props.candidate?.id) return;
  fcLoadDetailCandidate();
  fcLoadForm();
  fcLoadLog();
}, 300);

// Cụm chức năng load dữ liệu lịch sử liên hệ
const logCanDidate = ref([]);
const isLoadingLog = ref(false);
const isSubmit = ref(false);

const fcLoadDetailCandidate = () => {
  isLoadingForm.value = true;
  API()
    .get(`candidate/${props.candidate.id}/`)
    .then((response) => {
      console.log(response);
      candidateDetail.value = response;
      isLoadingForm.value = false;
    })
    .catch(() => {
      isLoadingForm.value = false;
    });
};

const fcLoadLog = () => {
  isLoadingLog.value = true;
  logCanDidate.value = [];
  API()
    .get(
      `logs-candidate/?filter=${base64Encode(
        `[["id","exact","${props.candidate?.id}"]]`
      )}&per_page=10`
    )
    .then((log) => {
      if (log?.results?.length) {
        logCanDidate.value = log.results.filter((item) => item.changes.length);
      }

      isLoadingLog.value = false;
    })
    .catch(() => {
      isLoadingLog.value = false;
    });
};

// Cụm chức năng load form update ứng viên
const formCandidate = ref([]);
const isLoadingForm = ref(false);

const fcLoadForm = () => {
  isLoadingForm.value = true;
  formCandidate.value = [];
  API()
    .get(`candidate/form/update/?id=${props.candidate?.id}`)
    .then((form) => {
      if (form?.length) {
        form.forEach((element) => {
          formCandidate.value = [...formCandidate.value, ...element.fields];
        });
      }
      isLoadingForm.value = false;
    })
    .catch(() => {
      isLoadingForm.value = false;
    });
};

// Chỉnh sửa thông tin của ứng viên với sự kiện onChange
const handleEditCandidate = () => {
  const payload = new FormData();
  formCandidate.value.forEach((field) => {
    if (field.form_type == "text" && field.value) {
      payload.append(field.field, field.value);
    } else if (field.form_type == "textarea" && field.value) {
      payload.append(field.field, field.value);
    } else if (field.form_type == "date" && field.value) {
      payload.append(field.field, field.value);
    }
  });
  API()
    .patch(`candidate/${props.candidate.id}/`, payload)
    .then(() => {
      successToast("Đã lưu");
      fcLoadLog();
    });
};
// Cần debounce 300ms để không call nhiều lần
const debouncedHandleEditCandidate = debounce(() => {
  handleEditCandidate();
}, 300);

// form thông tin để thêm mới liên hệ
const INNITFORMDATA = {
  appointment_date: null,
  labor_status: 0,
  contact_method: "Số điện thoại",
  note: "",
};
const contactMethods = ["Số điện thoại", "Zalo"];
const formData = ref({ ...INNITFORMDATA });

// Gán lại giá trị mặc định
const handleClickBtnResetFormData = () => {
  formData.value = { ...INNITFORMDATA };
};

const handleCickBtnSubmitFormdata = async () => {
  // Nếu trạng thái lao động là "Có lịch hẹn", bắt buộc phải chọn ngày hẹn
  if (formData.value.labor_status == 4 && !formData.value.appointment_date) {
    errorToast("Vui lòng chọn ngày hẹn!");
    return;
  }
  // Kiểm tra phương thức liên lạc
  if (
    !formData.value.contact_method ||
    !contactMethods.includes(formData.value.contact_method)
  ) {
    errorToast("Vui lòng chọn phương thức liên hệ hợp lệ!");
    return;
  }
  isSubmit.value = true;

  try {
    await API()
      .post(
        `candidate/${props.candidate.id}/cantact-history/`,
        formData.value,
        "Thêm ghi chú thành công"
      )
      .then(() => {
        fcCandidateContactHistory(1);
        handleClickBtnResetFormData();
      });
  } catch (error) {
    errorToast(error.message);
  } finally {
    // Reset trạng thái isSubmit về false sau khi hoàn thành
    isSubmit.value = false;
  }
};

const openOffcanvasEv = () => {
  loadDataApi();
};
watch(
  () => props.candidate.id,
  () => {
    isLoadingForm.value = true;
    isLoadingLog.value = true;
    candidates.value.isLoading = true;
    loadDataApi();
  }
);
</script>

<style scoped>
.timeline-2::after {
  background: var(--vz-light);
}
</style>