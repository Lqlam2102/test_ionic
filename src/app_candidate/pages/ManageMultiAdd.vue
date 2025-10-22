<template>
  <Layout
    :address="{ title: 'QUẢN LÝ ỨNG VIÊN / THÊM NHANH' }"
    chooseMenu="ban-do"
  >
    <div class="chat-wrapper gap-xl-1 mx-n4 p-1 h-100 d-flex flex-column">
      <div
        class="card mb-0 flex-grow-1 position-relative p-3"
        style="overflow: hidden auto"
      >
        <button
          type="button"
          :disabled="onSubmit || !formStructs.length"
          class="btn btn-primary d-flex align-items-center justify-content-center mb-3"
          @click="pushData"
        >
          <i class="ri-save-line"></i>
          &nbsp; Thêm ứng viên
        </button>
        <template v-if="!onSubmit">
          <FormOffcanvasBody
            :formStructures="defaultGeneralStruct"
            ref="formGeneral"
          ></FormOffcanvasBody>
          <div v-for="(form, index) in formStructs" :key="index">
            <FormOffcanvasBody
              :formStructures="form"
              ref="formBody"
            ></FormOffcanvasBody>

            <div class="d-flex w-100 justify-content-end mb-2">
              <button
                type="button"
                @click="removeStruct(index)"
                class="btn btn-danger btn-sm waves-effect waves-light d-flex align-items-center justify-content-center"
              >
                <i class="ri-delete-bin-line"></i>
                &nbsp;Xóa
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            class="w-100 h-100 d-flex justify-content-center align-items-center"
          >
            <span class="spinner-grow flex-shrink-0" role="status"> </span>
            <span>Đang tiến hành thêm ứng viên, vui lòng đợi!</span>
          </div>
        </template>
        <div>
          <button
            type="button"
            :disabled="onSubmit"
            @click="addStruct"
            class="btn btn-outline-primary btn-sm waves-effect waves-light d-flex align-items-center justify-content-center"
          >
            <i class="ri-add-line"></i>
            &nbsp;Thêm Form
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>
<script>
import Layout from "@/app_manage_dynamic_api/layout/main.vue";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import { usePost } from "@/helpers/api/api";
import FormOffcanvasBody from "@/base/components/form/builder/FormOffcanvasBody.vue";
import { errorToast, successToast } from "@/helpers/api/toastStyle.js";
export default {
  name: "ManageMultiAdd",
  data() {
    return {
      candidateDataAPI: API_SERVER_URL + "/candidate",
      candidatePreloadAPI: API_SERVER_URL + "/candidate/preload",
      defaultGeneralStruct: [
        {
          id: "form-default-general-struct",
          title: "THÔNG TIN CHUNG",
          conditions: [],
          fields: [
            {
              col: 6,
              require: false,
              search_field: ["name", "customer__name"],
              label_field: "str",
              name: "Chọn chiến dịch",
              field: "campaign",
              data_type: "foreign_key",
              form_type: "select",
              multiple: false,
              source: API_SERVER_URL + "/campaign/",
              init_data: [],
              value: null,
              placeholder: "",
              disable: false,
              hidden: false,
              gallery: null,
              show_icon: false,
              icon_field: "name",
              show_label: true,
              preload: "",
              post_link: "",
              del_link: "",
              depend: "",
              min_time: "",
              max_time: "",
              export_api: false,
              data_api: "",
              data_preload: "",
              editable_fields: false,
              record_edit_api: false,
              record_validation: false,
              help_text: "",
              documents: [],
              maps: [],
            },
            {
              col: 6,
              require: false,
              search_field: ["str"],
              label_field: "name",
              name: "Phòng ban chăm sóc",
              field: "department",
              data_type: "foreign_key",
              form_type: "tree-select",
              multiple: false,
              source:
                API_SERVER_URL +
                `/organization/${process.env.VUE_APP_ID_ORGANIZATION}/department/?all`,
              value: {},
              placeholder: "",
              disable: false,
              hidden: false,
              gallery: null,
              show_icon: false,
              icon_field: "name",
              show_label: true,
              preload: "",
              post_link: "",
              del_link: "",
              depend: "",
              min_time: "",
              max_time: "",
              export_api: false,
              data_api: "",
              data_preload: "",
              editable_fields: false,
              record_edit_api: false,
              record_validation: false,
              help_text: "",
              documents: [],
              maps: [],
            },
            {
              show_label: true,
              col: 6,
              require: false,
              search_field: "username",
              label_field: "str",
              name: "Nhân viên chăm sóc",
              field: "caregiver",
              data_type: "foreign_key",
              form_type: "select",
              multiple: false,
              source: API_SERVER_URL + "/user/",
              value: null,
            },
            {
              show_label: true,
              col: 6,
              require: false,
              search_field: "username",
              label_field: "str",
              name: "Nguồn số (mặc định là người thêm)",
              field: "introducer",
              data_type: "foreign_key",
              form_type: "select",
              multiple: false,
              source: API_SERVER_URL + "/user/",
              placeholder: "Nguồn số",
              show_icon: false,
              icon_field: "name",
            },
          ],
        },
      ],
      defaultStruct: {
        id: "form-ung-vien-add-multi",
        title: "THÔNG TIN ỨNG VIÊN",
        conditions: [],
        fields: [
          {
            col: 6,
            require: true,
            search_field: "name",
            label_field: "name",
            name: "Họ và tên",
            field: "full_name",
            data_type: "string",
            form_type: "text",
            disable: false,
            show_label: true,
          },
          {
            col: 6,
            require: true,
            search_field: "name",
            label_field: "name",
            name: "Số điện thoại",
            field: "phone",
            data_type: "string",
            form_type: "text",
            disable: false,
            show_label: true,
          },
          {
            col: 6,
            require: false,
            search_field: ["name", "customer__name"],
            label_field: "str",
            name: "Chọn chiến dịch",
            field: "campaign",
            data_type: "foreign_key",
            form_type: "select",
            multiple: false,
            source: API_SERVER_URL + "/campaign/",
            init_data: [],
            value: null,
            placeholder: "",
            disable: false,
            hidden: false,
            gallery: null,
            show_icon: false,
            icon_field: "name",
            show_label: true,
            preload: "",
            post_link: "",
            del_link: "",
            depend: "",
            min_time: "",
            max_time: "",
            export_api: false,
            data_api: "",
            data_preload: "",
            editable_fields: false,
            record_edit_api: false,
            record_validation: false,
            help_text: "",
            documents: [],
            maps: [],
          },
          {
            col: 6,
            require: true,
            search_field: ["str"],
            label_field: "name",
            name: "Phòng ban chăm sóc",
            field: "department",
            data_type: "foreign_key",
            form_type: "tree-select",
            multiple: false,
            source:
              API_SERVER_URL +
              `/organization/${process.env.VUE_APP_ID_ORGANIZATION}/department/?all`,
            value: {},
            placeholder: "",
            disable: false,
            hidden: false,
            gallery: null,
            show_icon: false,
            icon_field: "name",
            show_label: true,
            preload: "",
            post_link: "",
            del_link: "",
            depend: "",
            min_time: "",
            max_time: "",
            export_api: false,
            data_api: "",
            data_preload: "",
            editable_fields: false,
            record_edit_api: false,
            record_validation: false,
            help_text: "",
            documents: [],
            maps: [],
          },
          {
            show_label: true,
            col: 6,
            require: false,
            search_field: "username",
            label_field: "str",
            name: "Nhân viên chăm sóc (mặc định là trưởng phòng ban chăm sóc)",
            field: "caregiver",
            data_type: "foreign_key",
            form_type: "select",
            multiple: false,
            source: API_SERVER_URL + "/user/",
            value: null,
          },
          {
            show_label: true,
            col: 6,
            require: false,
            search_field: "username",
            label_field: "str",
            name: "Nguồn số (mặc định là người thêm)",
            field: "introducer",
            data_type: "foreign_key",
            form_type: "select",
            multiple: false,
            source: API_SERVER_URL + "/user/",
            placeholder: "Nguồn số",
            show_icon: false,
            icon_field: "name",
          },
          {
            col: 12,
            require: false,
            name: "Mô tả ngắn",
            field: "description",
            data_type: "string",
            form_type: "textarea",
          },
        ],
      },
      formStructs: [],
      formData: [],
      onSubmit: false,
    };
  },
  computed: {
    departmentGeneralValue() {
      return this.defaultGeneralStruct[0].fields[1]?.value;
    },
  },
  components: {
    Layout,
    FormOffcanvasBody,
  },
  watch: {
    departmentValue(newVal) {
      // react to changes in department field value
      console.log(newVal);
    },
    defaultGeneralStruct: {
      handler(newVal) {
        const departmentField = newVal[0]?.fields?.find(
          (field) => field.field === "department"
        );
        const value = departmentField?.value;
        console.log(value);
        // Now use `value` to do whatever you need.
        if (value) {
          this.formStructs.map((form) => {
            const f = form[0];
            const fields = f.fields;
            const departmentField = fields.find(
              (field) => field.field === "department"
            );
            departmentField.require = false;
            return form;
          });
          const departmentField = this.defaultStruct.fields.find(
            (field) => field.field === "department"
          );
          departmentField.require = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    addStruct() {
      if (this.formStructs.length >= 10) {
        errorToast("Có thể thêm nhanh tối đa 10 ứng viên cùng lúc!");
        return;
      }
      this.defaultStruct.title =
        "THÔNG TIN ỨNG VIÊN " + (this.formStructs.length + 1);
      this.formStructs.push([JSON.parse(JSON.stringify(this.defaultStruct))]);
    },
    removeStruct(index) {
      this.formStructs.splice(index, 1);
    },
    assignGeneralData(obj, generalData) {
      const fitFields = ["department", "campaign", "caregiver", "introducer"];
      fitFields.forEach((key) => {
        if (!obj[key] && generalData[key]) {
          obj[key] = generalData[key];
        }
      });
      return obj;
    },
    buildData(generalData) {
      let passed = false;
      const jsonArray = this.$refs.formBody.map((ref, index) => {
        const data = ref.buildFormData(this.formStructs[index]);
        let obj = {};
        console.log(generalData);
        try {
          for (const [key, value] of data.entries()) {
            obj[key] = value;
          }
          obj = this.assignGeneralData(obj, generalData);

          passed = true;
          return obj;
        } catch {
          errorToast("Lỗi: " + this.formStructs[index][0].title);
        }
      });
      // this.formData = this.$refs.formBody.map((ref, index) =>
      //   ref.buildFormData(this.formStructs[index])
      // );
      if (!passed) return false;
      return jsonArray;
    },
    buildGeneralData() {
      const formData = this.$refs.formGeneral.buildFormData(
        this.defaultGeneralStruct
      );
      const obj = {};
      for (const [key, value] of formData.entries()) {
        obj[key] = value;
      }
      return obj;
    },
    async pushData() {
      this.onSubmit = true;
      try {
        const generalData = this.buildGeneralData();
        const data = this.buildData(generalData);
        if (!data) return;
        const postData = {
          candidates: data,
        };
        const resp = await usePost(
          "/candidate/multiple-add/",
          JSON.stringify(postData)
        );
        const jsonData = await resp.json();
        if (!resp.ok) {
          const errorData = await resp.json();
          const message = errorData.msg || "Đã xảy ra lỗi không xác định.";
          errorToast(message);
        }
        if (resp.status == 200) {
          successToast("Thêm thành công!");
          this.formStructs.length = 0;
        } else if (resp.status == 207) {
          const totalError = jsonData?.errors?.length;
          const keepIndexes = jsonData?.errors?.map((err) => err.index - 1);
          errorToast(
            `Lỗi xảy ra tại ${totalError}/${this.formStructs.length} ứng viên!`
          );
          jsonData.errors.forEach((err) => {
            errorToast(`${err?.full_name} - ${err.error}`);
          });
          console.log(keepIndexes);
          this.formStructs = this.formStructs.filter((_, index) => keepIndexes.includes(index));
        }
      } finally {
        this.onSubmit = false;
      }
    },
  },
  mounted() {
    this.formStructs.length = 0;
    this.addStruct();
  },
};
</script>
