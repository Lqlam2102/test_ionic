<script setup>
import { defineProps } from "vue";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="pb-4">
    <div class="text-center">
      <img
        :src="props.user?.photo"
        alt=""
        class="img-thumbnail rounded-circle"
        style="width: 100px; height: 100px"
      />
      <h5>{{ props.user.first_name }}&nbsp;{{ props.user.last_name }}</h5>
      <p class="text-muted mb-0">
        {{ props.user?.username }}
      </p>
    </div>
  </div>
  <div class="d-flex gap-2 justify-content-center mb-3">
    <div
      class="avatar-xs d-block flex-shrink-0 me-2"
      v-if="props.user.social_network_link?.facebook"
    >
      <a
        target="_blank"
        :href="
          `https://www.facebook.com/${props.user.social_network_link?.facebook}` ||
          '#'
        "
      >
        <span class="avatar-title rounded-circle fs-16 bg-primary">
          <i class="ri-facebook-fill"></i>
        </span>
      </a>
    </div>

    <div
      class="avatar-xs d-block flex-shrink-0 me-2"
      v-if="props.user.social_network_link?.tiktok"
    >
      <a
        target="_blank"
        :href="
          `https://www.tiktok.com/@${props.user.social_network_link?.tiktok}` ||
          '#'
        "
      >
        <span class="avatar-title rounded-circle fs-16 bg-dark text-light">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-tiktok"
            viewBox="0 0 16 16"
          >
            <path
              d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"
            ></path>
          </svg>
        </span>
      </a>
    </div>

    <div
      class="avatar-xs d-block flex-shrink-0 me-2"
      v-if="props.user.social_network_link?.zalo"
    >
      <a
        target="_blank"
        :href="`https://zalo.me/${props.user.social_network_link?.zalo}` || '#'"
      >
        <span class="avatar-title rounded-circle fs-16 bg-white text-light">
          <img
            height="32"
            width="32"
            src="@/assets/images/icon/zalo-logo.png"
          />
        </span>
      </a>
    </div>
  </div>
</template>
