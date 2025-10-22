<script setup>
import { reactive } from "vue";
import MapGeojson from "../map/MapGeojson.vue";

const data = reactive({
  showModal: false,
  file: null,
});

const handleChangFile = ($e) => {
  if (!$e.target.files?.length) return;
  data.file = $e.target.files[0];
};
</script>

<template>
  <input @change="handleChangFile" class="form-control" type="file" />
  <div class="d-flex justify-content-between align-items-center">
    <span></span>
    <p
      class="cursor-pointer text-primary p-0 m-0"
      style="text-decoration: underline"
      @click="data.showModal = true"
    >
      Vẽ từ bản đồ
    </p>
  </div>
  <MapGeojson v-model="data.showModal"></MapGeojson>
</template>
