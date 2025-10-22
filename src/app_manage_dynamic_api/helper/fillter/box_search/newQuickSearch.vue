<script setup>
import { inject, computed } from "vue";

const manage_data = inject("manage-data");

const { toolbar } = manage_data.getData();

const quickSearch = computed(() => {
  return toolbar?.quickSearch
})

const handleClickShowModalFilter = () => {
  toolbar.showModalFilter.value = true;
};

const handleClickQuickSearch = (item) => {
  item.apply = !item.apply;
  manage_data.handleTextSearch()
}
</script>

<template>
  <div class="position-absolute pt-2 px-3" style="top: 100%; left: 0; right: 0; z-index: 1">
    <div class="card shadow overflow-auto" style="max-height: 300px">
      <div class="row p-0 m-0">
        <div class="col-12 col-md-4 px-0 border-end">
          <div class="card-body border-bottom pb-1">
            <div class="d-flex gap-2">
              <div class="d-flex gap-2">
                <i class="las la-filter label-icon align-middle text-primary fs-20"></i>
                <h5 class="fw-bold">Lọc</h5>
              </div>
            </div>
            <!-- <li class="p-2 border-bottom">
                      </li> -->
            <div v-for="(item, index) in quickSearch" :key="index" @click="handleClickQuickSearch(item)"
              class="ps-0 d-flex text-bg-white text-nowrap align-items-center btn btn-ghost-dark"
              :class="{ 'text-danger': item?.apply }" style="height: 28px">
              <span class="fw-light text-nowrap">{{ item?.label }}</span>
            </div>

            <div class="my-1 border-bottom"></div>

            <div class="d-flex text-bg-white text-nowrap align-items-center btn btn-ghost-dark ps-0"
             style="height: 28px" @click="handleClickShowModalFilter">
              <i class="ri-settings-2-line me-2 align-bottom fs-16 fw-bold text-muted" style="width: 20px">
              </i>
              <span class="fw-light text-nowrap">
                Thêm bộ lọc tùy chỉnh
              </span>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4 px-0 border-end">
          <div class="card-body border-bottom pb-1">
            <div class="d-flex gap-2">
              <div class="d-flex gap-2">
                <i class="las la-object-group label-icon align-middle text-success fs-20"></i>
                <h5 class="fw-bold">Nhóm</h5>
              </div>
            </div>
            <!-- <li class="p-2 border-bottom">
      </li> -->
            <div v-for="item in 1" :key="item"
              class="ps-0 d-flex text-bg-white text-nowrap align-items-center btn btn-ghost-dark" style="height: 28px">
              <i class="me-2 align-bottom fs-16 fw-bold text-muted" style="width: 20px"></i><span
                class="fw-light text-nowrap">Đang xây dựng</span>
            </div>

            <div class="my-1 border-bottom"></div>

            <div class="ps-0 d-flex text-bg-white text-nowrap align-items-center btn btn-ghost-dark ps-0"
              style="height: 28px">
              <i class="ri-settings-2-line me-2 align-bottom fs-16 fw-bold text-muted" style="width: 20px">
              </i>
              <span class="fw-light text-nowrap">
                Nhóm tùy chỉnh
              </span>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4 px-0 border-end">
          <div class="card-body border-bottom pb-1">
            <div class="d-flex gap-2">
              <div class="d-flex gap-2">
                <i class="las la-star label-icon label-icon align-middle text-warning fs-20"></i>
                <h5 class="fw-bold">Yêu thích</h5>
              </div>
            </div>

            <div class="ps-0 d-flex text-bg-white text-nowrap align-items-center btn btn-ghost-dark"
              style="height: 28px">
              <i class="ri-settings-2-line me-2 align-bottom fs-16 fw-bold text-muted ps-0" style="width: 20px">
              </i>
              <span class="fw-light text-nowrap"> Tùy chỉnh </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
