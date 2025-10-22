<script setup>
import Layout from "@/app_manage_dynamic_api/layout/main.vue";
import LayoutRecord from "../../app_manage_dynamic_api/layout/record/LayoutRecord.vue";
import { watch, ref } from "vue";
import API from "../../app_manage_dynamic_api/helper/api/useAxios";
import Photo from "../../base/components/photo/Photo.vue";
import AccordionInfor from "../../app_user/components/AccordionInfor.vue";
import { CompanyInfor, getCompanyInfor } from "@/helpers/user/company.js";

const isLoading = ref(false); // Biến isLoading để kiểm tra trạng thái tải dữ
const btnSubmit = ref(null);
const tempCompanyInfor = ref({ ...CompanyInfor.value });
const LoadDataApi = async () => {
  isLoading.value = true;
  await getCompanyInfor();
  isLoading.value = false;
};

function updateCompanyInfo() {
  const formData = new FormData();
  for (const key in tempCompanyInfor.value) {
    if (Object.prototype.hasOwnProperty.call(tempCompanyInfor.value, key)) {
      const value = tempCompanyInfor.value[key];
      if (value) {
        switch (key) {
          case "social_network_link":
            formData.append(key, JSON.stringify(value));
            break;
          case "photo":
            if (typeof value !== "string") formData.append(key, value);
            break;
          default:
            formData.append(key, value);
        }
      }
    }
  }

  API()
    .patch(
      `organization/${process.env.VUE_APP_ID_ORGANIZATION}/`,
      formData,
      "Cập nhật thành công",
      "Vui lòng kiểm tra lại dữ liệu"
    )
    .then((data) => {
      if (data) {
        LoadDataApi();
      }
    });
}

watch(CompanyInfor, () => {
  tempCompanyInfor.value = { ...CompanyInfor.value };
});
</script>

<template>
  <Layout :address="{ title: 'thông tin công ty' }" chooseMenu="ban-do">
    <div class="chat-wrapper gap-xl-1 mx-n4 p-1 h-100 d-flex flex-column">
      <div
        class="card mb-0 flex-grow-1 position-relative"
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
              <div
                class="d-flex justify-content-between align-items-center mb-2"
              >
                <div></div>
                <div class="h-100 d-flex align-items-center gap-2">
                  <button
                    type="button"
                    title="Chỉnh sửa"
                    class="btn btn-warning btn-icon waves-effect waves-light"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasedit-companyinfor"
                    aria-controls="offcanvasedit-companyinfor"
                  >
                    <i class="las la-edit"></i>
                  </button>
                </div>
              </div>
              <AccordionInfor title="CÔNG TY">
                <div class="ps-3">
                  <table class="table table-borderless ps-3 mb-3">
                    <tbody>
                      <tr>
                        <td class="col-4 ps-0 text-muted" scope="row">
                          Tên đầy đủ:
                        </td>
                        <th class="">{{ CompanyInfor.name }}</th>
                      </tr>
                      <tr>
                        <td class="col-4 ps-0 text-muted" scope="row">
                          Tên giao dịch/viết tắt:
                        </td>
                        <th class="">{{ CompanyInfor.short_name }}</th>
                      </tr>
                      <tr>
                        <td class="col-4 ps-0 text-muted" scope="row">
                          Mã số thuế:
                        </td>
                        <th class="">{{ CompanyInfor.tax_code }}</th>
                      </tr>
                      <tr>
                        <td class="col-4 ps-0 text-muted" scope="row">
                          Mã công ty:
                        </td>
                        <th class="">{{ CompanyInfor.code }}</th>
                      </tr>
                      <tr>
                        <td class="col-4 ps-0 text-muted" scope="row">
                          Ngày thành lập:
                        </td>
                        <th class="">
                          {{
                            new Date(
                              CompanyInfor.founding_date
                            ).toLocaleDateString()
                          }}
                        </th>
                      </tr>
                      <tr>
                        <td class="col-4 ps-0 text-muted" scope="row">
                          Logo công ty:
                        </td>
                        <th class="">
                          <img
                            :src="CompanyInfor.photo"
                            alt="Logo"
                            style="max-width: 100px"
                          />
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AccordionInfor>

              <div class="pt-3 border-top border-top-dashed mt-4">
                <AccordionInfor title="ĐĂNG KÍ KINH DOANH">
                  <div class="ps-3">
                    <table class="table table-borderless ps-3 mb-3">
                      <tbody>
                        <tr>
                          <td class="col-4 ps-0 text-muted" scope="row">
                            Mã số ĐKKD:
                          </td>
                          <th class="">_</th>
                        </tr>
                        <tr>
                          <td class="col-4 ps-0 text-muted" scope="row">
                            Ngày cấp:
                          </td>
                          <th class="">_</th>
                        </tr>
                        <tr>
                          <td class="col-4 ps-0 text-muted" scope="row">
                            Nơi cấp:
                          </td>
                          <th class="">_</th>
                        </tr>
                        <tr>
                          <td class="col-4 ps-0 text-muted" scope="row">
                            Người đại diện pháp luật:
                          </td>
                          <th class="">{{ CompanyInfor.representative }}</th>
                        </tr>
                        <tr>
                          <td class="col-4 ps-0 text-muted" scope="row">
                            Chức danh:
                          </td>
                          <th class="">
                            {{ CompanyInfor.representative_title }}
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionInfor>
              </div>

              <div class="pt-3 border-top border-top-dashed mt-4">
                <AccordionInfor title="LIÊN HỆ">
                  <div class="ps-3">
                    <table class="table table-borderless ps-3 mb-3">
                      <tbody>
                        <tr>
                          <td class="col-4 ps-0 text-muted" scope="row">
                            Địa chỉ:
                          </td>
                          <th class="">{{ CompanyInfor.address }}</th>
                        </tr>
                        <tr>
                          <td class="col-4 ps-0 text-muted" scope="row">
                            Điện thoại:
                          </td>
                          <th class="">
                            {{ CompanyInfor.phone_number ?? "_" }}
                          </th>
                        </tr>
                        <tr>
                          <td class="col-4 ps-0 text-muted" scope="row">
                            Fax:
                          </td>
                          <th class="">{{ CompanyInfor.fax }}</th>
                        </tr>
                        <tr>
                          <td class="col-4 ps-0 text-muted" scope="row">
                            Email:
                          </td>
                          <th class="">{{ CompanyInfor.email }}</th>
                        </tr>
                        <tr>
                          <td class="col-4 ps-0 text-muted" scope="row">
                            Website:
                          </td>
                          <th class="">{{ CompanyInfor.website }}</th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionInfor>
              </div>

              <div class="pt-3 border-top border-top-dashed mt-4">
                <AccordionInfor title="MẠNG XÃ HỘI">
                  <div class="ps-3">
                    <b-row>
                      <b-col cols="6">
                        <div class="d-flex mt-2">
                          <div
                            class="flex-shrink-0 avatar-xs align-self-center me-3"
                          >
                            <div
                              class="avatar-title rounded bg-primary text-white"
                            >
                              <i class="ri-facebook-fill fs-16"></i>
                            </div>
                          </div>
                          <div class="flex-grow-1 overflow-hidden">
                            <p class="mb-0 fs-13">Facebook :</p>
                            <a
                              target="_blank"
                              v-if="CompanyInfor.social_network_link.facebook"
                              :href="
                                `https://www.facebook.com/${CompanyInfor.social_network_link.facebook}` ||
                                '#'
                              "
                              class="text-info text-decoration-underline"
                            >
                              {{
                                CompanyInfor.social_network_link.facebook ||
                                "Chưa liên kết"
                              }}
                            </a>
                          </div>
                        </div>
                      </b-col>
                      <b-col cols="6">
                        <div class="d-flex mt-2">
                          <div
                            class="flex-shrink-0 avatar-xs align-self-center me-3"
                          >
                            <span
                              class="avatar-title rounded-circle fs-16 bg-dark text-light"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-tiktok"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"
                                ></path>
                              </svg>
                            </span>
                          </div>
                          <div class="flex-grow-1 overflow-hidden">
                            <p class="mb-0 fs-13">Tiktok :</p>
                            <a
                              target="_blank"
                              v-if="CompanyInfor.social_network_link.tiktok"
                              :href="
                                `https://www.tiktok.com/@${CompanyInfor.social_network_link.tiktok}` ||
                                '#'
                              "
                              class="text-info text-decoration-underline"
                            >
                              {{
                                CompanyInfor.social_network_link.tiktok ||
                                "Chưa liên kết"
                              }}
                            </a>
                          </div>
                        </div>
                      </b-col>
                      <b-col cols="6">
                        <div class="d-flex mt-2">
                          <div
                            class="flex-shrink-0 avatar-xs align-self-center me-3"
                          >
                            <div
                              class="avatar-title rounded bg-white text-light"
                            >
                              <img
                                height="32"
                                width="32"
                                src="@/assets/images/icon/zalo-logo.png"
                              />
                            </div>
                          </div>
                          <div class="flex-grow-1 overflow-hidden">
                            <p class="mb-0 fs-13">Zalo :</p>
                            <a
                              target="_blank"
                              v-if="CompanyInfor.social_network_link.zalo"
                              :href="
                                `https://zalo.me/${CompanyInfor.social_network_link.zalo}` ||
                                '#'
                              "
                              class="text-info text-decoration-underline"
                            >
                              {{
                                CompanyInfor.social_network_link.zalo ||
                                "Chưa liên kết"
                              }}
                            </a>
                          </div>
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                </AccordionInfor>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>

  <LayoutRecord
    id="edit-companyinfor"
    title="Chỉnh sửa"
    style="margin-top: 74px"
  >
    <template #header>
      <button
        type="button"
        class="btn btn-warning btn-icon waves-effect waves-light"
        @click="btnSubmit.click"
      >
        <i class="ri-save-2-fill"></i>
      </button>
      <button
        type="button"
        class="btn btn-danger btn-icon waves-effect waves-light"
        @click="tempCompanyInfor = { ...CompanyInfor }"
      >
        <i class="las la-undo-alt"></i>
      </button>
    </template>

    <template #body>
      <form @submit.prevent="updateCompanyInfo">
        <div class="mb-3">
          <label for="name" class="form-label"
            >Tên đầy đủ<span class="text-danger">*</span></label
          >
          <input
            v-model="tempCompanyInfor.name"
            type="text"
            class="form-control"
            name="name"
            required
          />
        </div>
        <div class="mb-3">
          <label for="short_name" class="form-label">
            Tên giao dịch/viết tắt<span class="text-danger">*</span>
          </label>
          <input
            v-model="tempCompanyInfor.short_name"
            type="text"
            class="form-control"
            name="short_name"
            required
          />
        </div>
        <div class="mb-3">
          <label for="tax_code" class="form-label"
            >Mã số thuế
            <span class="text-danger">*</span>
          </label>
          <input
            v-model="tempCompanyInfor.tax_code"
            type="text"
            class="form-control"
            name="tax_code"
            required
          />
        </div>
        <div class="mb-3">
          <label for="code" class="form-label">Mã công ty</label>
          <input
            v-model="tempCompanyInfor.code"
            type="text"
            class="form-control"
            name="code"
            disabled
          />
        </div>
        <div class="mb-3">
          <label for="founding_date" class="form-label">Ngày thành lập</label>
          <input
            v-model="tempCompanyInfor.founding_date"
            type="date"
            class="form-control"
            name="founding_date"
          />
        </div>
        <div class="mb-3">
          <label for="photo" class="form-label">Logo công ty</label>
          <Photo
            id="photo"
            v-model="tempCompanyInfor.photo"
            label="Logo công ty"
            :currentPhoto="tempCompanyInfor?.photo"
            name="photo"
          ></Photo>
        </div>
        <div class="mb-3">
          <label for="representative" class="form-label"
            >Người đại diện pháp luật</label
          >
          <input
            v-model="tempCompanyInfor.representative"
            type="text"
            class="form-control"
            name="representative"
          />
        </div>
        <div class="mb-3">
          <label for="representative_title" class="form-label">Chức danh</label>
          <input
            v-model="tempCompanyInfor.representative_title"
            type="text"
            class="form-control"
            name="representative_title"
          />
        </div>
        <div class="mb-3">
          <label for="address" class="form-label"
            >Địa chỉ
            <span class="text-danger">*</span>
          </label>
          <input
            v-model="tempCompanyInfor.address"
            type="text"
            class="form-control"
            name="address"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Điện thoại</label>
          <input
            v-model="tempCompanyInfor.phone_number"
            type="text"
            class="form-control"
            name="phone"
          />
        </div>
        <div class="mb-3">
          <label for="fax" class="form-label">Fax</label>
          <input
            v-model="tempCompanyInfor.fax"
            type="text"
            class="form-control"
            name="fax"
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            v-model="tempCompanyInfor.email"
            type="email"
            class="form-control"
            name="email"
          />
        </div>
        <div class="mb-3">
          <label for="website" class="form-label">Website</label>
          <input
            v-model="tempCompanyInfor.website"
            type="text"
            class="form-control"
            name="website"
          />
        </div>
        <div>
          <label for="website" class="form-label">Liên kết</label>
          <div class="mb-3 d-flex align-items-center">
            <div class="avatar-xs d-block flex-shrink-0 me-3">
              <span class="avatar-title rounded-circle fs-16 bg-primary"
                ><i class="ri-facebook-fill"></i
              ></span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Link to Faceook"
              v-model="tempCompanyInfor.social_network_link.facebook"
            />
          </div>
          <div class="mb-3 d-flex align-items-center">
            <div class="avatar-xs d-block flex-shrink-0 me-3">
              <span class="avatar-title rounded-circle fs-16 bg-dark text-light"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-tiktok"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"
                  ></path></svg
              ></span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Link to tiktok"
              v-model="tempCompanyInfor.social_network_link.tiktok"
            />
          </div>
          <div class="mb-3 d-flex align-items-center">
            <div class="avatar-xs d-block flex-shrink-0 me-3">
              <span
                class="avatar-title rounded-circle fs-16 bg-white text-light"
                ><img
                  height="32"
                  width="32"
                  src="@/assets/images/icon/zalo-logo.png"
              /></span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Số điện thoại Zalo"
              v-model="tempCompanyInfor.social_network_link.zalo"
            />
          </div>
        </div>
        <button ref="btnSubmit" type="submit" class="d-none"></button>
      </form>
    </template>
  </LayoutRecord>
</template>
