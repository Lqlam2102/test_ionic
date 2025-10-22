<script>
import { Offcanvas } from "bootstrap";
import FormManage from "@/base/components/form/builder/FormManage.vue";
import ContactHistory from "../component/ContactHistory.vue";
import { CallCenter } from "@/callcenter/utils/callcenter.js";
import { useFetch } from "@/helpers/api/api.js";
import { API_SERVER_URL } from "@/base/store/api/server_api";

export default {
  name: "ManageCandidate",
  components: {
    FormManage,
    ContactHistory,
  },
  setup() {

  },
  data() {
    return {
      CandidateDetails: { id: "" },
      styles: {},
      formManage: null,
      features: [
        {
          name: "Liên hệ",
          type: "button",
          actions: {
            click: (currentId) => {
              this.CandidateDetails = { id: currentId };
              useFetch(`${API_SERVER_URL}/candidate/${currentId}`).then((resp) => {
                console.log("CALL CANDIDATE", resp);
                CallCenter.makeCall(resp.phone, resp.full_name);
              });
            },
            open: (currentId) => {
              this.CandidateDetails = { id: currentId };
              this.openOffcanvas("offcanvascontact-history");
            },
            close: () => {
              this.closeOffcanvas("offcanvascontact-history");
            },
          },
          location: "actionsBar",
          shows: ["update"],
          class: "btn btn-success btn-icon waves-effect waves-light",
          icon: "ri-phone-fill",
        },
      ],
    };
  },
  methods: {
    handleClickViewContact($e) {
      const temp = $e.target.offsetParent.getAttribute("item");
      if (!temp) return;
      const value = JSON.parse(temp);
      this.CandidateDetails = { ...value };
    },
    isOffcanvasOpen(id) {
      const offcanvasElement = document.getElementById(id);
      return offcanvasElement?.classList.contains("show");
    },

    openOffcanvas(id) {
      const offcanvasElement = document.getElementById(id);
      if (!offcanvasElement) return;

      let offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
      if (!offcanvasInstance) {
        offcanvasInstance = new Offcanvas(offcanvasElement);
      }

      if (!this.isOffcanvasOpen(id)) {
        offcanvasInstance.show();
        this.styles = { right: "max(42vw, 320px)" };
      }
      this.toggleOffcanvas("offcanvasupdate");
    },
    closeOffcanvas(id) {
      const offcanvasElement = document.getElementById(id);
      if (!offcanvasElement) return;

      const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
        this.styles = { right: "0!important" };
      }
    },
    toggleOffcanvas(id) {
      if (this.isOffcanvasOpen(id)) {
        this.closeOffcanvas(id);
      } else {
        this.openOffcanvas(id);
      }
    },
    handleClickEdit(candidate) {
      if (this.formManage) {
        this.formManage.handleClickEdit(null, candidate?.id);
      }
    },
  },
  provide() {
    return {
      "handle-custom-event-table": [
        {
          type: "TABLEcode",
          handle: (item) => {
            const targetId = item.id;

            const ulElements = document.querySelectorAll("ul[item]");
            ulElements.forEach((ul) => {
              const itemValue = ul.getAttribute("item");
              if (itemValue) {
                try {
                  const itemObject = JSON.parse(itemValue);
                  if (itemObject.id === targetId) {
                    const iElement = ul.querySelector("i.ri-pencil-fill");
                    if (iElement) iElement.click();
                  }
                } catch (error) {
                  console.error("Không thể parse item:", itemValue, error);
                }
              }
            });
          },
        },
      ],
    };
  },
};
</script>

<template>
  <FormManage ref="formManage" title="ỨNG VIÊN" sourceApi="candidate" :externalFeatures="features">
    <li @click="handleClickViewContact">
      <div class="dropdown-item" data-bs-toggle="offcanvas" data-bs-target="#offcanvascontact-history"
        aria-controls="offcanvascontact-history">
        <i class="ri-line-chart-line align-bottom me-2 text-muted"></i>
        Lịch sử liên hệ
      </div>
    </li>
  </FormManage>
  <ContactHistory :candidate="CandidateDetails" :style="styles" @handle-click-edit="(data) => handleClickEdit(data)">
    <template #header>
      <button type="button" class="btn btn-warning btn-icon waves-effect waves-light" @click="handleClickEdit"
        data-bs-toggle="offcanvas" data-bs-target="#offcanvasupdate" aria-controls="offcanvasupdate">
        <i class="las la-edit"></i>
      </button>
    </template>
  </ContactHistory>
</template>
