<script setup>
import { defineProps, defineEmits } from "vue";
import useMap from "../../common/useMap.vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const handleUpdateModelValue = (value) => {
  emit("update:modelValue", value);
};

// eslint-disable-next-line no-unused-vars
let map;
const mapMounted = (valueMmap) => {
  map = valueMmap;
};
</script>

<template>
  <Teleport to="body">
    <b-modal
      :modelValue="props.modelValue"
      @update:modelValue="handleUpdateModelValue"
      hide-footer
      title="Demo polygon"
      class="v-modal-custom"
      size="xl"
    >
      <useMap @map-mounted="mapMounted"></useMap>

      <div class="modal-footer">
        <button type="button" class="btn btn-light" @click="handleUpdateModelValue">
          Huỷ
        </button>
        <button type="button" class="btn btn-primary" @click="handleUpdateModelValue">
          Lưu
        </button>
      </div>
    </b-modal>
  </Teleport>
</template>
