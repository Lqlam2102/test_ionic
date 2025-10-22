<script setup>
import { BASE_URL } from "@/helpers/api/axiosHttp";
import Layout from "@/app_manage_dynamic_api/layout/main.vue";
import { computed, onMounted, provide, reactive, ref } from "vue";
import { swapArr } from "../../app_manage_dynamic_api/common/common.js";
import { buildTree, setupResizeTable } from "../common/setup_action.js";
import API from "../../app_manage_dynamic_api/helper/api/useAxios";
import ButtonIcon from "../../base/components/baseUI/ButtonIcon.vue";
import TreeViewDepartment from "../components/TreeViewDepartment.vue";
import TreeNode from "../components/TreeNode.vue";
import TableViewDepartment from "../components/TableViewDepartment.vue";
import { ID_ORGANIZATION } from "@/helpers/utils/config_system";
import { useFetch } from "../../helpers/api/api.js";
import FormOffcanvas from "../../base/components/form/builder/FormOffcanvas.vue";

const organization = ref([]);
const columns = ref([]);
const viewMode = ref("table");
const searchText = ref("");
const searchInput = ref("");

const formOffcanvas = ref(null);

const feCheck = reactive({
  isLoading: true,
  isMounted: false,
  isSearch: false,
});

const organizationShow = computed(() => {
  return organization.value.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
      item.department_head?.str
        .toLowerCase()
        .includes(searchText.value.toLowerCase())
  );
});
const tree = computed(() => {
  return buildTree(organizationShow.value);
});

API()
  .get("department/preload/")
  .then((data) => {
    if (data) {
      columns.value = data?.attributes ?? [];
    }
  });
const loadDataApi = () => {
  API()
    .get(`organization/${ID_ORGANIZATION}/department/?all`)
    .then((data) => {
      feCheck.isLoading = false;
      if (data?.results.length) {
        organization.value = data.results;
        if (!feCheck.isMounted) return;
        setupResizeTable();
      }
    });
};

provide("reload-department", loadDataApi);
provide("source-api", "department");
provide("form-url", `${BASE_URL}/api/department/form/`);
provide("manage-data", {
  handleCallApi: loadDataApi,
  handleDelete: () => {},
});

loadDataApi();
onMounted(() => {
  setTimeout(() => {
    document.querySelectorAll("form input").forEach((input) => {
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault(); // Ngăn chặn submit khi nhấn Enter
        }
      });
    });
  }, 300);
  feCheck.isMounted = true;
  if (feCheck.isLoading) return;
  setupResizeTable();
});

const startDrag = (item, index, $e) => {
  $e.dataTransfer.setData("index", index);
};
const handleDrop = (item, index, $e) => {
  const indexDrag = $e.dataTransfer.getData("index");
  swapArr(columns.value, index, indexDrag);
};

const enableSearch = () => {
  feCheck.isSearch = true;
  setTimeout(() => {
    searchInput.value.focus();
  }, 300);
};
const users = ref([]);
useFetch(`${BASE_URL}/api/user?all`).then((data) => {
  users.value = data?.results;
});
</script>

<template>
  <Layout :address="{ title: 'Cơ cấu tổ chức' }" chooseMenu="ban-do">
    <div class="chat-wrapper gap-xl-1 mx-n4 p-1 h-100 d-flex flex-column">
      <div
        class="card mb-0 flex-grow-1 position-relative"
        style="overflow: hidden auto"
      >
        <div class="card-body container-fluid">
          <div
            class="d-flex justify-content-between align-items-center mb-2 gap-2"
          >
            <div class="flex-1">
              <div class="align-items-center d-flex gap-2">
                <ButtonIcon
                  name="Thêm"
                  classIcon="mdi mdi-plus label-icon align-middle fs-16"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasadd"
                  aria-controls="offcanvasadd"
                ></ButtonIcon>
                <div class="flex-1 d-flex gap-2">
                  <input
                    v-if="feCheck.isSearch"
                    class="form-control"
                    placeholder="Tìm kiếm đơn vị, phòng ban..."
                    type="text"
                    v-model="searchText"
                    ref="searchInput"
                  />
                  <button
                    v-else
                    class="btn btn-outline-primary btn-icon waves-effect waves-light"
                    title="Search"
                    @click="enableSearch"
                  >
                    <i class="ri-search-line fs-18"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="h-100 d-flex align-items-center gap-2">
              <button
                @click="viewMode = 'card'"
                :class="{
                  'btn-outline-primary': viewMode !== 'card',
                  'btn-primary': viewMode === 'card',
                }"
                class="btn btn-icon waves-effect waves-light"
                title="Tree view"
              >
                <i class="ri-git-merge-line fs-18"></i>
              </button>
              <button
                @click="viewMode = 'table'"
                :class="{
                  'btn-outline-primary': viewMode !== 'table',
                  'btn-primary': viewMode === 'table',
                }"
                class="btn btn-icon waves-effect waves-light"
                title="table"
              >
                <i class="las la-th-list fs-18"></i>
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
                    v-for="(item, index) in columns"
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
                    <i
                      title="Kéo để thay đổi vị trí"
                      class="ri-drag-drop-line fs-16 icon-drag"
                    ></i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            v-if="feCheck.isLoading"
            class="d-flex justify-content-center my-3"
          >
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else class="live-preview" style="min-height: 500px">
            <div
              v-if="organizationShow.length"
              class="table-responsive"
              style="min-height: 300px"
            >
              <TableViewDepartment
                v-if="viewMode === 'table'"
                :tree="tree"
                :columns="columns"
              >
                <TreeNode
                  v-for="(node, key) in tree"
                  :key="key"
                  :node="node"
                  :attributes="columns"
                  :formOffcanvas="formOffcanvas"
                />
              </TableViewDepartment>

              <TreeViewDepartment
                v-if="viewMode === 'card'"
                :tree="tree"
              ></TreeViewDepartment>
            </div>
            <div v-else>Không có phòng ban nào!</div>
          </div>
        </div>
      </div>
    </div>
  </Layout>

  <FormOffcanvas ref="formOffcanvas"> </FormOffcanvas>
</template>

<style scoped>
table {
  table-layout: fixed;
}

td,
th {
  overflow: hidden;
  white-space: nowrap;
  -moz-text-overflow: ellipsis;
  -ms-text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}

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
