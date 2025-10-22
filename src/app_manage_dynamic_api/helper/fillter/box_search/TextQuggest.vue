<script setup>
import { inject } from "vue";

const manage_data = inject("manage-data");

const { toolbar } = manage_data.getData();

const hanldeClickChoseFilted = (filter) => {
  filter.selected = true;
  filter.value.push({
    value: toolbar.filters.search,
    operator: filter.type == "number" ? "" : "unaccent_word_icontains",
  });
  toolbar.filters.search = "";

  manage_data.handleTextSearch();
};

const handleClickShowModalFilter = () => {
  toolbar.showModalFilter.value = true;
};
</script>

<template>
  <div
    class="position-absolute pt-2 px-3"
    style="top: 100%; left: 0; right: 0; z-index: 1"
  >
    <div class="card shadow" style="max-height: 300px">
      <div class="live-preview">
        <div class="list-group list-group-fill-success">
          <div v-for="filter in toolbar.filters.params" :key="filter.params">
            <a
              href="javascript:void(0)"
              @click="hanldeClickChoseFilted(filter)"
              class="py-2 list-group-item list-group-item-action border-0"
            >
              <!-- <i class="ri-arrow-right-s-fill align-middle me-2"></i> -->
              Lọc <b>{{ filter.name }}</b> for: {{ filter.type }}
            </a>
            <!-- <div v-if="item % 2 == 0">
              <a
                href="javascript:void(0)"
                class="py-2 list-group-item list-group-item-action border-0"
              >
                <i class="px-3 align-middle me-2"></i>
                (no result)
              </a>
            </div> -->
          </div>
          <a
            href="javascript:void(0)"
            class="py-2 list-group-item list-group-item-action"
            @click="handleClickShowModalFilter"
          >
            <i class="ri-settings-2-line fs-16 align-middle me-2"></i>
            Thiết lập lọc tuỳ chỉnh
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
