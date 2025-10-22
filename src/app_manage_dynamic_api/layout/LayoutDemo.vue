<script setup>
import { inject, defineProps, ref } from "vue";
import ToolBar from "../components/toolbar/ToolBar.vue";
import PaginationUI from "../components/paging/PaginationUI.vue";

const manage_data = inject("manage-data");
const SOURCEAPI = inject("source-api");

const props = defineProps({
  toolbarId: {
    type: String,
    default: "add-user",
  },
  isCallApi: {
    type: Boolean,
    default: true,
  },
});
const quantityView = [
  { title: "10 /trang", value: 10 },
  { title: "25 /trang", value: 25 },
  { title: "50 /trang", value: 50 },
  { title: "100 /trang", value: 100 },
];
const quantityTitle = ref("10 /trang");

const handlechangeQuantity = (quantity) => {
  quantityTitle.value = quantity.title;
  dataMain.per_page = quantity.value;
  handleChangePagination(1);
};

const { data: dataMain, toolbar } = manage_data.getData();

if (props.isCallApi == true) {
  manage_data.handleCallApi(SOURCEAPI);
}

const handleChangePagination = (page) => {
  dataMain.current_page_number = page;
  manage_data.handleCallApi(SOURCEAPI);
};
const startDrag = (item, index, $e) => {
  $e.dataTransfer.setData("index", index);
};
const handleDrop = (item, index, $e) => {
  const indexDrag = $e.dataTransfer.getData("index");
  manage_data.swapAttribute(index, indexDrag);
};
</script>

<template>
  <div class="chat-wrapper gap-xl-1 mx-n4 p-1 h-100 d-flex flex-column">
    <ToolBar :toolbarId="props.toolbarId">
      <template #action>
        <slot name="toolbar-action" />
      </template>
    </ToolBar>

    <div
      class="card mb-0 flex-grow-1 position-relative"
      style="overflow-y: auto; overflow-x: hidden"
    >
      <template 
        v-if="!dataMain.loadedPreload">
        <div
          class="d-flex justify-content-center align-items-center w-100 h-100 mt-4"
        >
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </template>
      <div
        v-else
        class="card-body pt-2 h-100 container-fluid"
      >
        <div class="h-100 d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div
              v-if="dataMain?.total_objects > 0"
              class="dataTables_info d-flex align-items-center gap-3"
            >
              <span>
                Tổng: <b>{{ dataMain?.total_objects }}</b>
              </span>
              <div class="dropdown text-center">
                <span
                  class="align-items-center d-flex text-nowrap dropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="true"
                >
                  <div class="form-select">{{ quantityTitle }}</div>
                </span>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li
                    v-for="(quantity, indexQ) in quantityView"
                    :key="indexQ"
                    @click="handlechangeQuantity(quantity)"
                  >
                    <div class="dropdown-item">{{ quantity.title }}</div>
                  </li>
                </ul>
              </div>
            </div>
            <div></div>
            <div class="h-100 d-flex align-items-center gap-2">
              <button
                class="btn btn-outline-primary btn-icon waves-effect waves-light"
                type="button"
                v-for="(item, index) in toolbar.typeView"
                :key="index"
                :title="item.type"
                :class="{ 'text-bg-primary': item.active }"
                @click="manage_data.setViewType(index)"
              >
                <i :class="item.icon" class="fs-18"></i>
              </button>
              <div class="dropdown text-center">
                <button
                  class="btn btn-outline-primary btn-icon waves-effect waves-light"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="ri-settings-2-line fs-16"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end" @click.stop>
                  <li
                    v-for="(item, index) in manage_data.attribute"
                    :key="index"
                    @drop="($e) => handleDrop(item, index, $e)"
                    @dragstart="($e) => startDrag(item, index, $e)"
                    @dragover.prevent
                    @dragenter.prevent
                    draggable="true"
                    class="position-relative"
                  >
                    <div
                      class="d-flex align-items-center gap-2 cursor-pointer dropdown-item form-check form-switch px-2 ellipsis"
                    >
                      <input
                        class="form-check-input m-0"
                        role="switch"
                        type="checkbox"
                        v-model="item.show"
                      />
                      <span>{{ item.name }}</span>
                    </div>
                    <i class="ri-drag-drop-line fs-16 icon-drag"></i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="flex-grow-1 flex-1">
            <component :is="manage_data.getViewType().component">
              <template #btn-action>
                <slot name="btn-actions-field" />
              </template>
              <slot name="actions-field" />
            </component>
          </div>
          <div class="d-flex justify-content-between align-items-center pb-2">
            <div></div>
            <PaginationUI
              @change="handleChangePagination"
              :current-page="dataMain?.current_page_number"
              :page-size="dataMain?.total_pages"
            ></PaginationUI>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-drag {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  display: none;
}
li:hover .icon-drag {
  display: block;
}
</style>
