<script setup>
import { defineProps } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: "Name",
  },
  classIcon: {
    type: String,
    default: "ri-more-fill",
  },
  type: {
    type: String,
    default: "primary",
  },
});
</script>

<template>
  <a
    href="javascript:void(0);"
    class="btn btn-label"
    :class="`btn-${props.type}`"
  >
    <div class="d-flex">
      <div class="flex-shrink-0">
        <i :class="props.classIcon" class="label-icon align-middle fs-16"></i>
      </div>
      <div class="flex-grow-1">{{ props.name }}</div>
    </div>
  </a>
</template>