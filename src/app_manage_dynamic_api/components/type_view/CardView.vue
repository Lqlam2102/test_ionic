<script setup>
import get from "lodash/get";
import { inject } from "vue";
import TypeTemplateVIew from "./TypeTemplateVIew.vue";

const manage_data = inject("manage-data");

const { data: dataMain, attribute } = manage_data.getData();
</script>

<template>
  <div class="row g-2 g-xl-3">
    <div
      class="col-md-6 d-flex justify-content-center"
      v-for="(item, index) in dataMain.results"
      :key="index"
    >
      <div class="card w-100 d-flex flex-column cursor-pointer">
        <div class="card-body flex-grow-0">
          <div class="row gap-3 flex-wrap">
            <template v-for="(attributeItem, attributeIndex) in attribute">
              <div v-if="attributeItem.show" :key="attributeIndex">
                <span class="fw-bold"> {{ attributeItem.name }}:&nbsp;</span>

                <span class="ellipsis text-body fw-medium">
                  <TypeTemplateVIew
                    :type="attributeItem.key"
                    :value="get(item, attributeItem.key, '')"
                  ></TypeTemplateVIew>
                </span>
              </div>
            </template>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-end">
          <div class="form-check form-switch">
            <label class="form-check-label" for="flexSwitchCheckRightDisabled">
              Công khai
            </label>
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckRightDisabled"
              :checked="item.isPublic"
            />
          </div>
          <div class="dropdown text-end">
            <button
              class="btn btn-soft-secondary btn-sm dropdown"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="mdi mdi-dots-vertical"></i>
            </button>
            <ul
              class="dropdown-menu dropdown-menu-end"
              :item="JSON.stringify(item)"
            >
              <slot></slot>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
