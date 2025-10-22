<template>
  <div
    v-if="visible"
    class="d-flex justify-content-center align-items-center flex-column"
    :class="wrapperClass"
  >
    <div
      class="spinner-border text-primary"
      role="status"
      :style="{ width: size, height: size }"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <p class="mt-2 text-muted">{{ loadingText }}</p>
  </div>

  <div
    v-if="isEmpty"
    class="d-flex justify-content-center align-items-center flex-column"
    :class="wrapperClass"
  >
    <i class="bi bi-inbox fs-1 text-secondary"></i>
    <p class="mt-2 text-muted">{{ emptyText }}</p>
  </div>
</template>

<script>
export default {
  name: "LoadingSpinner",
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    data: {
      type: [Array, Object, null],
      default: null,
    },
    size: {
      type: String,
      default: "3rem",
    },
    wrapperClass: {
      type: String,
      default: "py-5",
    },
    loadingText: {
      type: String,
      default: "Đang tải dữ liệu...",
    },
    emptyText: {
      type: String,
      default: "Không có dữ liệu để hiển thị.",
    },
  },
  computed: {
    isEmpty() {
      return (
        this.data !== null &&
        (Array.isArray(this.data)
          ? this.data.length === 0
          : Object.keys(this.data || {}).length === 0)
      );
    },
  },
};
</script>
