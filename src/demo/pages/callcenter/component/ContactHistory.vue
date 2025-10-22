<template>
  <LayoutRecord title="Lịch sử liên hệ" id="contact-history" :style="props.style"
    :teleport="isOffcanvasUpdateOpen ? '#offcanvasupdate' : 'body'">
    <template #header>
      <button type="button" v-b-modal.create-contact-history class="btn btn-success btn-icon waves-effect waves-light">
        <i class="ri-phone-fill"></i>
      </button>
      <button type="button" class="btn btn-warning btn-icon waves-effect waves-light" @click="handleClickEdit"
        data-bs-toggle="offcanvas" data-bs-target="#offcanvasupdate" aria-controls="offcanvasupdate">
        <i class="las la-edit"></i>
      </button>

    </template>
    <template #body>
      <div v-if="candidates.isLoading" class="text-center">
        Đang tải dữ liệu...
      </div>
      <div v-else>
        <table class="table table-bordered a../../base/components/dtwinUI/Modal.vulign-middle table-nowrap">
          <thead class="table-light">
            <tr>
              <th scope="col" style="width: 46px">
                <div class="form-check text-center">
                  <input class="form-check-input" type="checkbox" v-model="checkedAll" @change="setCheckedAll" />
                </div>
              </th>
              <th v-for="(header, index) in headers" :key="index">
                {{ header }}
              </th>
              <!-- <th class="text-center" scope="col" style="max-width: 150px">
                Hành động
              </th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in candidates.results" :key="index">
              <td>
                <div class="form-check text-center">
                  <input class="form-check-input" v-model="item.checked" type="checkbox" />
                </div>
              </td>
              <td>{{ getTimeDateFromISO(item.contact_time) }}</td>
              <td>{{ item.contact_method }}</td>
              <td>{{ item.labor_status?.name }}</td>
              <td>{{ item.note }}</td>
              <!-- <td class="text-center">
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </LayoutRecord>
  <!-- Modal -->
  <Modal id="create-contact-history" title="Thêm lịch hẹn" okTitle="Thêm" cancelTitle="Huỷ"
    cancelVariant="light" no-close-on-backdrop @ok="handleOk">
    <form ref="formContact" @submit.prevent>
      <b-form-group label="Trạng thái lao động">
        <b-form-select v-model="formData.labor_status">
          <option value="0">Không liên hệ được</option>
          <option value="1">Không có nhu cầu</option>
          <option value="2">Không đủ yêu cầu</option>
          <option value="3">Có nhu cầu</option>
          <option value="4">Có lịch hẹn</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="Ngày hẹn" v-if="formData.labor_status == 4">
        <DateInput v-model="formData.appointment_date"></DateInput>
      </b-form-group>
      <b-form-group label="Phương thức liên lạc">
        <b-form-select v-model="formData.contact_method" :options="contactMethods"></b-form-select>
      </b-form-group>

      <b-form-group label="Ghi chú">
        <b-form-textarea v-model="formData.note" rows="3"></b-form-textarea>
      </b-form-group>
    </form>
  </Modal>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { defineProps, defineEmits } from "vue";
import API from "@/helpers/api/useAxios.js";
import LayoutRecord from "@/app_manage_dynamic_api/layout/record/LayoutRecord.vue";
import Modal from "@/base/components/dtwinUI/Modal.vue";
import DateInput from "@/base/components/date/date.vue";

const emits = defineEmits(["handle-click-edit"]);

const handleClickEdit = () => {
  emits("handle-click-edit", {
    id: props.candidate.id,
  });
}


const props = defineProps({
  candidate: {
    required: true,
  },
  style: {},
});
const candidates = ref({
  page_size: 0,
  total_objects: 1,
  total_pages: 1,
  current_page_number: 1,
  next: null,
  previous: null,
  results: [],
  isLoading: true,
});

const loadDataApi = () => {
  API()
    .get(`candidate/${props.candidate.id}/cantact-history/?all`)
    .then((response) => {
      candidates.value = { ...response };
      candidates.value.isLoading = false;
    })
    .catch(() => {
      candidates.value.isLoading = false;
    });
};

const checkedAll = ref(false);
const headers = ref([
  "Thời gian liên hệ",
  "Phương thức liên hệ",
  "Trạng thái",
  "Ghi chú",
]);

const setCheckedAll = () => {
  candidates.value.results.forEach((item) => {
    item.checked = checkedAll.value;
  });
};
const formData = ref({
  appointment_date: null,
  labor_status: 0,
  contact_method: "Số điện thoại",
  note: "",
});
const formContact = ref(null);

const contactMethods = ref(["Số điện thoại", "Email", "Zalo"]);

const handleOk = (_modal) => {
  formContact.value.checkValidity();
  API()
    .post(
      `candidate/${props.candidate.id}/cantact-history/`,
      formData.value,
      "Têm lịch hẹn thành công"
    )
    .then(() => {
      loadDataApi();
    });
  _modal.hide();
};
let offcanvasElement = null;

onMounted(() => {
  offcanvasElement = document.getElementById("offcanvasupdate"); // Access the DOM element
});

// Reactive computed property
const isOffcanvasUpdateOpen = computed(() => {
  return offcanvasElement?.classList.contains("show") || false;
});

watch(
  () => props.candidate.id,
  (newId) => {
    if (newId) {
      loadDataApi();
    }
  }
);
function getTimeDateFromISO(isoString) {
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes} ${day}/${month}/${year}`;
}
</script>
