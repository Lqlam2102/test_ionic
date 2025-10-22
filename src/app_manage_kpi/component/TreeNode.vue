<script setup>
import get from "lodash/get";
import { defineProps, ref, computed, defineEmits } from "vue";
import TypeTemplateVIew from "@/app_manage_dynamic_api/components/type_view/TypeTemplateVIew.vue";

const emit = defineEmits(["kpi-click"]);
const props = defineProps({
  node: {
    type: Object,
  },
  attributes: {},
});

const isShow = ref(false);

const countSpace = computed(() => {
  if (!props.node?.tree_path) return 0;
  const codes = props.node?.tree_path.split("/").filter((code) => code);
  return codes.length - 1;
});
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
      <div class="text-center">
        <button
          @click="emit('kpi-click', props.node)"
          class="btn btn-soft-secondary btn-sm"
          type="button"
        >
          <i class="ri-line-chart-line"></i>
        </button>
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
    />
  </template>
</template>
