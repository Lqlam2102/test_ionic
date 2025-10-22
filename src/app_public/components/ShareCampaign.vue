<script setup>
import { defineProps } from "vue";
import ButtonIcon from "@/base/components/baseUI/ButtonIcon.vue";
import { successToast } from "../../helpers/api/toastStyle";

const props = defineProps({
  campaign: {
    type: Object,
  },
});

const copyToClipboard = () => {
  // Sao chép URL vào clipboard
  navigator.clipboard
    .writeText(props.campaign.qr_code.path)
    .then(() => {
      successToast("Đã sao chép đường dẫn");
    })
    .catch(() => {
      alert("Không thể sao chép đường dẫn. Vui lòng thử lại.");
    });
};

function downloadQRCode() {
  const filename = `QR_ChienDic${props.campaign.name}.png`;
  downloadBase64Image(props.campaign.qr_code, filename);
}

// Hàm tải base64 thành file ảnh
function downloadBase64Image(base64Data, filename) {
  const link = document.createElement("a");
  link.href = base64Data;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <div>
    <div class="d-flex mb-3 align-items-center">
      <div class="flex-shrink-0">
        <img v-if="props.campaign?.customer?.logo"
          :src="props.campaign?.customer.logo"
          alt=""
          class="avatar-sm rounded-circle"
        />
        <img v-else
          src="@/assets/images/logo/metadatawin.png"
          alt=""
          class="avatar-sm rounded-circle"
        />
      </div>
      <div class="flex-grow-1 ms-2">
        <h5 class="card-title fs-14 mb-1">
          {{ props.campaign?.customer?.name ?? "Đối tác" }}
        </h5>
        <p class="text-muted fs-12 mb-0">
          {{ props.campaign?.customer?.str ?? "Đối tác" }}
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <img
          :src="props.campaign?.qr_code.base64"
          alt="QR chia sẻ chiến dịch"
          class="w-100"
        />
      </div>
      <div class="col-8">
        <div class="d-flex flex-column">
          <ButtonIcon
            name="Tải xuống ảnh QR code"
            class-icon="ri-download-2-fill"
            @click="downloadQRCode"
          />
          <span class="my-4">Hoặc chia sẻ đường dẫn tải ứng dụng</span>
          <div class="d-flex align-items-center justify-content-end gap-3">
            <div class="flex-1">
              <input
                type="text"
                class="form-control"
                :value="props.campaign.qr_code.path"
                disabled
              />
            </div>
            <i
              @click="copyToClipboard"
              class="ri-checkbox-multiple-blank-line fs-20 search-icon text-black-50 cursor-pointer hover-text-primary"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
