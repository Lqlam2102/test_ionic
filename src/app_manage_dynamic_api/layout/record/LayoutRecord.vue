<script setup>
import { defineProps, defineEmits, reactive, ref, onMounted } from "vue";

const emit = defineEmits(["close-offcanvas", "open-offcanvas"]);

const props = defineProps({
  id: {
    type: String,
    requred: true,
  },
  nameLabel: {
    type: String,
    default: "Name",
  },
  title: {
    type: String,
    default: "",
  },
  class: {},
  style: {},
  teleport: {
    type: String,
    default: "body",
  },
  defaultFullScreen: {
    type: Boolean,
    default: false,
  },
});

const view = reactive({
  isFull: false,
});

const offcanvas = ref(null);

const handleClickFullScreen = () => {
  view.isFull = !view.isFull;
  if (view.isFull) {
    offcanvas.value.classList.add("full-screen__custom-record");
  } else {
    offcanvas.value.classList.remove("full-screen__custom-record");
  }
};

const handleCloseThisOffcanvas = () => {
  emit("close-offcanvas", "offcanvas" + props.id);
};

onMounted(() => {
  if (props.defaultFullScreen) handleClickFullScreen();

  // Lắng nghe sự kiện mở Offcanvas
  const offcanvasElement = document.getElementById("offcanvas" + props.id);
  if (offcanvasElement) {
    offcanvasElement.addEventListener("show.bs.offcanvas", () => {
      emit("open-offcanvas", "offcanvas" + props.id);
    });
  }
});
</script>

<template>
  <!-- <button class="btn btn-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasadd-user"
        aria-controls="offcanvasadd-user">Toggle Right Offcanvas</button> -->
  <!-- right offcanvas -->
  <Teleport :to="props.teleport">
    <div
      ref="offcanvas"
      :class="props.class"
      :style="props.style"
      class="offcanvas offcanvas-end offcanvas__layout--record"
      data-bs-backdrop="false"
      tabindex="-1"
      :id="'offcanvas' + props.id"
      :aria-labelledby="'offcanvas' + props.id + 'Label'"
    >
      <div class="offcanvas-header border-bottom" style="padding: 16px">
        <div class="d-flex gap-2 align-items-center">
          <div
            v-if="props.title"
            class="btn"
            style="cursor: auto; background-color: #e2e5ed"
          >
            {{ props.title }}
          </div>
          <slot name="header"></slot>
        </div>
        <div class="d-flex gap-2 align-items-center">
          <button
            type="button"
            @click="handleClickFullScreen"
            class="btn btn-outline-primary btn-icon waves-effect waves-light"
          >
            <i
              :class="
                view.isFull ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'
              "
            ></i>
          </button>
          <button
            type="button"
            @click="handleCloseThisOffcanvas"
            class="btn btn-outline-primary btn-icon waves-effect waves-light"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i class="ri-close-line"></i>
          </button>
          <!-- <button type="button" class="btn-close text-reset"></button> -->
        </div>
      </div>
      <div class="offcanvas-body p-3">
        <div class="simplebar-scrollable-y h-100" data-simplebar>
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.offcanvas {
  width: 42vw;
  min-width: 330px;
  margin-top: 132px;
  transition: width 0.3s ease 0s;
  /* background-color: #e9e9e9; */
  border: 1px solid #ccc !important;
  z-index: 1000;
}
.border-bottom {
  border-bottom: 1px solid #ccc !important;
}
.full-screen__custom-record {
  width: calc(100vw - 254px) !important;
  transition: width 0.3s ease 0s;
}

@media only screen and (max-width: 768px) {
  .full-screen__custom-record {
    width: 100vw !important;
  }
}

@media only screen and (max-width: 600px) {
  .offcanvas__layout--record {
    width: 100vw !important;
    margin-top: 140px;
  }
}
</style>
