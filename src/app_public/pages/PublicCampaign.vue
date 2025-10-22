<script setup>
import { ref, reactive, computed } from "vue";
import { useRoute } from "vue-router";
import API from "@/app_manage_dynamic_api/helper/api/useAxios";
import LayoutRecord from "@/app_manage_dynamic_api/layout/record/LayoutRecord.vue";
import LayoutMain from "../layout/LayoutMain.vue";
import Modal from "@/base/components/dtwinUI/Modal.vue";
import CardUser from "../components/CardUser.vue";
import SlideImg from "../../app_campaign/components/SlideImg.vue";
import { CompanyInfor } from "@/helpers/user/company.js";
import ButtonIcon from "@/base/components/baseUI/ButtonIcon.vue";
import FormCandidate from "../components/FormCandidate.vue";
import ShareCampaign from "../components/ShareCampaign.vue";
import {
  checkLinkMapShare,
  convertSharedLinkToEmbed,
  fieldsView as fields,
  setField,
  formatDate,
  getSrcYoutube,
} from "../../app_campaign/common/common.js";

const route = useRoute();
const formCandidateRef = ref(null);
const viewUser = ref({});

const formData = ref({
  first_name: "",
  last_name: "",
  gender_display: "",
  description: "",
  phone: null,
  email: null,
  permanent_residence: "",
  current_residence: "",
  hometown: "",
  household_head: "",
  identification_number: "",
  skill: "",
  educational_level: "",
  introducer: route.query.aff ?? "",
  campaign: route.params.id ?? "",
});

const ValueView = reactive({
  affiliate: {},
  campaign: {},
});

if (route.query?.aff) {
  API()
    .get(`user/${route.query.aff}/`)
    .then((responsive) => {
      ValueView.affiliate = { ...responsive };
    })
    .catch((error) => {
      console.error(error);
    });
}

const isLoading = ref(true);
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

const LoadDataApi = () => {
  API()
    .get(`campaign/${route.params.id}/`)
    .then((responsive) => {
      isLoading.value = false; // Dữ liệu đã tải xong, đặt isLoading về false
      if (!responsive) return;
      data.value = { ...responsive };
      ValueView.campaign = { ...responsive };
    })
    .catch((error) => {
      console.error(error);
      isLoading.value = false; // Dữ liệu tải bị lỗi, đặt isLoading về false
    });
};

LoadDataApi();

const handleClickSubmitForm = () => {
  formCandidateRef.value.btnSubmit.click();
};
const handleClickResetForm = () => {
  formCandidateRef.value.btnReset.click();
};
const handleSubmit = () => {
  console.log(formData);

  API().post(
    "candidate/",
    formData.value,
    "Đã lưu lại thông tin của bạn",
    "Vui lòng kiểm tra lại thông tin!"
  );
};

const handleClickViewUser = (user) => {
  viewUser.value = user;

  API()
    .get(`user/${user.id}/`)
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

const screenWidth = ref(window.innerWidth);
const computedMarginTop = computed(() => {
  return screenWidth.value < 768 ? "115px" : "73px";
});
const slidesPer = computed(() => {
  if (screenWidth.value < 768) {
    return 1; // Mobile
  } else if (screenWidth.value < 1024) {
    return 2; // Tablet
  } else {
    return 3; // Desktop
  }
});
</script>

<template>
  <LayoutMain v-cloak class="pt-5 pt-lg-0">
    <div class="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
      <div class="container">
        <div class="my-3">
          <!-- <div class="page-title-right">
            <ol class="breadcrumb m-0 fs-14 fw-bold">
              <li class="breadcrumb-item">
                <a href="javascript: void(0);">Trang chủ</a>
              </li>
              <li class="breadcrumb-item active">
                {{ data.name }}
              </li>
            </ol>
          </div> -->
        </div>
        <div class="row">
          <div class="col-xl-9 col-12">
            <!-- Poster -->
            <div class="card shadow rounded-sm">
              <div class="card-header align-items-center d-flex">
                <h5 class="card-title mb-0 flex-grow-1 fw-bold">
                  {{ data.name }}
                </h5>
              </div>
              <div class="card-body">
                <div v-if="data?.salary" class="d-flex align-items-center">
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
                      <i class="ri-calendar-event-fill text-primary fs-16"></i>
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
                      <i class="ri-map-pin-2-fill text-primary fs-16"></i>
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
                      <i class="ri-user-star-fill text-primary fs-16"></i>
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
                          indexuser == data.manager.length - 1 ? "" : "/"
                        }}&nbsp;
                      </a>
                    </h6>
                  </div>
                </div>
                <div class="row mt-4 mt-md-0">
                  <div class="col-md-4 mb-md-0"></div>
                  <div
                    class="col-md-8 d-flex align-items-end gap-2 justify-content-end"
                  >
                    <ButtonIcon
                      name="Chia sẻ việc làm"
                      class-icon="ri-share-forward-fill"
                      type="light"
                      v-b-modal.share-campaign
                    />
                    <ButtonIcon
                      name="Nộp hồ sơ"
                      class-icon="ri-send-plane-fill"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasforms-candidate"
                      aria-controls="offcanvasforms-candidate"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- Thông tin chung -->
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0 flex-grow-1">Thông tin chung</h5>
              </div>
              <div class="card-body">
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
                  <div
                    v-if="data.customer?.documents?.length"
                    class="col-md-12 border-bottom mb-3"
                  >
                    <div class="d-flex align-items-center mb-3">
                      <i
                        class="bg-primary text-white rounded-circle p-2 position-relative"
                      >
                        <i
                          class="ri-file-user-fill position-absolute d-flex justify-content-center align-items-center fs-10"
                          style="inset: 0"
                        ></i>
                      </i>
                      <div class="ms-3" v-if="data.customer.documents.length">
                        <p class="mb-1 text-muted">Hồ sơ yêu cầu:</p>
                        <h6 class="mb-1 fw-semibold text-primary">
                          <a
                            v-for="(documents, indexuser) in data.customer
                              .documents"
                            :key="documents.id"
                            href="javascript:void(0)"
                            class="text-decoration-none"
                          >
                            {{ documents.display_name }}&nbsp;
                            {{
                              indexuser == data.customer.documents.length - 1
                                ? ""
                                : "/"
                            }}&nbsp;
                          </a>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Thông tin thêm quản lý tự custom -->
            <template v-if="data?.custom_fields?.length">
              <template
                v-for="InforMore in data.custom_fields"
                :key="InforMore.title_head"
              >
                <div class="card" v-if="InforMore?.title_head">
                  <div class="card-header">
                    <h5 class="card-title mb-0 flex-grow-1">
                      {{ InforMore.title_head }}
                    </h5>
                  </div>
                  <div class="card-body">
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
                  </div>
                </div>
              </template>
            </template>

            <!-- Mô tả chiến dịch -->
            <div class="card">
              <div class="card-body">
                <div class="w-100 pb-4">
                  <SlideImg
                    :slidesPer="slidesPer"
                    :modoValue="data.customer.gallery"
                  ></SlideImg>
                </div>
                <!-- Mô tả mẫu -->
                <div v-html="data?.description"></div>

                <div class="mt-3">
                  <p>
                    Ứng viên nộp hồ sơ trực tuyến bằng cách bấm
                    <strong>Ứng tuyển ngay</strong> dưới đây.
                  </p>
                  <p>Hạn nộp hồ sơ: {{ formatDate(data.end_date) }}</p>
                  <div class="d-flex justify-content-center">
                    <ButtonIcon
                      name="Ứng tuyển ngay"
                      class-icon="ri-send-plane-fill"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasforms-candidate"
                      aria-controls="offcanvasforms-candidate"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3">
            <div class="card card-body">
              <div class="d-flex mb-3 align-items-center">
                <div class="flex-shrink-0">
                  <img
                    :src="data.customer?.logo"
                    alt=""
                    class="avatar-sm rounded-circle"
                  />
                </div>
                <div class="flex-grow-1 ms-2">
                  <h5 class="card-title fs-14 mb-1">
                    {{ data.customer?.name ?? "Đối tác" }}
                  </h5>
                  <!-- <p class="text-muted fs-12 mb-0">{{ data.customer?.str }}</p> -->
                </div>
              </div>
              <!-- <h6 class="mb-1">$15,548</h6>
            <p class="card-text text-muted">Expense Account</p> -->

              <div class="mb-1">
                <div
                  v-if="checkLinkMapShare(data.link_map) == 'Iframe Embed'"
                  class="d-flex justify-content-center align-items-center iframe__map"
                  v-html="data.link_map"
                ></div>
                <div
                  class="iframe__map"
                  v-else-if="checkLinkMapShare(data.link_map) == 'Shared Link'"
                >
                  <iframe
                    :src="convertSharedLinkToEmbed(data.link_map)"
                    height="450"
                    class="w-100 border-0"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h6 class="card-title mb-0">Thông tin liên hệ</h6>
              </div>
              <div class="card-body pb-2 text-center">
                <div v-if="ValueView.affiliate?.id" class="text-center">
                  <img
                    :src="ValueView.affiliate.photo"
                    alt=""
                    class="img-thumbnail rounded-circle object-cover"
                    style="width: 100px; height: 100px"
                  />
                  <h5>
                    {{ ValueView.affiliate.first_name }}&nbsp;{{
                      ValueView.affiliate.last_name
                    }}
                  </h5>
                </div>
                <div v-else class="text-center">
                  <img
                    :src="CompanyInfor.photo"
                    alt=""
                    class="img-thumbnail rounded-circle object-cover"
                    style="width: 100px; height: 100px"
                  />
                  <h5>{{ CompanyInfor.name }}</h5>
                </div>
              </div>
              <div class="card-footer">
                <div v-if="ValueView.affiliate?.id">
                  <div class="d-flex mb-2">
                    <div class="flex-shrink-0 avatar-xs align-self-center me-3">
                      <div
                        class="avatar-title bg-light rounded-circle fs-16 text-primary"
                      >
                        <i class="ri-phone-fill"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 overflow-hidden">
                      <p class="mb-1">Số điện thoại :</p>
                      <h6 class="text-truncate mb-0">
                        <a :href="'tel:' + ValueView.affiliate.phone">
                          {{ ValueView.affiliate.phone }}
                        </a>
                      </h6>
                    </div>
                  </div>

                  <div
                    class="d-flex mb-2"
                    v-if="ValueView.affiliate.social_network_link?.zalo"
                  >
                    <div class="flex-shrink-0 avatar-xs align-self-center me-3">
                      <div
                        class="avatar-title bg-light rounded-circle fs-16 text-primary"
                      >
                        <img
                          height="16"
                          width="16"
                          src="@/assets/images/icon/zalo-logo.png"
                        />
                      </div>
                    </div>
                    <a
                      :href="
                        `https://zalo.me/${ValueView.affiliate.social_network_link?.zalo}` ||
                        '#'
                      "
                    >
                      <div class="flex-grow-1 overflow-hidden">
                        <p class="mb-1">Zalo :</p>
                        <h6 class="text-truncate mb-0">
                          {{ ValueView.affiliate.social_network_link?.zalo }}
                        </h6>
                      </div>
                    </a>
                  </div>
                </div>
                <div v-else>
                  <div class="d-flex mb-2">
                    <div class="flex-shrink-0 avatar-xs align-self-center me-3">
                      <div
                        class="avatar-title bg-light rounded-circle fs-16 text-primary"
                      >
                        <i class="ri-phone-fill"></i>
                      </div>
                    </div>
                    <a :href="'tel:' + CompanyInfor.phone_number">
                      <div class="flex-grow-1 overflow-hidden">
                        <p class="mb-1">Số điện thoại :</p>
                        <h6 class="text-truncate mb-0">
                          {{ CompanyInfor.phone_number }}
                        </h6>
                      </div>
                    </a>
                  </div>
                  <div
                    class="d-flex mb-2"
                    v-if="CompanyInfor.social_network_link?.zalo"
                  >
                    <div class="flex-shrink-0 avatar-xs align-self-center me-3">
                      <div
                        class="avatar-title bg-light rounded-circle fs-16 text-primary"
                      >
                        <img
                          height="16"
                          width="16"
                          src="@/assets/images/icon/zalo-logo.png"
                        />
                      </div>
                    </div>
                    <a
                      :href="
                        `https://zalo.me/${CompanyInfor.social_network_link?.zalo}` ||
                        '#'
                      "
                    >
                      <div class="flex-grow-1 overflow-hidden">
                        <p class="mb-1">Zalo :</p>
                        <h6 class="text-truncate mb-0">
                          {{ CompanyInfor.social_network_link?.zalo }}
                        </h6>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <!-- QR -->
            <div class="card">
              <div class="card-header">
                <h6 class="card-title mb-0">Ứng tuyển ngay</h6>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-center">
                  <img
                    :src="data.qr_get_form.base64"
                    style="max-width: 200px"
                    alt="QR Code"
                    class="img-fluid ms-2 w-100"
                  />
                </div>
              </div>
              <!-- Thêm mô tả chi tiết -->
              <div class="card-footer text-muted fs-12">
                Dùng ứng dụng quét mã QR trên điện thoại của bạn để truy cập
                nhanh để đăng ký chiến dịch này. Đảm bảo mã QR rõ ràng và không
                bị che khuất khi quét.
              </div>
            </div>
            <!-- Video -->
            <div class="card" v-if="data?.customer?.video_link">
              <div class="card-header">
                <h6 class="card-title mb-0">Video</h6>
              </div>
              <div class="card-body">
                <iframe
                  width="100%"
                  height="350"
                  :src="getSrcYoutube(data.customer.video_link)"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                >
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutMain>

  <LayoutRecord
    :style="{ marginTop: computedMarginTop }"
    id="forms-candidate"
    title="Mẫu đăng kí"
  >
    <template #header>
      <button
        type="button"
        class="btn btn-warning btn-icon waves-effect waves-light"
        @click="handleClickSubmitForm"
      >
        <i class="ri-save-2-fill"></i>
      </button>
      <button
        type="button"
        class="btn btn-danger btn-icon waves-effect waves-light"
        @click="handleClickResetForm"
      >
        <i class="las la-undo-alt"></i>
      </button>
    </template>

    <template #body>
      <FormCandidate
        ref="formCandidateRef"
        v-model="formData"
        @submit="handleSubmit"
        :valueView="ValueView"
      ></FormCandidate>
    </template>
  </LayoutRecord>
  <Modal id="view-profile-user" title="Người quản lý" hideFooter>
    <CardUser :user="viewUser"></CardUser>
  </Modal>
  <Modal id="share-campaign" title="Chia sẻ chiến dịch" centered hideFooter>
    <ShareCampaign :campaign="data"></ShareCampaign>
  </Modal>
</template>

<style>
.iframe__map iframe {
  width: 100%;
  height: 100px;
  border: 0;
  border-radius: 4px;
}
</style>
