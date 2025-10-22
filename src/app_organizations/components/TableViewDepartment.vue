<script setup>
import { ref, defineProps, computed } from "vue";
const props = defineProps({
  columns: {},
  tree: {},
});
const screenWidth = ref(window.innerWidth);
const computedClassTable = computed(() => {
  return screenWidth.value < 768 ? "w-auto" : "";
});
</script>

<template>
  <table
    class="table table-borderless align-middle table-nowrap"
    :class="computedClassTable"
  >
    <thead class="table-light">
      <tr>
        <template v-for="column in props.columns" :key="column.path">
          <th v-if="column.show" class="border-end" scope="col">
            <div
              class="dropdown text-center d-flex justify-content-between align-content-center"
            >
              <span class="align-self-center ellipsis">{{ column.name }}</span>
              <!-- Nếu cần thêm chức năng sắp xếp, bạn có thể thêm icon hoặc button tại đây -->
              <!-- <span v-if="column.sort" class="ms-2"
                          >&#9650;&#9660;</span
                        > -->
            </div>
          </th>
        </template>
        <th class="text-center border-end" scope="col" style="width: 150px">
          Hành động
        </th>
      </tr>
    </thead>
    <tbody>
      <slot />
    </tbody>
  </table>
</template>
