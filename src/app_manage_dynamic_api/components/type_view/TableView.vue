<script setup>
import get from "lodash/get";
import debounce from "lodash/debounce";
import { inject, onMounted, ref, computed } from "vue";
import TypeTemplateVIew from "./TypeTemplateVIew.vue";
import ColumnFilter from "./ColumnFilter.vue";
import notMatchSearch from "@/base/components/search/notMatchSearch.vue";

const manage_data = inject("manage-data");
const arrHandleCustom = inject("handle-custom-event-table") ?? [];

const { data: dataMain, attribute } = manage_data.getData();
const searchFields = manage_data.getSearchFields();
let isResizing = false;

const handleClickSort = (att) => {
  if (!att.sort || isResizing) return;

  att.sort.active = true;
  att.sort.desc = !att.sort.desc;
  manage_data.handleCallApi();
};

const handleClickTrView = ($e) => {
  let parentElement = $e.target.parentElement;
  if (parentElement && parentElement.tagName === "TD") {
    parentElement = parentElement.parentElement;
  }
  if (!parentElement && !parentElement.tagName === "TR") return;
  const eyeIcon = parentElement.querySelector(".ri-eye-fill");
  if (eyeIcon) {
    eyeIcon.click();
  }
};
const handleClickTr = ($e, attribute, item) => {
  if (!arrHandleCustom.length) {
    handleClickTrView($e);
    return;
  }
  // Tìm phần tử trong mảng arrHandleCustom với điều kiện name === attribute.key
  const customHandler = arrHandleCustom
    .filter(
      (item) => typeof item.type === "string" && item.type.startsWith("TABLE")
    )
    .find((item) => item.type === `TABLE${attribute.key}`);

  // Nếu tìm thấy, gọi hàm handle từ item đó
  if (customHandler && typeof customHandler.handle == "function") {
    customHandler.handle(item);
    return;
  }
  // Nếu không tìm thấy, trả về handleClickTrView làm mặc định
  handleClickTrView($e);
};

const handleCloseColumnFilter = (item) => {
  delete item.searchValue;
  setColumnSearch();
};

const handleUpdateSearchValue = (item, value) => {
  item.searchValue = value;
  setColumnSearch();
};

// Tạo debounce một lần duy nhất
const debouncedCallApi = debounce(() => {
  manage_data.handleCallApi();
}, 300);

const setColumnSearch = () => {
  const columnFiltereds = [];
  //const results = []
  attribute.forEach((item) => {
    if ([undefined, null, ""].includes(item.searchValue)) return;
    columnFiltereds.push({ ...item });
  });
  columnFiltereds.map((column) => {
    const field = searchFields.find(
      (field) => field.params == column?.searchField
    );
    if (field?.is_force && column.searchValue?.id !== "") {
      // Xử lý trường hợp select
      column.isForce = true;
      column.searchValue = field?.extends[column.searchValue?.id];
    } else {
      column.searchOperater = getFilterOperater(
        field?.type,
        column.searchValue
      );
      column.searchValue = getFilterValue(column.searchValue, field?.type);
    }
    return column;
  });
  manage_data.setColumnFilter(columnFiltereds);
  debouncedCallApi();
};

const getFilterOperater = (fieldType, data) => {
  if (fieldType == "text") {
    return "unaccent_word_icontains";
  } else if (fieldType == "select") {
    return "exact";
  } else if (fieldType == "date" || fieldType == "datetime") {
    if (!data.includes(";")) return "date";
    return "range";
  } else return "icontains";
};

const getFilterValue = (data, fieldType) => {
  if (fieldType == "select") {
    return data["id"];
  } else {
    return data;
  }
};

onMounted(() => {
  var tables = document.getElementsByTagName("table");
  for (var i = 0; i < tables.length; i++) {
    resizableGrid(tables[i]);
  }

  function resizableGrid(table) {
    var row = table.getElementsByTagName("tr")[0],
      cols = row ? row.children : undefined;
    if (!cols) return;

    // table.style.overflow = "hidden";

    var tableHeight = table.offsetHeight;

    for (var i = 0; i < cols.length; i++) {
      var div = createDiv(tableHeight);
      cols[i].appendChild(div);
      cols[i].style.position = "relative";
      setListeners(div);
    }

    function setListeners(div) {
      var pageX, curCol, nxtCol, curColWidth, nxtColWidth;

      div.addEventListener("mousedown", function (e) {
        isResizing = true; // Bắt đầu kéo, đặt cờ là true
        curCol = e.target.parentElement;
        nxtCol = curCol.nextElementSibling;
        pageX = e.pageX;

        var padding = paddingDiff(curCol);

        curColWidth = curCol.offsetWidth - padding;
        if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
      });

      div.addEventListener("mouseover", function (e) {
        e.target.style.borderRight = "2px solid #9595af";
      });

      div.addEventListener("mouseout", function (e) {
        e.target.style.borderRight = "";
      });

      document.addEventListener("mousemove", function (e) {
        if (curCol) {
          var diffX = e.pageX - pageX;

          if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + "px";

          curCol.style.width = curColWidth + diffX + "px";
        }
      });

      document.addEventListener("mouseup", function () {
        setTimeout(() => {
          isResizing = false;
        }, 200);
        curCol = undefined;
        nxtCol = undefined;
        pageX = undefined;
        nxtColWidth = undefined;
        curColWidth = undefined;
      });
    }

    function createDiv(height) {
      var div = document.createElement("div");
      div.style.top = 0;
      div.style.right = 0;
      div.style.width = "5px";
      div.style.position = "absolute";
      div.style.cursor = "col-resize";
      div.style.userSelect = "none";
      div.style.height = height + "px";
      return div;
    }

    function paddingDiff(col) {
      if (getStyleVal(col, "box-sizing") == "border-box") {
        return 0;
      }

      var padLeft = getStyleVal(col, "padding-left");
      var padRight = getStyleVal(col, "padding-right");
      return parseInt(padLeft) + parseInt(padRight);
    }

    function getStyleVal(elm, css) {
      return window.getComputedStyle(elm, null).getPropertyValue(css);
    }
  }
});

const screenWidth = ref(window.innerWidth);
const computedClassTable = computed(() => {
  return screenWidth.value < 768 ? "w-auto" : "";
});

const getItemClass = (attribute, item) => {
  if (attribute.classes) {
    const classId = item[attribute.searchField]?.id;
    const val = attribute.classes[classId];
    if (typeof val == typeof []) {
      return val[0];
    }
    return val;
  }
};

const getRowClass = (item) => {
  let classes = "";
  attribute.find((attr) => {
    if (attr.classes) {
      const classId = item[attr.searchField]?.id;
      const val = attr.classes[classId];
      if (typeof val == typeof []) {
        classes = val[1];
        return val[1];
      }
    }
  });
  return classes;
};
</script>

<template>
  <div class="live-preview">
    <div class="table-responsive" style="min-height: 300px">
      <table
        class="table table-bordered align-middle table-nowrap"
        :class="computedClassTable"
      >
        <thead class="table-light">
          <tr>
            <th scope="col" style="width: 46px; max-width: 46px">
              <div class="form-check text-center">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="dataMain.checkedAll"
                  @change="manage_data.setCheckedAll()"
                />
              </div>
            </th>
            <template v-for="(item, index) in attribute" :key="index">
              <th
                v-if="item.show"
                class="position-relative"
                :class="{
                  'w-25': dataMain?.isLoading || !dataMain?.results?.length,
                }"
                scope="col"
              >
                <div
                  class="d-flex justify-content-center align-items-center gap-1"
                >
                  <ColumnFilter
                    :item="item"
                    @closeColumnFilter="handleCloseColumnFilter(item)"
                    @updateSearchValue="
                      (value) => handleUpdateSearchValue(item, value)
                    "
                  ></ColumnFilter>
                  <div
                    @click="handleClickSort(item)"
                    v-if="item.sort"
                    class="d-flex flex-column justify-content-center cursor-pointer"
                    style="top: 50%; right: 4px"
                  >
                    <i
                      v-if="!item.sort.active"
                      class="mdi mdi-arrow-up-down-bold"
                    ></i>
                    <i
                      v-else-if="!item.sort.desc"
                      class="ri-arrow-up-s-fill"
                    ></i>
                    <i
                      v-else-if="item.sort.desc"
                      class="ri-arrow-down-s-fill"
                    ></i>
                  </div>
                </div>
              </th>
            </template>
            <th
              class="text-center"
              :class="{
                'w-25': dataMain?.isLoading || !dataMain?.results?.length,
              }"
              scope="col"
              style="max-width: 125px"
            >
              <span class="d-none d-md-block">Hành động</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="dataMain?.results?.length">
            <tr
              class="hover-bg-light cursor-pointer"
              v-for="(item, index) in dataMain.results"
              :class="getRowClass(item)"
              :key="index"
            >
              <td>
                <div class="form-check text-center">
                  <input
                    class="form-check-input"
                    v-model="item.checked"
                    type="checkbox"
                  />
                </div>
              </td>
              <template v-for="(attributeItem, attributeIndex) in attribute">
                <td
                  class="hover-text-primary ellipsis"
                  :key="attributeIndex"
                  v-if="attributeItem.show"
                  :title="get(item, attributeItem.key, '')"
                  @click="($e) => handleClickTr($e, attributeItem, item)"
                >
                  <TypeTemplateVIew
                    :type="attributeItem.key"
                    :value="get(item, attributeItem.key, '')"
                    :customClass="getItemClass(attributeItem, item)"
                  ></TypeTemplateVIew>
                </td>
              </template>
              <td
                class="d-flex align-items-center justify-content-center gap-2"
              >
                <slot name="btn-action"></slot>
                <div class="dropdown text-center">
                  <button
                    class="btn btn-soft-secondary btn-sm dropdown"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="mdi mdi-dots-vertical"></i>
                  </button>
                  <ul
                    class="dropdown-menu dropdown-menu-end"
                    :item="JSON.stringify(item)"
                  >
                    <slot></slot>
                  </ul>
                </div>
              </td>
            </tr>
          </template>
          <template v-else-if="dataMain?.isLoading">
            <tr>
              <td :colspan="attribute.length">
                <div
                  class="d-flex justify-content-center align-items-center w-100 h-100 mt-4"
                >
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td :colspan="attribute.length + 2">
                <div class="d-flex align-items-center">
                  <notMatchSearch></notMatchSearch>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
table {
  table-layout: fixed;
}

.row-highlight {
  background-color: #f5f5e2;
}
</style>
