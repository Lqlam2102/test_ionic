<script setup>
import { ref, inject } from "vue";
import Layout from "@/base/layouts/main.vue";
import { BASE_URL } from "@/helpers/api/axiosHttp";

const infoUser = inject("user");
const userFacebook = ref("");
const userGitHub = ref("");

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
}

function handleLinkSocial() {
  if (!infoUser.social_network_link) return;
  for (let i = 0; i < infoUser.value.social_network_link.length; i++) {
    if (infoUser.value.social_network_link[i].facebook)
      userFacebook.value = infoUser.value.social_network_link[i].facebook;
    if (infoUser.value.social_network_link[i].github)
      userGitHub.value = infoUser.value.social_network_link[i].github;
  }
}
setTimeout(() => {
  handleLinkSocial();
}, 500);
</script>

<template>
  <Layout pageLayout="horizontal">
    <b-container class="mt-3">
      <div class="profile-foreground position-relative mx-n4 mt-n4">
        <div class="profile-wid-bg">
          <img
            v-if="infoUser?.cover_img"
            :src="infoUser.cover_img"
            alt=""
            class="profile-wid-img"
            style="opacity: 0.5"
          />
          <img
            v-else
            src="@/assets/images/nft/bg-home.jpg"
            alt=""
            class="profile-wid-img"
            style="opacity: 0.5"
          />
        </div>
      </div>
      <div class="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
        <b-row class="g-4">
          <b-col lg="auto">
            <div
              class="profile-user position-relative d-inline-block mx-auto mb-4"
            >
              <img
                :src="infoUser?.photo"
                class="rounded-circle avatar-lg img-thumbnail user-profile-image"
                alt="user-profile-image"
                v-if="infoUser?.photo"
              />
              <img
                src="@/assets/images/users/user.jpg"
                class="rounded-circle avatar-lg img-thumbnail user-profile-image"
                alt="user-profile-image"
                v-else
              />
            </div>
          </b-col>
          <b-col>
            <div class="p-2">
              <h5 class="text-white mb-1">
                {{ infoUser?.first_name }} {{ infoUser?.last_name }}
              </h5>
              <!-- <p class="text-white-75">{{ userKCN.name_display }}</p> -->
              <div class="hstack text-white-50 gap-1">
                <div>
                  <i
                    class="ri-building-line me-1 text-white-75 fs-16 align-middle"
                  ></i
                  >{{ infoUser?.address }}
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
      <b-row>
        <b-col lg="12">
          <div>
            <div class="d-flex profile-wrapper">
              <ul
                class="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                role="tablist"
              >
                <li class="nav-item">
                  <b-link
                    class="nav-link fs-14 active"
                    data-bs-toggle="tab"
                    href="#overview-tab"
                    role="tab"
                  >
                    <i class="ri-airplay-fill d-inline-block d-md-none"></i>
                    <span class="d-none d-md-inline-block">Thông tin</span>
                  </b-link>
                </li>
                <li class="nav-item">
                  <b-link
                    class="nav-link fs-14"
                    data-bs-toggle="tab"
                    href="#activities"
                    role="tab"
                  >
                    <i class="ri-list-unordered d-inline-block d-md-none"></i>
                    <span class="d-none d-md-inline-block">Hoạt động</span>
                  </b-link>
                </li>
              </ul>
              <div class="flex-shrink-0">
                <router-link
                  to="/profile/edit"
                  class="btn btn-warning btn-icon waves-effect waves-light"
                  ><i class="las la-edit"></i>
                </router-link>
              </div>
            </div>
            <div class="tab-content pt-4 text-muted">
              <div class="tab-pane active" id="overview-tab" role="tabpanel">
                <b-row>
                  <b-col xxl="4">
                    <b-card no-body>
                      <b-card-body>
                        <h5 class="card-title mb-3">Thông tin cá nhân</h5>
                        <div class="table-responsive">
                          <table class="table table-borderless mb-0">
                            <tbody>
                              <tr>
                                <th class="ps-0" style="width: 40%" scope="row">
                                  Họ và tên:
                                </th>
                                <td class="text-muted">
                                  {{ infoUser?.first_name }}
                                  {{ infoUser?.last_name }}
                                </td>
                              </tr>
                              <tr>
                                <th class="ps-0" scope="row">Giới tính:</th>
                                <td class="text-muted">
                                  {{ infoUser?.gender === 0 ? "Nam" : "Nữ" }}
                                </td>
                              </tr>
                              <tr>
                                <th class="ps-0" scope="row">Ngày sinh:</th>
                                <td class="text-muted">
                                  {{
                                    infoUser?.birth
                                      ? formatDate(infoUser?.birth)
                                      : ``
                                  }}
                                </td>
                              </tr>
                              <tr>
                                <th class="ps-0" scope="row">Điện thoại:</th>
                                <td class="text-muted">
                                  {{ infoUser?.phone }}
                                </td>
                              </tr>
                              <tr>
                                <th class="ps-0" scope="row">Email:</th>
                                <td class="text-muted">
                                  {{ infoUser?.email }}
                                </td>
                              </tr>
                              <tr>
                                <th class="ps-0" scope="row">Địa chỉ:</th>
                                <td class="text-muted">
                                  {{ infoUser?.address }}
                                </td>
                              </tr>
                              <tr>
                                <th class="ps-0" scope="row">Ngày tham gia:</th>
                                <td class="text-muted">
                                  {{
                                    new Date(
                                      infoUser?.date_joined
                                    ).toLocaleDateString("en-GB")
                                  }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </b-card-body>
                    </b-card>
                  </b-col>
                  <b-col xxl="8">
                    <b-card no-body class="h-50">
                      <b-card-body>
                        <h5 class="card-title mb-3">Giới thiệu</h5>
                        <p>
                          {{
                            infoUser?.introduce
                              ? infoUser.introduce
                              : "Chưa có giới thiệu"
                          }}
                        </p>
                      </b-card-body>
                    </b-card>
                    <b-card no-body>
                      <b-card-body>
                        <h5 class="card-title">Liên kết</h5>
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
                                  v-if="userFacebook !== ''"
                                  :href="userFacebook"
                                  class="text-info text-decoration-underline"
                                  >{{ userFacebook }}</a
                                >
                              </div>
                            </div>
                          </b-col>
                          <b-col cols="6">
                            <div class="d-flex mt-2">
                              <div
                                class="flex-shrink-0 avatar-xs align-self-center me-3"
                              >
                                <div
                                  class="avatar-title rounded bg-dark text-light"
                                >
                                  <i class="ri-github-fill fs-16"></i>
                                </div>
                              </div>
                              <div class="flex-grow-1 overflow-hidden">
                                <p class="mb-0 fs-13">Github :</p>
                                <a
                                  v-if="userGitHub !== ''"
                                  :href="userGitHub"
                                  class="text-info text-decoration-underline"
                                  >{{ userGitHub }}</a
                                >
                              </div>
                            </div>
                          </b-col>
                        </b-row>
                      </b-card-body>
                    </b-card>
                  </b-col>
                </b-row>
              </div>
              <div class="tab-pane fade" id="activities" role="tabpanel">
                <b-card no-body>
                  <b-card-body>
                    <h5 class="card-title mb-3">Activities</h5>
                    <!-- <div class="acitivity-timeline">
                                            <div class="acitivity-item d-flex">
                                                <div class="flex-shrink-0">
                                                    <img src="@/assets/images/users/user.jpg" alt=""
                                                        class="avatar-xs rounded-circle acitivity-avatar" />
                                                </div>
                                                <div class="flex-grow-1 ms-3">
                                                    <h6 class="mb-1">
                                                        Oliver Phillips
                                                        <b-badge variant="soft-primary"
                                                            class="text-primary align-middle">New</b-badge>
                                                    </h6>
                                                    <p class="text-muted mb-2">
                                                        We talked about a project on linkedin.
                                                    </p>
                                                    <small class="mb-0 text-muted">Today</small>
                                                </div>
                                            </div>
                                            <div class="acitivity-item py-3 d-flex">
                                                <div class="flex-shrink-0 avatar-xs acitivity-avatar">
                                                    <div class="avatar-title bg-soft-success text-success rounded-circle">
                                                        N
                                                    </div>
                                                </div>
                                                <div class="flex-grow-1 ms-3">
                                                    <h6 class="mb-1">
                                                        Nancy Martino
                                                        <b-badge variant="soft-secondary"
                                                            class="text-secondary align-middle">In Progress</b-badge>
                                                    </h6>
                                                    <p class="text-muted mb-2">
                                                        <i class="ri-file-text-line align-middle ms-2"></i>
                                                        Create new project Buildng product
                                                    </p>
                                                    <div class="avatar-group mb-2">
                                                        <b-link href="javascript: void(0);" class="avatar-group-item"
                                                            data-bs-toggle="tooltip" data-bs-placement="top" title=""
                                                            data-bs-original-title="Christi">
                                                            <img src="@/assets/images/users/user.jpg" alt=""
                                                                class="rounded-circle avatar-xs" />
                                                        </b-link>
                                                        <b-link href="javascript: void(0);" class="avatar-group-item"
                                                            data-bs-toggle="tooltip" data-bs-placement="top" title=""
                                                            data-bs-original-title="Frank Hook">
                                                            <img src="@/assets/images/users/user.jpg" alt=""
                                                                class="rounded-circle avatar-xs" />
                                                        </b-link>
                                                        <b-link href="javascript: void(0);" class="avatar-group-item"
                                                            data-bs-toggle="tooltip" data-bs-placement="top" title=""
                                                            data-bs-original-title=" Ruby">
                                                            <div class="avatar-xs">
                                                                <div
                                                                    class="avatar-title rounded-circle bg-light text-primary">
                                                                    R
                                                                </div>
                                                            </div>
                                                        </b-link>
                                                        <b-link href="javascript: void(0);" class="avatar-group-item"
                                                            data-bs-toggle="tooltip" data-bs-placement="top" title=""
                                                            data-bs-original-title="more">
                                                            <div class="avatar-xs">
                                                                <div class="avatar-title rounded-circle">2+</div>
                                                            </div>
                                                        </b-link>
                                                    </div>
                                                    <small class="mb-0 text-muted">Yesterday</small>
                                                </div>
                                            </div>
                                            <div class="acitivity-item py-3 d-flex">
                                                <div class="flex-shrink-0">
                                                    <img src="@/assets/images/users/user.jpg" alt=""
                                                        class="avatar-xs rounded-circle acitivity-avatar" />
                                                </div>
                                                <div class="flex-grow-1 ms-3">
                                                    <h6 class="mb-1">
                                                        Natasha Carey
                                                        <b-badge variant="soft-success"
                                                            class="text-success align-middle">Completed</b-badge>
                                                    </h6>
                                                    <p class="text-muted mb-2">
                                                        Adding a new event with attachments
                                                    </p>
                                                    <b-row>
                                                        <b-col xxl="4">
                                                            <b-row class="border border-dashed gx-2 p-2 mb-2">
                                                                <b-col cols="4">
                                                                    <img src="@/assets/images/small/img-2.jpg" alt=""
                                                                        class="img-fluid rounded" />
                                                                </b-col>
                                                                <b-col cols="4">
                                                                    <img src="@/assets/images/small/img-3.jpg" alt=""
                                                                        class="img-fluid rounded" />
                                                                </b-col>
                                                                <b-col cols="4">
                                                                    <img src="@/assets/images/small/img-4.jpg" alt=""
                                                                        class="img-fluid rounded" />
                                                                </b-col>
                                                            </b-row>
                                                        </b-col>
                                                    </b-row>
                                                    <small class="mb-0 text-muted">25 Nov</small>
                                                </div>
                                            </div>
                                            <div class="acitivity-item py-3 d-flex">
                                                <div class="flex-shrink-0">
                                                    <img src="@/assets/images/users/user.jpg" alt=""
                                                        class="avatar-xs rounded-circle acitivity-avatar" />
                                                </div>
                                                <div class="flex-grow-1 ms-3">
                                                    <h6 class="mb-1">Bethany Johnson</h6>
                                                    <p class="text-muted mb-2">
                                                        added a new member to velzon dashboard
                                                    </p>
                                                    <small class="mb-0 text-muted">19 Nov</small>
                                                </div>
                                            </div>
                                            <div class="acitivity-item py-3 d-flex">
                                                <div class="flex-shrink-0">
                                                    <div class="avatar-xs acitivity-avatar">
                                                        <div class="avatar-title rounded-circle bg-soft-danger text-danger">
                                                            <i class="ri-shopping-bag-line"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="flex-grow-1 ms-3">
                                                    <h6 class="mb-1">
                                                        Your order is placed
                                                        <b-badge variant="soft-danger"
                                                            class="text-danger align-middle ms-1">Out of Delivery
                                                        </b-badge>
                                                    </h6>
                                                    <p class="text-muted mb-2">
                                                        These customers can rest assured their order has been
                                                        placed.
                                                    </p>
                                                    <small class="mb-0 text-muted">16 Nov</small>
                                                </div>
                                            </div>
                                            <div class="acitivity-item py-3 d-flex">
                                                <div class="flex-shrink-0">
                                                    <img src="@/assets/images/users/user.jpg" alt=""
                                                        class="avatar-xs rounded-circle acitivity-avatar" />
                                                </div>
                                                <div class="flex-grow-1 ms-3">
                                                    <h6 class="mb-1">Lewis Pratt</h6>
                                                    <p class="text-muted mb-2">
                                                        They all have something to say beyond the words on the
                                                        page. They can come across as casual or neutral,
                                                        exotic or graphic.
                                                    </p>
                                                    <small class="mb-0 text-muted">22 Oct</small>
                                                </div>
                                            </div>
                                            <div class="acitivity-item py-3 d-flex">
                                                <div class="flex-shrink-0">
                                                    <div class="avatar-xs acitivity-avatar">
                                                        <div class="avatar-title rounded-circle bg-soft-info text-info">
                                                            <i class="ri-line-chart-line"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="flex-grow-1 ms-3">
                                                    <h6 class="mb-1">Monthly sales report</h6>
                                                    <p class="text-muted mb-2">
                                                        <span class="text-danger">2 days left</span>
                                                        notification to submit the monthly sales report.
                                                        <b-link href="javascript:void(0);"
                                                            class="link-warning text-decoration-underline">Reports
                                                            Builder
                                                        </b-link>
                                                    </p>
                                                    <small class="mb-0 text-muted">15 Oct</small>
                                                </div>
                                            </div>
                                            <div class="acitivity-item d-flex">
                                                <div class="flex-shrink-0">
                                                    <img src="@/assets/images/users/user.jpg" alt=""
                                                        class="avatar-xs rounded-circle acitivity-avatar" />
                                                </div>
                                                <div class="flex-grow-1 ms-3">
                                                    <h6 class="mb-1">
                                                        New ticket received
                                                        <b-badge variant="soft-success"
                                                            class="text-success align-middle">Completed</b-badge>
                                                    </h6>
                                                    <p class="text-muted mb-2">
                                                        User
                                                        <span class="text-secondary">Erica245</span> submitted
                                                        a ticket.
                                                    </p>
                                                    <small class="mb-0 text-muted">26 Aug</small>
                                                </div>
                                            </div>
                                        </div> -->
                  </b-card-body>
                </b-card>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </Layout>
</template>
