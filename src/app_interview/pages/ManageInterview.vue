<script setup>
import { provide } from "vue";
import Swal from "sweetalert2";
import FormManage from "@/base/components/form/builder/FormManage.vue";
import API from "@/helpers/api/useAxios.js";

provide("handle-custom-event-table", [
  {
    type: "FIELDis_completed",
    handle: async ($e, item, formOff) => {
      console.log($e);
      const target = $e.target; // Phần tử được click

      // Kiểm tra xem có phải input type checkbox hay không
      if (target.tagName === "INPUT" && target.type === "checkbox") {
        // Logic khi checkbox được click (có thể xử lý ở đây)
        if (item.value) {
          setTimeout(() => {
            item.value = true;
          }, 200);
          return;
        }

        const result = await Swal.fire({
          title: "Đã hoàn thành buổi phỏng vấn?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Đồng ý",
          cancelButtonText: "Không",
        });
        if (!result.isConfirmed) {
          item.value = false;
          return;
        }
        await API().patch(`interview/${formOff.currentObjectId}/`, {
          is_completed: true,
        });
        formOff.manage_data.handleCallApi();
        Swal.fire(
          "Đã hoàn thành",
          `Bạn đã hoàn thành buổi phỏng vấn`,
          "success"
        );
      }
    },
  },
  {
    type: "TABLEcampaign.customer.str",
    handle: (item) => {
      // console.log(item);
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
]);
</script>

<template>
  <FormManage title="PHỎNG VẤN" sourceApi="interview">
    <!-- <li>
      <div class="dropdown-item">
        <i class="ri-line-chart-line align-bottom me-2 text-muted"></i>
        Quản lý chi tiết
      </div>
    </li> -->
  </FormManage>
</template>
