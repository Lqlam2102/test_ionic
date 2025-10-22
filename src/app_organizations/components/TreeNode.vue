<script setup>
import get from "lodash/get";
import Swal from "sweetalert2";
import { defineProps, ref, computed, inject } from "vue";
import TypeTemplateVIew from "../../app_manage_dynamic_api/components/type_view/TypeTemplateVIew.vue";
import API from "../../app_manage_dynamic_api/helper/api/useAxios";
import { successToast } from "../../helpers/api/toastStyle";

const props = defineProps({
  node: {
    type: Object,
  },
  attributes: {},
  formOffcanvas: {},
});

const isShow = ref(false);
const reloadData = inject("reload-department");

const countSpace = computed(() => {
  if (!props.node?.tree_path) return 0;
  const codes = props.node?.tree_path.split("/").filter((code) => code);
  return codes.length - 1;
});

const handleClickDelete = async () => {
  const result = await Swal.fire({
    title: "Bạn có muốn xoá không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Không",
  });
  if (!result.isConfirmed) {
    return;
  }
  API()
    .remove(`department/${props.node?.id}/`)
    .then(() => {
      reloadData();
    });
};

const handleCLickrecordTreeNode = (mode) => {
  if (!props.node?.id) return;
  switch (mode) {
    case "view":
      props.formOffcanvas.handleClickView(props.node?.id);
      break;
    case "update":
      props.formOffcanvas.handleClickEdit(props.node?.id);
      break;
    default:
      return;
  }
};

const handleClickChangeIsActive = async () => {
  const result = await Swal.fire({
    title: `Bạn có muốn ${
      props.node?.is_active ? "tắt" : "mở"
    } khoá phòng ban ${props.node?.name} không?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Không",
  });
  if (!result.isConfirmed) {
    return;
  }
  API()
    .patch(`department/${props.node?.id}/`, {
      is_active: !props.node?.is_active,
    })
    .then(() => {
      successToast(
        `Đã ${props.node?.is_active ? "tắt" : "mở"} khoá phòng ban ${
          props.node?.name
        }`
      );
      reloadData();
    });
};
</script>

<template>
  <tr class="hover-bg-light">
    <template
      v-for="(attributeItem, attributeIndex) in props.attributes"
      :key="`attr-${attributeIndex}`"
    >
      <td
        v-if="attributeItem.path == 'name'"
        :key="`name-${attributeIndex}`"
        @click="isShow = !isShow"
        class="d-flex align-items-center text-nowap gap-2 ellipsis"
      >
        <div
          class="px-2"
          v-for="space in countSpace"
          :key="`space-${space}`"
        ></div>

        <template v-if="Object.keys(props.node?.children).length">
          <i v-if="isShow" class="fs-16 ri-folder-reduce-fill text-muted"></i>
          <i v-else class="fs-16 ri-folder-add-fill text-muted"></i>
        </template>
        <i v-else class="ri-folder-line fs-16 text-muted"></i>

        {{ props.node?.name ?? "name" }}
      </td>
      <td
        class="hover-text-primary hover-text-underline ellipsis"
        :key="`attr-${attributeIndex}`"
        v-else-if="attributeItem.show"
        :title="get(props.node, attributeItem.key, '')"
      >
        <TypeTemplateVIew
          :type="attributeItem.path"
          :value="get(props.node, attributeItem.path, '')"
        ></TypeTemplateVIew>
      </td>
    </template>

    <td>
      <div class="dropdown text-center">
        <button
          class="btn btn-soft-secondary btn-sm dropdown"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="mdi mdi-dots-vertical"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasview"
            aria-controls="offcanvasview"
            @click="handleCLickrecordTreeNode('view')"
          >
            <div class="dropdown-item">
              <i class="ri-eye-fill align-bottom me-2 text-muted"></i>
              Xem chi tiết
            </div>
          </li>
          <li
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasupdate"
            aria-controls="offcanvasupdate"
            @click="handleCLickrecordTreeNode('update')"
          >
            <div class="dropdown-item">
              <i class="ri-pencil-fill align-bottom me-2 text-muted"></i>
              Chỉnh sửa
            </div>
          </li>
          <li>
            <div class="dropdown-item" @click="handleClickChangeIsActive">
              <i class="ri-lock-line align-bottom me-2 text-muted"></i>
              {{ props.node?.is_active ? "Khóa" : "Mở khóa" }}
            </div>
          </li>
          <li @click="handleClickDelete">
            <div class="dropdown-item text-danger">
              <i class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
              Xóa
            </div>
          </li>
        </ul>
      </div>
    </td>
  </tr>
  <template v-if="isShow">
    <TreeNode
      style="margin-left: 20px"
      v-for="(child, key) in node.children"
      :key="key"
      :node="child"
      :attributes="props.attributes"
      :formOffcanvas="props.formOffcanvas"
    />
  </template>
</template>
