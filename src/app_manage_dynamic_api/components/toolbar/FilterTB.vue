<script setup>
import { inject, ref, reactive, computed, watch } from "vue";
import ButtonIcon from "@/base/components/baseUI/ButtonIcon.vue";
import DateInput from "@/base/components/date/date.vue";

const manage_data = inject("manage-data");
const { toolbar } = manage_data.getData();

const filters = computed(() => {
  return [...toolbar.fieldFilter, ...toolbar.filters.params];
});

const operators = ref([
  { name: "Ngày tháng", value: "date" },
  { name: "Bằng", value: "exact" },
  { name: "Khác", value: "NOT exact" },
  { name: "Trống", value: "not isnull" },
  { name: "Không trống", value: "isnull" },
  { name: "Thuộc tập hợp", value: "in" },
  { name: "Không thuộc tập hợp", value: "NOT in" },
  { name: "Lớn hơn", value: "gt" },
  { name: "Nhỏ hơn", value: "lt" },
  { name: "Lớn hơn hoặc bằng", value: "gte" },
  { name: "Nhỏ hơn hoặc bằng", value: "lte" },
  // { name: "Text search", value: "unaccent_word_icontains" },
]);

const filterCount = ref(0);
const filterValues = reactive([]);

const handleClickCloseModal = () => {
  toolbar.showModalFilter.value = false;
};

const handleClickFilter = () => {
  manage_data.handleFilter(filterValues.filter((item) => item.field));
  handleClickCloseModal();
};

const handleAddFilter = (index) => {
  if (index + 1 >= 1) {
    filterValues.splice(index + 1, 0, {
      field: filterValues[index].field,
      operator: "unaccent_word_icontains",
      value: "",
    });
  } else {
    filterValues.push({
      field: "",
      operator: "unaccent_word_icontains",
      value: "",
    });
  }
  filterCount.value++;
};

const handleDeleteFilter = (index) => {
  filterCount.value--;
  filterValues.splice(index, 1);
};
const getTypeValue = (param_) => {
  if (!param_)
    return {
      type: "text",
    };

  return (
    filters.value.find((item) => item.params === param_) || {
      type: "text",
    }
  );
};

watch(
  () => toolbar.showModalFilter.value,
  (newValue) => {
    if (!newValue) return;
    filterValues.length = 0;
    const checkSelect = toolbar.filters.params.filter((item) => {
      return item.selected;
    });

    if (!checkSelect?.length) {
      filterValues.push({
        field: "",
        operator: "unaccent_word_icontains",
        value: "",
      });
      return;
    }

    checkSelect.forEach((param) => {
      param.value.forEach((value) => {
        filterValues.push({
          field: param.params,
          operator: value.operator,
          value: value.value,
        });
      });
    });
  }
);
</script>

<template>
  <Teleport to="body">
    <b-modal
      v-model="toolbar.showModalFilter.value"
      title="Thêm Bộ lọc tùy chỉnh"
      class="v-modal-custom"
      size="xl"
      okTitle="Áp dụng"
      cancelTitle="Đóng"
      cancelVariant="light"
      @ok="handleClickFilter"
    >
      <form action="javascript:void(0);" class="border-top border-bottom py-3">
        <b-row class="g-3 mb-3">
          <b-col sm="12">
            <div class="d-flex justify-content-between align-items-center">
              <p class="fw-bold p-0">Phù hợp bất kỳ quy tắc nào sau đây:</p>
              <div class="form-check form-switch">
                <label class="form-check-label"> Bao gồm lưu trữ </label>
                <input class="form-check-input" type="checkbox" role="switch" />
              </div>
            </div>
          </b-col>
          <b-col
            sm="12"
            v-for="(filterValue, index) in filterValues"
            :key="index"
            :class="index > 0 ? '' : 'mt-0'"
          >
            <div class="d-flex">
              <div class="flex-1">
                <div class="w-100 row">
                  <div class="col-4">
                    <select v-model="filterValue.field" class="form-control">
                      <option value="" selected>Chọn Trường</option>
                      <option
                        v-for="filter in filters"
                        :key="filter.params"
                        :value="filter.params"
                      >
                        {{ filter?.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-3">
                    <select v-model="filterValue.operator" class="form-control">
                      <option value="unaccent_word_icontains" selected>Mặc định</option>
                      <option
                        v-for="operator in operators"
                        :key="operator.value"
                        :value="operator.value"
                      >
                        {{ operator.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-5">
                    <div
                      v-if="getTypeValue(filterValue.field).type == 'select'"
                    >
                      <select v-model="filterValue.value" class="form-control">
                        <option value="unaccent_word_icontains" selected>Mặc định</option>
                        <option
                          v-for="valueSelect in getTypeValue(filterValue.field)
                            .select"
                          :key="valueSelect.id"
                          :value="valueSelect.id"
                        >
                          {{ valueSelect.name }}
                        </option>
                      </select>
                    </div>
                    <div
                      v-else-if="getTypeValue(filterValue.field).type == 'text'"
                      class="search-box"
                    >
                      <input
                        v-model="filterValue.value"
                        type="text"
                        class="form-control"
                        autocomplete="off"
                        placeholder="Giá trị tìm kiếm..."
                      />
                      <i class="ri-search-line search-icon"></i>
                    </div>
                    <div
                      v-else-if="
                        getTypeValue(filterValue.field).type == 'number'
                      "
                      class="search-box"
                    >
                      <input
                        type="number"
                        class="form-control"
                        autocomplete="off"
                        placeholder="Giá trị tìm kiếm..."
                      />
                      <i class="ri-search-line search-icon"></i>
                    </div>
                    <div
                      v-else-if="
                        getTypeValue(filterValue.field).type == 'datetime'
                      "
                    >
                      <DateInput v-model="filterValue.value"></DateInput>
                    </div>
                  </div>
                </div>
              </div>
              <ul class="list-inline hstack gap-2 mb-0">
                <li
                  class="list-inline-itemhover-bg-light"
                  @click="handleDeleteFilter(index)"
                >
                  <i class="ri-delete-bin-5-fill fs-16 text-danger"></i>
                </li>
                <li class="list-inline-item hover-bg-light">
                  <i
                    class="mdi mdi-plus fs-16 text-muted"
                    @click="handleAddFilter(index)"
                  ></i>
                </li>
                <li class="list-inline-item hover-bg-light">
                  <i class="ri-git-merge-line fs-16"></i>
                </li>
              </ul>
            </div>
          </b-col>
        </b-row>
        <ButtonIcon
          classIcon="ri-add-line"
          name="Thêm lọc"
          class="border-0"
          type="outline-success"
          @click="handleAddFilter()"
        ></ButtonIcon>
      </form>
    </b-modal>
  </Teleport>
</template>
