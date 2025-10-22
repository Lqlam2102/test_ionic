<script setup>
import {
  defineProps,
  defineExpose,
  provide,
  ref,
  useAttrs,
  computed,
  reactive,
} from "vue";
import classManageData from "@/app_manage_dynamic_api/hook/state/manage_data.js";
import Layout from "@/app_manage_dynamic_api/layout/main.vue";
import LayoutDemo from "@/app_manage_dynamic_api/layout/LayoutDemo.vue";
import FormOffcanvas from "./FormOffcanvas.vue";
import { BASE_URL } from "@/helpers/api/axiosHttp.js";
import {
  getPermissionApp,
  hasPermissionGroup,
} from "@/helpers/state/dataUser.js";
import { errorToast } from "@/helpers/api/toastStyle";
const PROXY = BASE_URL + "/api";

const address = {
  title: props.title,
  details: [{ name: "Quản lý " + props.title, to: "#" }],
};
const props = defineProps({
  slug: {
    type: String,
    default: "sipm-base",
  },
  title: {
    type: String,
    default: "Vui lòng nhập tiêu đề trang",
  },
  sourceApi: {
    type: String,
    default: "manage-subject/subject",
  },
  externalFeatures: {
    type: Array,
    default: () => [],
  },
  permission: {
    type: Object,
    default: () => getPermissionApp(),
  },
});
const attrs = useAttrs();

// Check xem có quyền không
const actionKeys = ["add", "view", "edit", "delete"];
const disabledMap = reactive(
  actionKeys.reduce((acc, key) => {
    acc[key] = computed(() => {
      const attrNoName = `no-${key}`;
      // Nếu có thuộc tính can- thì ưu tiên kiểm tra quyền
      // Kiểm tra xem thuộc tính có được cung cấp không
      const isDisabledByAttr = Object.prototype.hasOwnProperty.call(
        attrs,
        attrNoName
      );
      const hasPerm = hasPermissionGroup(`can_${key}`);
      return isDisabledByAttr || !hasPerm;
    });
    return acc;
  }, {})
);

actionKeys.forEach((key) => {
  provide(`no-${key}`, disabledMap[key]);
});

const manage_data = new classManageData(`${props.sourceApi}`);
const formUrl = PROXY + "/" + manage_data.CONSTPATH + "/form/";

provide("form-url", formUrl);
provide("manage-data", manage_data);
provide("source-api", props.sourceApi);
provide("permission-app", props.permission);

const handleClickDelete = ($event) => {
  if (!hasPermissionGroup("can_delete")) {
    errorToast("Bạn không có quyền xóa dữ liệu này");
    return;
  }
  const item = getValueItem($event);
  manage_data.handleDelete(item);
};

const handleClickUpToTop = ($event) => {
  if (!hasPermissionGroup("can_uptotop")) {
    errorToast("Bạn không có quyền đưa dữ liệu này lên đầu trang");
    return;
  }
  const item = getValueItem($event);
  manage_data.handleUpToTop(item);
};

const formOffcanvas = ref(null);

const handleClickDetail = ($event, id) => {
  if (id) {
    formOffcanvas.value.handleClickView(id);
    return;
  }
  const item = getValueItem($event);
  if (formOffcanvas.value) {
    formOffcanvas.value.handleClickView(item?.id);
  }
};

const handleClickEdit = ($event, id) => {
  if (id) {
    formOffcanvas.value.handleClickEdit(id);
    return;
  }
  const item = getValueItem($event);
  if (formOffcanvas.value) {
    formOffcanvas.value.handleClickEdit(item?.id);
    // props.externalFeatures.forEach((feature) => {
    //   if (feature?.shows) {
    //     if (feature?.shows?.includes("update")) {
    //       feature.actions.open(item?.id);
    //     }
    //   }
    // });
  }
};

const handleReloadData = () => {
  manage_data.handleCallApi();
};

const getValueItem = ($event) => {
  const target = $event.target.closest("ul");
  if (target) {
    const dataTarget = target.getAttribute("item");
    return JSON.parse(dataTarget);
  }
  return null;
};

defineExpose({
  handleClickEdit,
  handleReloadData,
});
</script>

<template>
  <Layout
    :address="address"
    :items="address.details"
    chooseMenu="ban-do"
    :slug="props.slug"
  >
    <LayoutDemo toolbarId="add">
      <template v-slot:btn-actions-field>
        <slot name="btn-actions-field" />
      </template>
      <template v-slot:actions-field>
        <slot />
        <li v-if="'up-to-top' in attrs">
          <div class="dropdown-item" @click="handleClickUpToTop">
            <i class="ri-star-line align-bottom me-2 text-warning"></i>
            Lên đầu trang
          </div>
        </li>
        <li v-if="!disabledMap.view">
          <div
            class="dropdown-item"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasview"
            @click="handleClickDetail"
            aria-controls="offcanvasview"
          >
            <i class="ri-eye-fill align-bottom me-2 text-info"></i>
            Xem chi tiết
          </div>
        </li>
        <li v-if="!disabledMap.edit">
          <div
            class="dropdown-item"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasupdate"
            @click="handleClickEdit"
            aria-controls="offcanvasupdate"
          >
            <i class="ri-pencil-fill align-bottom me-2 text-secondary"></i>
            Chỉnh sửa
          </div>
        </li>
        <li v-if="!disabledMap.delete">
          <div class="dropdown-item text-danger" @click="handleClickDelete">
            <i class="ri-delete-bin-fill align-bottom me-2 text-danger"></i>
            Xóa
          </div>
        </li>
      </template>
    </LayoutDemo>
    <FormOffcanvas ref="formOffcanvas" :externalFeatures="externalFeatures">
    </FormOffcanvas>
  </Layout>
</template>
