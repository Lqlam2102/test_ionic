<script setup>
import { defineProps, onMounted, onBeforeUnmount } from "vue";
import NavBarHead from "./NavBarHead.vue";
import FooterStore from "../components/FooterStore.vue";

const props = defineProps({
  typePage: {
    type: String,
    default: "manage",
  },
});

const topFunction = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};
const applyStyles = () => {
  const layoutWrapper = document.querySelector(
    "#layout-wrapper .navbar-light .navbar-nav .nav-item .nav-link"
  );
  if (layoutWrapper) {
    layoutWrapper.style.color = "#000";
  }

  const pageContent = document.querySelector(".page-content");
  if (pageContent) {
    pageContent.style.paddingTop = "100px";
  }
};

const removeStyles = () => {
  const layoutWrapper = document.querySelector(
    "#layout-wrapper .navbar-light .navbar-nav .nav-item .nav-link"
  );
  if (layoutWrapper) {
    layoutWrapper.style.color = "";
  }

  const pageContent = document.querySelector(".page-content");
  if (pageContent) {
    pageContent.style.paddingTop = "";
  }
};

onMounted(() => {
  applyStyles();
});

onBeforeUnmount(() => {
  removeStyles();
});
</script>

<template>
  <div v-if="props.typePage == 'manage'">
    <div id="layout-wrapper">
      <NavBarHead class="bg-white" />
      <!-- ============================================================== -->
      <!-- Start Page Content here -->
      <!-- ============================================================== -->

      <div class="main-content" style="margin-left: 0 !important">
        <div class="page-content">
          <!-- Start Content-->
          <b-container>
            <slot />
          </b-container>
        </div>
        <FooterStore />
      </div>
      <!-- <RightBar /> -->
    </div>
  </div>
  <div v-else-if="props.typePage == 'portal'">
    <div class="layout-wrapper landing">
      <NavBarHead />
      <slot></slot>

      <FooterStore />
      <b-button
        variant="info"
        @click="topFunction"
        class="btn-icon"
        id="back-to-top"
      >
        <i class="ri-arrow-up-line"></i>
      </b-button>
    </div>
  </div>
</template>
