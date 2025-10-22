<template>
  <b-card no-body class="card-animate">
    <b-card-body>
      <div class="d-flex justify-content-between">
        <div>
          <p class="fw-medium text-muted mb-0">{{ this.name }}</p>
          <h2 class="mt-4 ff-secondary fw-semibold">
            <template v-if="this.isLoading">
              <Skeleton
                style="width: 60px; height: 40px; background-color: darkgray"
                class="mb-0"
                animation="wave"
              ></Skeleton>
            </template>
            <template v-else>
              <span>{{ this.value }}</span>
            </template>
          </h2>
        </div>
        <div>
          <div class="avatar-sm flex-shrink-0">
            <span class="avatar-title bg-success-subtle rounded-circle fs-2">
              <users-icon
                class="text-success mdi mdi-phone-incoming-outline"
              ></users-icon>
            </span>
          </div>
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import Skeleton from "primevue/skeleton";
export default {
  components: {
    Skeleton,
  },
  props: ["name", "value", "isLoading"],
};
</script>
