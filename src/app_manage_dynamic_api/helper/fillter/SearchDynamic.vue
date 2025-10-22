<script setup>
import { ref, inject, computed } from "vue";
import NewQuickSearch from "./box_search/newQuickSearch.vue";
import TextQuggest from "./box_search/TextQuggest.vue";
import FilterTB from "../../components/toolbar/FilterTB.vue";

const manage_data = inject("manage-data");

const { toolbar } = manage_data.getData();

const isFocus = ref(false);

const handleFocusInput = () => {
  isFocus.value = true;
};

const selectedFilters = computed(() => {
  return toolbar.filters.params.filter((item) => item.selected);
});

const selectedFieldFilter = computed(() => {
  return toolbar.fieldFilter.filter((item) => item.selected);
});

const appliedQuickSearch = computed(() => {
  return toolbar.quickSearch.filter((item) => item.apply);
});

const handleBlurInput = () => {
  setTimeout(() => {
    isFocus.value = false;
  }, 300);
};

const handleClickDeleteSearch = (search) => {
  search.selected = false;
  search.value = [];
  manage_data.handleTextSearch();
};

const handleClickDeleteField = (filed) => {
  filed.selected = false;
  filed.value = [];
  manage_data.handleTextSearch();
};

const handleClickRemoveAll = () => {
  toolbar.filters.search = "";
  toolbar.filters.params = toolbar.filters.params.map((item) => {
    return { ...item, value: [], selected: false };
  });
  manage_data.handleTextSearch();
};

const handleClickUnApplyQuickSearch = (item) => {
  item.apply = false;
  manage_data.handleTextSearch();
};
</script>

<template>
  <div class="w-100">
    <div
      xl="12"
      class="mb-0 d-flex justify-content-between align-items-center position-relative"
    >
      <div class="search-box w-100">
        <div class="form-control d-flex flex-wrap gap-1">
          <i class="ri-search-line search-icon"></i>

          <!-- Các trường chọn Lọc -->
          <div
            class="me-2 mb-1 btn btn-sm btn-light container__filter"
            v-for="(item, index) in selectedFieldFilter"
            :key="index"
          >
            <i
              class="las la-filter fs-16 btn-primary bg-primary text-white px-1 icon__fillter--system"
            ></i>
            <i
              @click="toolbar.showModalFilter.value = true"
              class="ri-settings-4-fill fs-16 btn-primary bg-primary text-white px-1 icon__fillter--system"
            ></i>
            <span class="mx-4 d-flex align-items-center text-nowrap">
              <b>{{ item?.name }}:</b>&nbsp;{{ item?.value[0]?.value }}
            </span>
            <i
              class="ri-close-fill fs-16 btn-primary bg-light icon__fillter--close"
              @click="handleClickDeleteField(item)"
            ></i>
          </div>

          <!-- Các trường tìm kiếm theo text -->
          <div
            class="btn btn-sm btn-light container__filter"
            v-for="search in selectedFilters"
            :key="search.params"
          >
            <i
              class="ri-search-line fs-16 btn-primary bg-primary text-white px-1 icon__fillter--system"
            ></i>
            <span class="mx-4 d-flex align-items-center text-nowrap">
              <b>{{ search.name }} </b>:&nbsp;
              <span
                v-html="
                  search.value.map((item) => item.value).join('<b> or </b>')
                "
              ></span>
            </span>
            <i
              class="ri-close-fill fs-16 btn-primary bg-light icon__fillter--close"
              @click="handleClickDeleteSearch(search)"
            ></i>
          </div>
          <div
            class="btn btn-sm btn-light container__filter"
            v-for="(item, index) in appliedQuickSearch"
            :key="index"
          >
            <i
              class="ri-search-line fs-16 btn-primary bg-primary text-white px-1 icon__fillter--system"
            ></i>
            <span class="mx-4 d-flex align-items-center text-nowrap">
              <b>{{ item.label }} </b>
            </span>
            <i
              class="ri-close-fill fs-16 btn-primary bg-light icon__fillter--close"
              @click="handleClickUnApplyQuickSearch(item)"
            ></i>
          </div>

          <input
            type="text"
            class="flex-1 border-0 bg-transparent input__no-border"
            placeholder="Tìm kiếm"
            @focus="handleFocusInput"
            @blur="handleBlurInput"
            v-model="toolbar.filters.search"
          />

          <span
            v-show="selectedFilters?.length || toolbar.filters.search"
            class="position-absolute cursor-pointer fs-20 text-muted mdi mdi-close-circle search-widget-icon search-widget-icon-close"
            style="right: 4px; top: 50%; transform: translateY(-50%)"
            @click="handleClickRemoveAll"
          ></span>
        </div>
      </div>
      <!-- <div><button class="btn btn-icon btn-close"></button></div> -->
      <TextQuggest
        v-show="isFocus && toolbar.filters.search !== ''"
      ></TextQuggest>
      <NewQuickSearch v-show="isFocus && toolbar.filters.search === ''">
      </NewQuickSearch>
      <!-- <QickSearch></QickSearch> -->
    </div>
  </div>

  <FilterTB></FilterTB>
</template>

<style scoped>
.input__no-border:focus-visible {
  border: none !important;
  outline: none;
}

.icon__fillter--system {
  position: absolute;
  display: flex;
  align-items: center;
  top: 0px;
  bottom: 0px;
  left: 0px;
  border-bottom-left-radius: 0.25rem !important;
  border-top-left-radius: 0.25rem !important;
}

.icon__fillter--close {
  position: absolute;
  display: flex;
  align-items: center;
  top: 0px;
  bottom: 0px;
  right: 0px;
  border-bottom-right-radius: 0.25rem !important;
  border-top-right-radius: 0.25rem !important;
}

.container__filter {
  display: flex;
  justify-content: center;
  gap: 0;
  position: relative;
}

.container__filter:hover .ri-settings-4-fill {
  display: block;
}

.container__filter .ri-settings-4-fill {
  display: none;
}
</style>
