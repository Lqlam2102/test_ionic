<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import API from "@/helpers/api/useAxios.js";
import Layout from "@/app_manage_dynamic_api/layout/main.vue";

const route = useRoute();

const IDCAMPAIGN = route.params.id;
const qrCode = ref();

API()
  .get(`campaign/${IDCAMPAIGN}/share/`)
  .then((res) => {
    if (res) {
      qrCode.value = res;
    }
  });

function downloadQRCode() {
  const filename = "QR_ChienDich.png";
  downloadBase64Image(qrCode.value, filename);
}

// Hàm tải base64 thành file ảnh
function downloadBase64Image(base64Data = qrCode.value, filename) {
  const link = document.createElement("a");
  link.href = base64Data;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <Layout
    :address="{ title: 'Chiến dịch tuyển dụng / Hoạt động / Mã giới thiệu' }"
    chooseMenu="ban-do"
  >
    <div class="chat-wrapper gap-xl-1 mx-n4 p-1 h-100 d-flex flex-column">
      <div
        class="card mb-0 flex-grow-1 position-relative"
        style="overflow: hidden auto"
      >
        <div class="card-header d-flex justify-content-between mb-2">
          <div></div>
          <div class="h-100 d-flex align-items-center gap-2">
            <button
              type="button"
              title="Tải xuống hình ảnh QR chiến dịch"
              class="btn btn-outline-success btn-icon waves-effect waves-light"
              @click="downloadQRCode"
            >
              <i class="ri-download-2-fill"></i>
            </button>
          </div>
        </div>
        <div
          class="card-body container-fluid d-flex flex-column align-items-center justify-content-center"
        >
          <!-- Chú thích mã QR -->
          <span class="text-muted mb-2">Quét mã QR để chia sẻ chiến dịch</span>
          <img
            style="width: 250px; height: 250px"
            :src="qrCode"
            alt="QR Code"
          />
          <!-- Thêm mô tả chi tiết -->
          <p class="mt-3 col-5">
            Dùng ứng dụng quét mã QR trên điện thoại của bạn để truy cập nhanh
            vào chiến dịch này và chia sẻ với bạn bè. Đảm bảo mã QR rõ ràng và
            không bị che khuất khi quét.
          </p>
        </div>
      </div>
    </div>
  </Layout>
</template>
