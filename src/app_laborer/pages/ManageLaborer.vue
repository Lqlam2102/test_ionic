<script setup>
import { ref, provide } from "vue";
import FormManage from "@/base/components/form/builder/FormManage.vue";
import DocumentCandidate from "../component/DocumentCandidate.vue";

const workerId = ref(null);

const handleClickViewDocument = ($e) => {
  const temp = $e?.target?.offsetParent?.getAttribute("item");
  if (!temp) return;
  const value = JSON.parse(temp);
  workerId.value = value?.id;
};

provide("handle-custom-event-table", [
  {
    type: "TABLEcandidate.full_name",
    handle: (item) => {
      const targetId = item.id;

      // Lấy danh sách tất cả các thẻ ul
      const ulElements = document.querySelectorAll("ul[item]");

      // Duyệt qua từng thẻ ul
      ulElements.forEach((ul) => {
        // Lấy giá trị thuộc tính item
        const itemValue = ul.getAttribute("item");
        if (itemValue) {
          try {
            // Parse giá trị item như JSON
            const itemObject = JSON.parse(itemValue);

            // Kiểm tra nếu item.id trùng với targetId
            if (itemObject.id === targetId) {
              const iElement = ul.querySelector("i.ri-line-chart-line");
              if (iElement) {
                workerId.value = targetId;
                iElement.click();
              }
            }
          } catch (error) {
            console.error("Không thể parse item:", itemValue, error);
          }
        }
      });
    },
  },
]);
</script>

<template>
  <FormManage title="NGƯỜI LAO ĐỘNG" sourceApi="worker" no-delete>
    <li @click="handleClickViewDocument">
      <div
        class="dropdown-item"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasdocument-candidate"
        aria-controls="offcanvasdocument-candidate"
      >
        <i class="ri-line-chart-line align-bottom me-2 text-muted"></i>
        Hồ sơ ứng viên
      </div>
    </li>
  </FormManage>
  <DocumentCandidate :workerId="workerId"></DocumentCandidate>
</template>
