<script setup>
import { inject, defineProps, computed } from "vue";
import { getOffcanvas } from "../../common/useBoostrap.js";
import ButtonIcon from "../../../base/components/baseUI/ButtonIcon.vue";
import SearchDynamic from "../../helper/fillter/SearchDynamic.vue";
import AssignTask from "./AssignTask.vue";
import { Modal } from "bootstrap";

// Injecting the manage_data and no_add from the parent context FormManage.vue
const manage_data = inject("manage-data");
const noAdd = inject("no-add", false);

const { data: dataMain, toolbar } = manage_data.getData();
const props = defineProps({
  toolbarId: {
    type: String,
    default: "add-user",
  },
});
const handleClickDeleteMultiRecord = () => {
  manage_data.deleteMultiRecord(ArraySlected);
};
const addBtn = {
  name: "Thêm",
  icon: "mdi mdi-plus",
  handle: () => {
    const el = getOffcanvas(`offcanvas${props.toolbarId}`);
    el.show();
  },
};
const deleteBtn = {
  name: "Xoá",
  icon: "ri-delete-bin-fill",
  handle: handleClickDeleteMultiRecord,
};

const assignBtn = {
  name: "Phân công",
  icon: "ri-share-line",
  handle: () => {
    const el = document.getElementById("manage-assign-task");
    // Lấy instance nếu đã có, nếu chưa thì tạo mới
    const modal = Modal.getInstance(el) || new Modal(el);
    modal.show();
  },
};
const arrActionMobile = computed(() => [
  ...(noAdd ? [] : [addBtn]),

  // Thêm nút “Xoá” nếu đã chọn phần tử
  ...(ArraySlected.value.length
    ? [
        deleteBtn,
        // Thêm nút “Phân công” nếu feature bật
        ...(isActiveFeature("assign-work") ? [assignBtn] : []),
        ...(toolbar.actions.default || []),
      ]
    : []),
]);
const handleClickAcitonMobile = ($e, itemActionMB) => {
  itemActionMB.handle();
};

const hasSelectedFilter = computed(() => {
  // Chỉ để kiểm tra xem có tìm kiếm không phục vụ chỉnh sửa giao diện
  let checkSearched = toolbar.filters.params.some(
    (item) => item.selected === true
  );
  let checkField = toolbar.fieldFilter.some((item) => item.selected === true);

  return checkSearched || checkField;
});

const ArraySlected = computed(() => {
  return dataMain.results.filter((item) => item.checked);
});

const isActiveFeature = (featureId) => {
  return toolbar.features.find((feature) => feature?.id == featureId);
};
</script>

<template>
  <b-row class="">
    <b-col
      class="d-none d-xl-block"
      :xl="hasSelectedFilter ? '12' : '6'"
      :class="hasSelectedFilter ? '' : 'pe-xl-1'"
    >
      <b-card class="mb-0" no-body>
        <b-card-header style="padding: 0.5rem">
          <b-row>
            <b-col md="6" class="mb-0 d-flex align-items-center gap-2">
              <ButtonIcon
                v-if="!noAdd"
                name="Thêm"
                class-icon="mdi mdi-plus"
                data-bs-toggle="offcanvas"
                :data-bs-target="'#offcanvas' + props.toolbarId"
                :aria-controls="'#offcanvas' + props.toolbarId"
              />
              <template v-if="ArraySlected?.length">
                <div class="d-flex gap-2">
                  <button
                    :title="`Xoá ${ArraySlected?.length} mục đã chọn`"
                    class="btn btn-outline-danger btn-icon waves-effect waves-light"
                    type="button"
                    @click="handleClickDeleteMultiRecord"
                  >
                    <i class="ri-delete-bin-fill fs-16"></i>
                  </button>
                  <AssignTask
                    v-if="isActiveFeature('assign-work')"
                    :selectedCandidates="ArraySlected"
                  ></AssignTask>
                </div>
              </template>
              <button
                style="visibility: hidden"
                class="btn btn-icon waves-effect waves-light"
              >
                <i class="fs-16"></i>
              </button>
            </b-col>
            <b-col
              md="6"
              class="mb-0 d-flex justify-content-between align-items-center mt-xl-0"
            >
              <div></div>
              <div class="dropdown">
                <a
                  v-if="toolbar.actions.default?.length"
                  href="javascript:void(0);"
                  class="btn btn-success btn-label p-icon__toolbar"
                  data-bs-toggle="dropdown"
                  aria-expanded="true"
                >
                  <div class="d-flex">
                    <div class="flex-shrink-0">
                      <i class="las la-bolt label-icon align-middle fs-16"></i>
                    </div>
                    <div
                      class="flex-grow-1 text-nowrap d-none title__name-action"
                    >
                      Hành động
                    </div>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li
                        v-for="(actionDefault, indexAD) in toolbar.actions
                          .default"
                        :key="indexAD"
                        @click="actionDefault.handle"
                        v-show="actionDefault.show"
                      >
                        <div class="dropdown-item">
                          <i
                            :class="actionDefault.icon"
                            class="align-bottom me-2"
                          ></i>
                          {{ actionDefault.name }}
                        </div>
                      </li>
                      <slot name="action"></slot>
                    </ul>
                  </div>
                </a>
              </div>
            </b-col>
          </b-row>
        </b-card-header>
      </b-card>
    </b-col>
    <b-col
      :xl="hasSelectedFilter ? '12' : '6'"
      :class="hasSelectedFilter ? '' : 'ps-xl-0'"
    >
      <b-card class="mb-0" no-body>
        <b-card-header
          class="align-items-center d-flex"
          style="padding: 0.45rem"
        >
          <!-- Thay đổi phần tử input bằng SearchDynamic -->
          <SearchDynamic class="flex-1" v-model="toolbar.filters.search" />

          <div class="dropdown d-xl-none">
            <button
              class="dropdown btn btn-outline-danger btn-icon waves-effect waves-light ms-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="true"
            >
              <i class="ri-mist-line fs-18"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <div class="border-bottom-inset">
                <li
                  v-for="(itemActionMB, indexActionMB) in arrActionMobile"
                  :key="indexActionMB"
                  @click="($e) => handleClickAcitonMobile($e, itemActionMB)"
                >
                  <div class="dropdown-item dropdown">
                    <i :class="itemActionMB.icon" class="me-2 text-muted"></i>
                    {{ itemActionMB.name }}
                  </div>
                </li>
              </div>
            </ul>
          </div>
        </b-card-header>
      </b-card>
    </b-col>
  </b-row>
  <div
    class="row align-items-center py-1 bg-white mt-3 d-none"
    style="border: 1px solid #ccc; margin-left: 0px !important"
  >
    <b-col class="d-none" xl="2" v-if="toolbar.filters.params.length">
      <select class="form-select" v-model="toolbar.filters.paramSelected">
        <option
          v-for="(item, index) in toolbar.filters.params"
          :key="index"
          :value="item.params"
        >
          {{ item.name }}
        </option>
      </select>
    </b-col>
  </div>
</template>

<style scoped>
@media only screen and (max-width: 1800px) {
  .p-icon__toolbar {
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    height: calc(1rem + 1.5em + 2px);
    width: calc(1rem + 1.5em + 2px);
    padding: 0;
  }
}

@media only screen and (min-width: 1802px) {
  .title__name-action {
    display: block !important;
  }

  .toolbar__actions-right {
    justify-content: space-between !important;
  }
}
</style>
