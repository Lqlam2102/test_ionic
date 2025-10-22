<template>
  <input
    type="text"
    class="form-control"
    :disabled="!type"
    readonly
    @click="showModal = true"
  />
  <Modal
    id="modelDateSelect"
    v-model="showModal"
    hide-footer
    :title="`Chọn ${getLabel(type)}`"
    cancelVariant="light"
  >
    <template v-if="type == YearType">Chọn năm</template>
    <template v-if="type == QuarterType">Chọn quý</template>
    <template v-if="type == MonthType">Chọn tháng</template>
    <template v-if="type == WeekType">Chọn tuần</template>
  </Modal>
</template>

<script setup>
import { ref, defineProps } from "vue";
import Modal from "@/base/components/dtwinUI/Modal.vue";
const [YearType, QuarterType, MonthType, WeekType] = [
  "year",
  "quarter",
  "month",
  "week",
];
const [YearLabel, QuarterLabel, MonthLabel, WeekLabel] = [
  "Năm",
  "Quý",
  "Tháng",
  "Tuần",
];

const getLabel = (type) => {
  switch (type) {
    case YearType:
      return YearLabel;
    case QuarterType:
      return QuarterLabel;
    case MonthType:
      return MonthLabel;
    case WeekType:
      return WeekLabel;
    default:
      return "Chọn";
  }
};

const showModal = ref(false);

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
});
console.log(props.type);
</script>
