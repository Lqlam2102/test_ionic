<script setup>
import { defineProps } from "vue";
import { getTime } from "../../common/common";

const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  value: {
    type: String,
    default: "_",
  },
  customClass: {
    type: String,
    value: "",
  },
});

const bages = [
  "badge badge-soft-warning",
  "badge badge-soft-success",
  "badge badge-soft-danger",
];

const isReportStatus = (type, value) => {
  return type == "status" && value?.title;
};

const formatReportStatus = (value) => {
  const format = {
    class: bages[value.status],
    title: value?.title,
  };
  return format;
};

const getTextValue = (props) => {
  switch (props.type) {
    case "last_login":
      return props.value ? getTime(props.value) : "Chưa đăng nhập";
    case "action_time":
      return props.value ? getTime(props.value) : "Chưa có thông tin";
    case "updated_date":
      return props.value ? getTime(props.value) : "Chưa có thông tin";
    case "created_date":
      return props.value ? getTime(props.value) : "Chưa có thông tin";
    case "history_date":
      return props.value ? getTime(props.value) : "Chưa có thông tin";
    default:
      return;
  }
};
</script>

<template>
  <div v-if="props.type == 'is_baned'">
    <span
      :class="
        props.value?.boolean
          ? 'bg-danger-subtle text-danger bg-soft-danger'
          : 'bg-success-subtle text-success bg-soft-success'
      "
      class="badge"
    >
      {{ props.value?.title }}
    </span>
  </div>
  <div v-else-if="props.type == 'last_login'">
    {{ getTextValue(props) }}
  </div>
  <div v-else-if="props.type == 'action_time'">
    {{ getTextValue(props) }}
  </div>
  <div v-else-if="props.type == 'updated_date'">
    {{ getTextValue(props) }}
  </div>
  <div v-else-if="props.type == 'created_date'">
    {{ getTextValue(props) }}
  </div>
  <div v-else-if="props.type == 'history_date'">
    {{ getTextValue(props) }}
  </div>
  <div v-else-if="props.type == 'logo'">
    <div class="flex-shrink-0">
      <img :src="props.value" alt="" class="avatar-xs rounded-circle" />
    </div>
  </div>
  <div v-else-if="props.type == 'photo'">
    <div class="flex-shrink-0">
      <img :src="props.value" alt="" class="avatar-xs rounded-circle" />
    </div>
  </div>
  <div v-else-if="props.type == 'avatar'">
    <div class="flex-shrink-0">
      <img :src="props.value" alt="" class="avatar-xs rounded-circle" />
    </div>
  </div>
  <div v-else-if="isReportStatus(props.type, props.value)">
    <span :class="formatReportStatus(props.value).class">
      {{ formatReportStatus(props.value).title }}
    </span>
  </div>
  <div v-else-if="props.type == image" class="d-flex gap-2 align-items-center">
    <div class="flex-shrink-0">
      <img
        :src="props.value ?? '@/assets/images/default/cardview.jpg'"
        alt=""
        class="avatar-xs rounded-circle"
      />
    </div>
    <div class="flex-grow-1">Jordan Kennedy</div>
  </div>
  <span v-else :class="customClass">
    <span v-if="customClass" class="fs-10">
      {{ props.value ? props.value : "_" }}
    </span>
    <span v-else>
      {{ props.value ? props.value : "_" }}
    </span>
  </span>
</template>
