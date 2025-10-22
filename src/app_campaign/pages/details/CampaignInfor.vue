<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
// import { CompanyInfor } from "@/helpers/user/company.js";
import Layout from "@/app_manage_dynamic_api/layout/main.vue";
import FormOffcanvas from "@/base/components/form/builder/FormOffcanvas.vue";
import API from "@/app_manage_dynamic_api/helper/api/useAxios";
import AccordionRecord from "@/base/components/accordion/AccordionRecord.vue";
import Modal from "@/base/components/dtwinUI/Modal.vue";
import CardUser from "@/app_public/components/CardUser.vue";
import SlideImg from "../../components/SlideImg.vue";
import { successToast } from "@/helpers/api/toastStyle";
import {
  checkLinkMapShare,
  convertSharedLinkToEmbed,
  fieldsView as fields,
  setField,
  formatDate,
  getSrcYoutube,
} from "../../common/common.js";

const route = useRoute();
const isLoading = ref(true);
const formOffcanvas = ref(null);
const viewUser = ref({});

// Dữ liệu mẫu
const data = ref({
  id: "",
  str: "",
  status_display: "",
  number_of_admitted: 0,
  photo: null,
  manager: [],
  customer: {},
  qr_code: "",
  qr_get_form: "",
  created_date: "",
  updated_date: "",
  name: "",
  type: {},
  short_description: "",
  description: "",
  link_map: null,
  video: null,
  start_date: "",
  end_date: "",
  is_paused: false,
  number_needed: 0,
  skills: null,
  recruitment_position: null,
  about_age: "",
  salary: "",
  custom_fields: [],
  distribution: [],
  created_by: "",
  updated_by: "",
  owner: null,
  type_display: "",
  manger_display: "",
});

const tempCampaign = ref({ ...data.value });

const LoadDataApi = () => {
  API()
    .get(`campaign/${route.params.id}/`)
    .then((responsive) => {
      isLoading.value = false; // Dữ liệu đã tải xong, đặt isLoading về false
      if (!responsive) return;
      data.value = { ...responsive };
      tempCampaign.value = { ...responsive };
      document.title = responsive.name;
    })
    .catch((error) => {
      console.error(error);
      isLoading.value = false; // Dữ liệu tải bị lỗi, đặt isLoading về false
    });
};

LoadDataApi();
const handleClickEdit = () => {
  if (formOffcanvas.value) {
    formOffcanvas.value.handleClickEdit(data.value.id);
  }
};
const handleClickViewUser = (user) => {
  viewUser.value = user;

  API()
    .get(`user/${viewUser.value.id}/`)
    .then((responsive) => {
      viewUser.value = { ...responsive };
    })
    .catch((error) => {
      console.error(error);
    });
};

const groupedFields = computed(() => {
  if (!data.value.custom_fields?.length || data.value.custom_fields == {})
    return [...fields];
  // Xử lý custom_fields (giả sử mỗi mục đều có icon, label, value)

  const arrChung = data.value.custom_fields
    .filter((item) => !item?.title_head || item?.title_head.trim() === "")
    .flatMap((item) => item?.values);

  if (!arrChung.length) return [...fields];
  const customFields = arrChung.map((custom) => {
    return setField(
      custom.icon || "bi-file-earmark-fill", // Icon mặc định nếu không có
      custom.name || "Không xác định",
      () => custom.value // Giá trị trực tiếp từ custom field
    );
  });

  // Gộp fields và customFields
  let allFields = [...fields, ...customFields];

  return allFields;
});

const copyToClipboard = () => {
  // Sao chép URL vào clipboard
  navigator.clipboard
    .writeText(data.value.qr_code.path)
    .then(() => {
      successToast("Đã sao chép đường dẫn");
    })
    .catch(() => {
      alert("Không thể sao chép đường dẫn. Vui lòng thử lại.");
    });
};
</script>

<template>
  <Layout
    :address="{
      title: 'Chiến dịch tuyển dụng / Hoạt động / Thông tin chi tiết',
    }"
    chooseMenu="ban-do"
  >
    <div class="chat-wrapper gap-xl-1 mx-n4 p-1 h-100 d-flex flex-column">
      <div
        class="mb-0 card flex-grow-1 position-relative"
        style="overflow: hidden auto"
      >
        <div class="card-body container-fluid">
          <div>
            <div v-if="isLoading" class="text-center">
              <!-- Sử dụng hiệu ứng loading của Bootstrap -->
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else class="text-muted">
              <div class="max-w-4xl mx-auto">
                <div v-if="false" class="d-flex justify-content-between mb-2">
                  <div></div>
                  <div class="h-100 d-flex align-items-center gap-2">
                    <button
                      type="button"
                      title="Chỉnh sửa"
                      class="btn btn-warning btn-icon waves-effect waves-light"
                      @click="handleClickEdit"
                    >
                      <i class="las la-edit"></i>
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-xl-7">
                    <AccordionRecord class="card" :title="data.name">
                      <div class="p-3 pt-0">
                        <div
                          v-if="data?.salary"
                          class="d-flex align-items-center"
                        >
                          <div class="avatar-xs flex-shrink-0">
                            <span class="avatar-title bg-light rounded-circle">
                              <i
                                class="ri-money-dollar-circle-line text-primary fs-16"
                              ></i>
                            </span>
                          </div>
                          <div class="ms-3">
                            <h6 class="fs-14 mb-1">Mức lương:&nbsp;</h6>
                          </div>
                          <div class="text-end">
                            <h6 class="mb-1 fw-semibold text-primary">
                              {{ data.salary }}
                            </h6>
                          </div>
                        </div>
                        <div
                          v-if="data?.about_age"
                          class="mt-3 d-flex align-items-center"
                        >
                          <div class="avatar-xs flex-shrink-0">
                            <span class="avatar-title bg-light rounded-circle">
                              <i class="ri-user-line text-primary fs-16"></i>
                            </span>
                          </div>
                          <div class="ms-3">
                            <h6 class="fs-14 mb-1">Độ tuổi:&nbsp;</h6>
                          </div>
                          <div class="text-end">
                            <h6 class="mb-1 fw-semibold text-primary">
                              {{ data.about_age }}
                            </h6>
                          </div>
                        </div>
                        <div class="mt-3 d-flex align-items-center">
                          <div class="avatar-xs flex-shrink-0">
                            <span class="avatar-title bg-light rounded-circle">
                              <i
                                class="ri-calendar-event-fill text-primary fs-16"
                              ></i>
                            </span>
                          </div>
                          <div class="ms-3">
                            <h6 class="fs-14 mb-1">Thời gian tuyển:&nbsp;</h6>
                          </div>
                          <div class="text-end">
                            <h6 class="mb-1 fw-semibold text-primary">
                              {{ formatDate(data.start_date) }} -
                              {{ formatDate(data.end_date) }}
                            </h6>
                          </div>
                        </div>
                        <div class="mt-3 d-flex align-items-center">
                          <div class="avatar-xs flex-shrink-0">
                            <span class="avatar-title bg-light rounded-circle">
                              <i
                                class="ri-map-pin-2-fill text-primary fs-16"
                              ></i>
                            </span>
                          </div>
                          <div class="ms-3">
                            <h6 class="fs-14 mb-1">Khu vực tuyển:&nbsp;</h6>
                          </div>
                          <div class="">
                            <h6 class="mb-1 fw-semibold text-primary">
                              <a class="text-decoration-none" href="#">
                                {{ data.customer?.address_display }}
                              </a>
                            </h6>
                          </div>
                        </div>
                        <div class="mt-3 d-flex align-items-center">
                          <div class="avatar-xs flex-shrink-0">
                            <span class="avatar-title bg-light rounded-circle">
                              <i
                                class="ri-user-star-fill text-primary fs-16"
                              ></i>
                            </span>
                          </div>
                          <div class="ms-3">
                            <h6 class="fs-14 mb-1">Nhân sự quản lý:&nbsp;</h6>
                          </div>
                          <div class="">
                            <h6 class="mb-1 fw-semibold text-primary">
                              <a
                                v-for="(user, indexuser) in data.manager"
                                :key="user.id"
                                href="javascript:void(0)"
                                @click="handleClickViewUser(user)"
                                class="text-decoration-none"
                                v-b-modal.view-profile-user
                              >
                                {{ user.first_name }}
                                {{ user.last_name }}&nbsp;
                                {{
                                  indexuser == data.manager.length - 1
                                    ? ""
                                    : "/"
                                }}&nbsp;
                              </a>
                            </h6>
                          </div>
                        </div>
                        <div class="row mt-3">
                          <div class="col-md-4 mb-4 mb-md-0"></div>
                          <div
                            class="col-md-8 d-flex align-items-end justify-content-md-end"
                          >
                            <p class="small text-muted mb-0">
                              <i class="bi bi-calendar-day-fill me-2"></i>
                              <span>
                                Ngày cập nhật:
                                <b>{{ formatDate(data.updated_date) }}</b>
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionRecord>

                    <AccordionRecord class="card" title="Thông tin chung">
                      <div class="row px-3">
                        <template
                          v-for="(group, groupIndex) in groupedFields"
                          :key="groupIndex"
                        >
                          <div
                            v-if="group.value(data)"
                            class="col-md-6 border-bottom mb-3"
                          >
                            <div class="d-flex align-items-center mb-3">
                              <i
                                class="bg-primary text-white rounded-circle p-2 position-relative"
                              >
                                <i
                                  class="position-absolute d-flex justify-content-center align-items-center fs-10"
                                  style="inset: 0"
                                  :class="group.icon"
                                ></i>
                              </i>
                              <div class="ms-3">
                                <p class="mb-1 text-muted">{{ group.label }}</p>
                                <p class="fw-bold mb-0">
                                  {{ group.value(data) }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                    </AccordionRecord>

                    <!-- Thông tin thêm quản lý tự custom -->
                    <template v-if="data?.custom_fields?.length">
                      <template
                        v-for="InforMore in data.custom_fields"
                        :key="InforMore.title_head"
                      >
                        <AccordionRecord
                          v-if="InforMore?.title_head"
                          class="card"
                          :title="InforMore.title_head"
                        >
                          <div class="row px-3">
                            <template
                              v-for="(group, groupIndex) in InforMore.values"
                              :key="groupIndex"
                            >
                              <div
                                v-if="group.value"
                                class="col-md-6 border-bottom mb-3"
                              >
                                <div class="d-flex align-items-center mb-3">
                                  <i
                                    class="bg-primary text-white rounded-circle p-2 position-relative"
                                  >
                                    <i
                                      class="position-absolute d-flex justify-content-center align-items-center fs-10"
                                      style="inset: 0"
                                      :class="group?.icon"
                                    ></i>
                                  </i>
                                  <div class="ms-3">
                                    <p class="mb-1 text-muted">
                                      {{ group.name }}
                                    </p>
                                    <p class="fw-bold mb-0">
                                      {{ group.value }}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </div>
                        </AccordionRecord>
                      </template>
                    </template>

                    <AccordionRecord
                      v-if="data.customer?.documents?.length"
                      class="card"
                      title="Hồ sơ yêu cầu"
                    >
                      <div class="table-responsive">
                        <table
                          class="table table-hover table-striped align-middle table-nowrap mb-0"
                        >
                          <thead>
                            <tr>
                              <th scope="col">STT</th>
                              <th scope="col">Tên hồ sơ</th>
                              <th scope="col">Mã hồ sơ</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(document, indexDoc) in data.customer
                                .documents"
                              :key="document.id"
                            >
                              <td class="fw-medium">{{ indexDoc + 1 }}</td>
                              <td>{{ document.display_name }}</td>
                              <td>{{ document.name }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </AccordionRecord>

                    <AccordionRecord
                      class="card"
                      title="Mô tả chi tiết chiến dịch"
                    >
                      <div class="mb-3 p-2">
                        <div v-html="data?.description"></div>
                      </div>
                    </AccordionRecord>
                  </div>
                  <div class="col-xl-5">
                    <AccordionRecord class="card" title="QR Code">
                      <div class="card-body pt-0">
                        <div
                          class="d-flex justify-content-center align-items-center"
                        >
                          <p class="m-0 d-flex">
                            <img
                              :src="data.qr_code.base64"
                              style="width: 350px; max-width: 100%"
                              alt="QR Code"
                              class="img-fluid"
                            />
                          </p>
                        </div>
                        <div
                          class="d-flex align-items-center justify-content-end gap-3"
                        >
                          <div class="flex-1">
                            <input
                              ref="inputRef"
                              type="text"
                              class="form-control"
                              :value="data.qr_code.path"
                              disabled
                            />
                          </div>
                          <i
                            @click="copyToClipboard"
                            class="ri-checkbox-multiple-blank-line fs-20 search-icon text-black-50 cursor-pointer hover-text-primary"
                          ></i>
                        </div>
                      </div>
                      <!-- Thêm mô tả chi tiết -->
                      <div class="card-footer text-muted fs-12">
                        Dùng ứng dụng quét mã QR trên điện thoại của bạn để truy
                        cập nhanh vào chiến dịch này và chia sẻ với bạn bè. Đảm
                        bảo mã QR rõ ràng và không bị che khuất khi quét.
                      </div>
                    </AccordionRecord>
                    <AccordionRecord class="card" title="Hình ảnh">
                      <div
                        class="d-flex justify-content-center align-items-center pb-3"
                      >
                        <SlideImg :modoValue="data.customer.gallery"></SlideImg>
                      </div>
                    </AccordionRecord>

                    <AccordionRecord
                      title="Video"
                      class="card"
                      v-if="data?.customer?.video_link"
                    >
                      <div class="mb-4">
                        <div
                          class="d-flex justify-content-center align-items-center"
                        >
                          <iframe
                            width="100%"
                            height="400"
                            :src="getSrcYoutube(data.customer.video_link)"
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                          >
                          </iframe>
                        </div>
                      </div>
                    </AccordionRecord>
                    <AccordionRecord
                      v-if="data.link_map"
                      class="card"
                      title="Liên kết bản đồ"
                    >
                      <div class="mb-4">
                        <div
                          v-if="
                            checkLinkMapShare(data.link_map) == 'Iframe Embed'
                          "
                          class="d-flex justify-content-center align-items-center"
                          v-html="data.link_map"
                        ></div>
                        <a
                          v-else-if="
                            checkLinkMapShare(data.link_map) == 'Shared Link'
                          "
                          :href="data.link_map"
                        >
                          <iframe
                            :src="convertSharedLinkToEmbed(data.link_map)"
                            height="450"
                            class="w-100 border-0"
                            allowfullscreen=""
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                          ></iframe>
                        </a>
                      </div>
                    </AccordionRecord>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>

  <FormOffcanvas ref="formOffcanvas"></FormOffcanvas>

  <Modal id="view-profile-user" title="Người quản lý" hideFooter>
    <CardUser :user="viewUser"></CardUser>
  </Modal>
</template>
