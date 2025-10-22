<template>
  <div ref="divToHide" :customID="id">
    <input
      type="text"
      class="form-control"
      :placeholder="placeholder"
      autocomplete="off"
      v-model="valueLabel"
      v-if="!multiSelect"
      :disabled="disable"
      :customID="id"
      @click="isShow = true"
      :class="{
        'is-invalid': !valueLabel && required,
        'is-invalid': multiSelectedData.lenght < 1 && required && multiSelect,
      }"
    />

    <MultiSelectVisual
      :customID="id"
      :data="multiSelectedData"
      :subLabelField="subLabelField"
      v-if="multiSelect"
      :labelField="labelField"
      @on-remove-node="removeElementMulti"
      @on-click-visual="isShow = true"
      :disable="disable"
    >
    </MultiSelectVisual>
    <div v-if="isShow" :customID="id" id="treeSelectArea">
      <SimpleBar style="max-height: 250px">
        <template v-if="localTreeData">
          <TreeNode
            :id="id"
            v-for="node in localTreeData"
            :key="node.id"
            :node="node"
            :loopField="loopField"
            :selectedData="selectedData"
            :multiSelectedData="multiSelectedData"
            :ignoreSelect="ignoreSelect"
            :subLabelField="subLabelField"
            :labelField="labelField"
            class="w-100"
            :customID="id"
            :multiSelect="multiSelect"
            :ignoreObject="ignoreObject"
            @click-node="emitNode"
          />
        </template>
        <template v-else> Không có dữ liệu nào! </template>
      </SimpleBar>
    </div>
  </div>
</template>
<style scoped>
#treeSelectArea {
  background-color: #fff;
  z-index: 1000;
  border: 1px solid;
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
}
</style>
<script>
import { SimpleBar } from "simplebar-vue3";
import TreeNode from "./TreeNode.vue";
import { uuidv4 } from "@/helpers/utils/uuid/uuid.js";
import MultiSelectVisual from "@/base/components/select/MultiSelectVisual.vue";
import {
  pushOrRemoveItemInList,
  removeItemFromList,
} from "@/base/components/select/multiSelectHandler.js";
import { isNullOrEmpty } from "@/helpers/utils/objectHandle.js";
import { buildStructure } from "@/helpers/utils/tree_structure.js";
import API from "@/app_manage_dynamic_api/helper/api/useAxios.js";

export default {
  name: "Tree",
  components: {
    TreeNode,
    SimpleBar,
    MultiSelectVisual,
  },
  data: () => {
    return {
      id: "",
      localTreeData: [], // Biến nội bộ để giữ dữ liệu cây
      selectedData: {},
      multiSelectedData: [],
      valueLabel: "",
      isShow: false,
      count: 0,
    };
  },
  props: {
    placeholder: {
      type: String,
      default: "Chọn mục…", // giá trị hiển thị khi chưa chọn gì
    },
    api: {
      type: String,
      default: "",
    },
    treeData: {
      required: true,
      default: [
        {
          id: null,
          name: "Dữ liệu trống",
        },
      ],
    },
    loopField: {
      type: String,
      default: "children",
    },
    labelField: {
      type: String,
      default: "name",
    },
    subLabelField: {
      type: String,
      default: "name_display",
    },
    ignoreSelect: {
      default: {},
    },
    defaultSelected: {
      default: {},
    },
    multiSelect: {
      type: Boolean,
      required: false,
      default: false,
    },
    disable: {
      type: Boolean,
      required: false,
      default: false,
    },
    ignoreObject: {
      type: Object,
      default: () => {
        return {
          id: "",
        };
      },
    },
    required: {
      type: Boolean,
      default: false,
    },
    convert: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.id = uuidv4();
    window.addEventListener("click", this.handleClickOutside);
    this.resetAll(); // Gọi hàm fetchTreeData khi component được mount
    if (this.api) {
      // Gọi API nếu có
      this.fetchTreeData();
    } else if (this.treeData.length > 0) {
      // Sử dụng dữ liệu tĩnh nếu API không được truyền
      this.localTreeData = this.convert
        ? buildStructure(this.treeData)
        : this.treeData;
    }
  },
  beforeUnmount() {
    window.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    handleClickOutside(event) {
      const customID = event.target.getAttribute("customID");
      if (customID != this.id) {
        this.isShow = false;
      }
    },
    getValueLabel(data) {
      if (!isNullOrEmpty(data)) {
        const valueLabel = data[this.labelField]
          ? data[this.labelField]
          : data[this.subLabelField];
        return valueLabel;
      } else {
        return "";
      }
    },
    onChangeData() {
      if (this.multiSelect) {
        this.$emit("on-selected", this.multiSelectedData);
      } else {
        this.$emit("on-selected", this.selectedData);
        this.valueLabel = this.getValueLabel(this.selectedData);
      }
    },
    emitNode(node) {
      this.selectedData = node;
      this.multiSelectedData = pushOrRemoveItemInList(
        this.multiSelectedData,
        node
      );
    },
    removeElementMulti(node) {
      const isRemoved = removeItemFromList(this.multiSelectedData, node);
      this.multiSelectedData = isRemoved.l;
    },
    resetAll() {
      if (!this.multiSelect) {
        if (
          JSON.stringify(this.selectedData) !==
          JSON.stringify(this.defaultSelected)
        ) {
          this.selectedData = { ...this.defaultSelected };
          this.onChangeData();
        }
      } else {
        if (
          JSON.stringify(this.multiSelectedData) !==
          JSON.stringify(this.defaultSelected)
        ) {
          this.multiSelectedData = this.defaultSelected;
          this.onChangeData();
        }
      }
    },
    async fetchTreeData() {
      try {
        const data = await API().call(this.api);
        console.log(data);

        this.localTreeData = this.convert
          ? buildStructure(data?.results)
          : data;
      } catch (error) {
        console.error("Error while fetching tree data:", error);
      }
    },
  },
  watch: {
    selectedData() {
      this.onChangeData();
    },
    multiSelectedData: {
      handler: function () {
        this.onChangeData();
      },
      deep: true,
    },
    defaultSelected: {
      handler: function (val, oldVal) {
        this.count += 1;

        if (val != oldVal) {
          this.resetAll();
        }
      },
    },
    treeData: {
      handler(newTreeData) {
        if (!this.api) {
          this.localTreeData = this.convert
            ? buildStructure(newTreeData)
            : newTreeData;
        }
        this.resetAll();
      },
      deep: true,
    },
    api: {
      handler(newApi) {
        if (newApi) {
          this.fetchTreeData();
        }
      },
    },
  },
};
</script>
