<script>
import Skeleton from "primevue/skeleton";
import Layout from "@/app_manage_dynamic_api/layout/main.vue";
import Select from "@/base/components/select/Select.vue";
import { useFetch, usePost } from "@/helpers/api/api";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import { getVisualDataFromAttr } from "@/helpers/utils/tableList.js";
import { errorToast, successToast } from "@/helpers/api/toastStyle";
import PaginationUI from "@/app_manage_dynamic_api/components/paging/PaginationUI.vue";

export default {
  name: "ManageAssignTask",
  data() {
    return {
      candidateDataAPI: API_SERVER_URL + "/candidate",
      candidatePreloadAPI: API_SERVER_URL + "/candidate/preload",
      departmentMembersAPI:
        API_SERVER_URL + "/user/get-list-users-department?all",
      candidateData: {
        current_page_number: 1,
        total_pages: 1,
      },
      candidatePreload: [],
      departmentMembersObject: [],
      selectedUser: {},
      isFetchingCandidateData: false,
      isFetchingDepartmentMembers: false,
      isFetchingPreloadData: false,
      onsubmit: false,
    };
  },
  computed: {
    isLoading() {
      return (
        this.isFetchingCandidateData ||
        this.isFetchingDepartmentMembers ||
        this.isFetchingPreloadData
      );
    },
    data() {
      let result = this.candidateData.results ?? [];

      return result.map((item) => {
        return { ...item, select: false };
      });
    },
    departmentMembers() {
      let result = this.departmentMembersObject.results ?? [];

      return result;
    },
    listAttributes() {
      let attrs = this.candidatePreload?.attributes;
      if (attrs?.length) {
        attrs = attrs.filter((attr) => {
          return attr.show;
        });
      } else attrs = [];
      return attrs;
    },
  },
  components: {
    Layout,
    Select,
    Skeleton,
    PaginationUI,
  },
  async mounted() {
    this.fetchData();
  },
  methods: {
    async fetchCandidateData() {
      this.isFetchingCandidateData = true;
      try {
        await useFetch(
          this.candidateDataAPI +
            "?page=" +
            this.candidateData.current_page_number +
            "&per_page=10"
        )
          .then((data) => {
            this.candidateData = data;
          })
          .catch((error) => {
            console.error("Error fetching candidate data:", error);
          });
      } finally {
        this.isFetchingCandidateData = false;
      }
    },
    async fetchDepartmentMembers() {
      this.isFetchingDepartmentMembers = true;
      try {
        await useFetch(this.departmentMembersAPI)
          .then((data) => {
            this.departmentMembersObject = data;
          })
          .catch((error) => {
            console.error("Error fetching department members:", error);
          });
      } finally {
        this.isFetchingDepartmentMembers = false;
      }
    },
    async fetchPreloadData() {
      this.isFetchingPreloadData = true;
      try {
        await useFetch(this.candidatePreloadAPI)
          .then((data) => {
            this.candidatePreload = data;
          })
          .catch((error) => {
            console.error("Error fetching candidate preload data:", error);
          });
      } finally {
        this.isFetchingPreloadData = false;
      }
    },
    fetchData() {
      this.fetchCandidateData();
      this.fetchDepartmentMembers();
      this.fetchPreloadData();
    },
    getVisualDataFromAttr(attr, item) {
      return getVisualDataFromAttr(attr, item);
    },
    async handleSubmitAssignTask() {
      this.onsubmit = true;
      try {
        let selectedCandidates = this.data
          .filter((item) => item.select)
          .map((item) => item.id);
        if (selectedCandidates.length) {
          const formData = new FormData();
          formData.append("user_id", this.selectedUser.id);
          formData.append("candidate_ids", JSON.stringify(selectedCandidates));
          const resp = await usePost("/candidate/assign-work", formData);
          const respJson = await resp.json();
          if (resp.status == 400) {
            errorToast(respJson.msg);
            return;
          }
          successToast(respJson.msg);
          this.fetchCandidateData();
          this.selectedUser = {};
        }
      } catch (error) {
        errorToast("Có lỗi xảy ra, vui lòng thử lại sau!");
        console.error("Error submitting assign task:", error);
      } finally {
        this.onsubmit = false;
      }
    },
    handleChangePagination(page) {
      this.candidateData.current_page_number = page;
      this.fetchCandidateData();
    },
  },
};
</script>

<template>
  <Layout
    :address="{ title: 'QUẢN LÝ ỨNG VIÊN / CHIA SỐ' }"
    chooseMenu="ban-do"
  >
    <div class="chat-wrapper gap-xl-1 mx-n4 p-1 h-100 d-flex flex-column">
      <div
        class="card mb-0 flex-grow-1 position-relative p-3"
        style="overflow: hidden auto"
      >
        <template v-if="isLoading">
          <Skeleton width="50%" height="3rem" class="mb-3"></Skeleton>
          <b-row class="mb-3">
            <b-col lg="12" class="mb-4">
              <Skeleton width="100%" height="3rem"></Skeleton>
            </b-col>
            <b-col lg="12" class="mb-4">
              <Skeleton width="100%" height="2rem"></Skeleton>
            </b-col>
            <b-col lg="12" class="mb-4">
              <Skeleton width="100%" height="2rem"></Skeleton>
            </b-col>
            <b-col lg="12" class="mb-4">
              <Skeleton width="100%" height="2rem"></Skeleton>
            </b-col>
            <b-col lg="12" class="mb-4">
              <Skeleton width="100%" height="2rem"></Skeleton>
            </b-col>
            <b-col lg="12" class="mb-4">
              <Skeleton width="100%" height="2rem"></Skeleton>
            </b-col>
            <b-col lg="12" class="mb-4">
              <Skeleton width="100%" height="2rem"></Skeleton>
            </b-col>
            <b-col lg="12" class="mb-4">
              <Skeleton width="100%" height="2rem"></Skeleton>
            </b-col>
            <b-col lg="12" class="mb-4">
              <Skeleton width="100%" height="2rem"></Skeleton>
            </b-col>
          </b-row>
        </template>
        <template v-else-if="onsubmit">
          <div
            class="w-100 h-100 d-flex justify-content-center align-items-center"
          >
            <span class="spinner-grow flex-shrink-0" role="status">
            </span>
            <span>Đang tiến hành chia số, vui lòng đợi!</span>
          </div>
        </template>
        <template v-else>
          <div class="w-100 d-flex justify-content-start mb-3">
            <Select
              defaultValueLabel="Người chăm sóc"
              isCloseOnSelect="true"
              :localData="departmentMembers"
              searchField="str"
              labelField="str"
              style="min-width: 300px"
              @change-data="(data) => (selectedUser = data)"
            ></Select>
            <button
              class="btn btn-primary ms-2"
              type="button"
              @click="handleSubmitAssignTask"
            >
              <i class="fa-solid fa-plus"></i>
              <span class="ms-1">Chia số</span>
            </button>
          </div>
          <table class="table table-striped">
            <thead>
              <tr>
                <th style="width: 45px">Chọn</th>
                <th
                  class="text-center"
                  v-for="(attr, index) in listAttributes"
                  :key="index"
                >
                  {{ attr.name }}
                </th>
              </tr>
            </thead>
            <tbody class="position-relative">
              <tr
                v-for="(record, index) in data"
                :key="index"
                class="form__user-data"
              >
                <td class="text-center">
                  <input
                    type="checkbox"
                    class="cursor-pointer"
                    v-model="record.select"
                    :id="record.id"
                  />
                </td>
                <td
                  v-for="(attr, index) in listAttributes"
                  :key="index"
                  class="text-center"
                >
                  {{ getVisualDataFromAttr(attr, record) }}
                </td>
              </tr>
            </tbody>
          </table>
          <PaginationUI
            @change="handleChangePagination"
            :current-page="candidateData.current_page_number"
            :page-size="candidateData.total_pages"
          ></PaginationUI>
        </template>
      </div>
    </div>
  </Layout>
</template>
