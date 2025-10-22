<script>
import { inject } from "vue";
import Select from "@/base/components/select/Select.vue";
import { useFetch, usePost } from "@/helpers/api/api";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import { getVisualDataFromAttr } from "@/helpers/utils/tableList.js";
import { errorToast, successToast } from "@/helpers/api/toastStyle";
import Modal from "@/base/components/dtwinUI/Modal.vue";

// import BlockUI from "primevue/blockui";

export default {
  name: "ManageAssignTask",
  props: {
    selectedCandidates: {
      default: [],
    },
  },
  setup() {
    const manage_data = inject("manage-data");
    return {
      manage_data,
    };
  },
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
      showModal: false,
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
    Select,
    Modal,
    // BlockUI,
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
      console.log("handleSubmitAssignTask", "ÂCC")  ;
      this.onsubmit = true;
      try {
        let selectedCandidates = this.selectedCandidates.map((item) => item.id);
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
        this.showModal = false;
        this.manage_data.handleCallApi()
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
  <!-- <BlockUI :blocked="onsubmit" fullScreen> </BlockUI> -->
  <button
    @click="showModal = !showModal"
    class="btn btn-info btn-icon align-items-center"
  >
    <i class="ri-user-shared-line fs-16"></i>
  </button>
  <Modal
    hideFooter
    :id="`manage-assign-task`"
    v-model="showModal"
    :title="`Chia số `"
    cancelVariant="light"
  >
    <form action="javascript:void(0);">
      <div v-if="onsubmit">
        <div
          class="w-100 h-100 d-flex justify-content-center align-items-center"
        >
          <span class="spinner-grow flex-shrink-0" role="status"> </span>
          <span>Đang tiến hành chia số, vui lòng đợi!</span>
        </div>
      </div>
      <b-row class="g-0 m-2" v-else>
        <b-col lg="12 mt-3 d-flex justify-content-center align-items-center">
          <Select
            class="w-100"
            defaultValueLabel="Người chăm sóc"
            isCloseOnSelect="true"
            :localData="departmentMembers"
            searchField="str"
            labelField="str"
            style="min-width: 300px"
            @change-data="(data) => (selectedUser = data)"
          ></Select>
        </b-col>
        <div class="hstack gap-2 justify-content-end ml-auto mt-3">
          <b-button type="button" variant="light" @click="showModal = false">
            Đóng</b-button
          >
          <b-button
            type="button"
            variant="primary"
            @click="handleSubmitAssignTask"
            >Chia số</b-button
          >
        </div>
      </b-row>
    </form>
  </Modal>
</template>
