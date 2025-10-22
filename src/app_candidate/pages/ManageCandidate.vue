<script setup>
import { ref, provide, onMounted } from "vue";
import { useRoute } from "vue-router";
import { WS } from "@/helpers/utils/config_system";
import { getAccessToken } from "@/helpers/api/token";
import candidateUpdatedAudio from "@/assets/candidate_updated_audio.mp3";
const route = useRoute();
import FormManage from "@/base/components/form/builder/FormManage.vue";
import ContactHistory from "../component/ContactHistory.vue";
import { getOffcanvas } from "@/app_manage_dynamic_api/common/useBoostrap.js";
import { CallCenter } from "@/callcenter/utils/callcenter.js";

provide("handle-custom-event-table", [
  {
    type: "TABLEfull_name",
    handle: (item) => {
      // console.log(item);
      popupOffHistory(item.id);
    },
  },
]);

let CandidateDetails = ref({ id: "" });
const socket = ref(null);
const socketOpen = ref(false);

const formManage = ref(null);

let reloadTimeout = null; // Biến để giữ timeout
const notificationAudio = new Audio(candidateUpdatedAudio);

function connectWebSocket() {
  socket.value = new WebSocket(
    `${WS}/ws/candidate/?token=${getAccessToken().replace("Bearer ", "")}`
  );
  socket.value.onopen = () => {
    socketOpen.value = true;
  };

  socket.value.onclose = () => {
    console.log("WebSocket connection closed");
    socketOpen.value = false;
  };

  socket.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("WebSocket message received: ", data);

    if (data.reload) {
      // Nếu đã có timeout trước đó thì huỷ
      if (reloadTimeout) {
        clearTimeout(reloadTimeout);
      }

      // Debounce: chờ 2.5 giây kể từ lần cuối nhận được reload
      reloadTimeout = setTimeout(async () => {
        try {
          await nextTick();
          if (formManage.value) {
            formManage.value.handleReloadData();

            // Phát âm thanh sau khi reload
            notificationAudio.currentTime = 0;
            notificationAudio.play().catch((err) => {
              console.error("Audio play failed:", err);
            });
          }
          console.log("Reloading data...");
        } catch (error) {
          console.error("Error reloading data: ", error);
        } finally {
          reloadTimeout = null; // Cho phép debounce lại nếu cần
        }
      }, 2500); // đợi 2.5 giây kể từ lần cuối cùng
    }
  };

  socket.value.onerror = (event) => {
    console.error("WebSocket error: ", event);
  };
}

// Đây là đoạn chức năng cho có cuộc gọi tới
const popupOffHistory = (id) => {
  CandidateDetails.value.id = id;

  let offcanvas = getOffcanvas("offcanvascontact-history");
  offcanvas.show();
};

const handleClickViewContact = ($e) => {
  const temp = $e?.target?.offsetParent?.getAttribute("item");
  if (!temp) return;
  const value = JSON.parse(temp);
  CandidateDetails.value = { ...value };
};

const handleClickEdit = (candidate) => {
  if (formManage.value) {
    formManage.value.handleClickEdit(null, candidate?.id);
  }
};

import { watch, nextTick } from "vue";

onMounted(async () => {
  await nextTick();
  connectWebSocket();
});

watch(
  () => route.query.candidate_id,
  async (newId) => {
    if (newId) {
      CandidateDetails.value.id = newId;
      // Đợi DOM cập nhật xong mới gọi offcanvas
      await nextTick();
      const offcanvas = getOffcanvas("offcanvascontact-history");
      offcanvas.show();
    }
  },
  { immediate: true } // Gọi luôn khi component mounted
);

const handleClickCall = ($e) => {
  let temp = $e?.target?.offsetParent?.querySelector("ul.dropdown-menu"); // hoặc dùng class cụ thể hơn nếu có nhiều dropdown
  let temp1 =
    $e?.target?.offsetParent?.parentElement?.querySelector("ul.dropdown-menu");
  let itemValue = temp?.getAttribute("item");
  if (!itemValue) {
    itemValue = temp1?.getAttribute("item");
  }
  CandidateDetails.value = { ...JSON.parse(itemValue) };
  CallCenter.makeCall(
    CandidateDetails.value.phone,
    CandidateDetails.value.full_name
  );
  // if (!temp) return;
  // const value = JSON.parse(temp);
  // CandidateDetails.value = { ...value };
  // if (CandidateDetails.value?.id) {
  //   useFetch(`${API_SERVER_URL}/candidate/${CandidateDetails.value.id}`).then((resp) => {
  //     CallCenter.makeCall(resp.phone, resp.full_name);
  //   });
  // }
};
</script>

<template>
  <FormManage
    ref="formManage"
    title="ỨNG VIÊN"
    sourceApi="candidate"
    :externalFeatures="features"
  >
    <template v-slot:btn-actions-field>
      <button
        class="btn btn-sm btn-success btn-icon"
        @click="handleClickCall"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvascontact-history"
        aria-controls="offcanvascontact-history"
      >
        <i class="ri-phone-fill fs-20"></i>
      </button>
    </template>
    <li @click="handleClickViewContact">
      <div
        class="dropdown-item"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvascontact-history"
        aria-controls="offcanvascontact-history"
      >
        <i class="ri-line-chart-line align-bottom me-2 text-success"></i>
        Lịch sử liên hệ
      </div>
    </li>
  </FormManage>
  <ContactHistory
    :candidate="CandidateDetails"
    @handle-click-edit="(data) => handleClickEdit(data)"
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
    </template>
  </ContactHistory>
</template>
