<script setup>
import { Offcanvas } from "bootstrap";
import { reactive, defineProps, defineEmits } from "vue";
import UseMap from "../common/useMap.vue";
import InputSearch from "../common/InputSearch.vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  disable: {
    type: Boolean,
    default: false,
  },
});
let elOffcanvas;

const emit = defineEmits(["update:modelValue", "change-data"]);
const handleUpdateModelValue = ($e) => {
  emit("update:modelValue", $e.target.value);
};

const dataMap = reactive({
  show: false,
  marker: null,
  map: null,
});

const setMarker = (args) => {
  if (dataMap.marker) {
    dataMap.marker.setMap(null);
  }
  // Tạo đối tượng marker từ MarkerOption
  // eslint-disable-next-line no-undef
  dataMap.marker = new map4d.Marker({
    position: args.location,
    draggable: true,
  });
  // Thêm marker vào bản đồ
  dataMap.marker.setMap(dataMap.map);
  dataMap.map.panTo(args.location);
};
const mapMounted = (map) => {
  dataMap.map = map;
  dataMap.map.addListener(
    "click",
    (args) => {
      setMarker(args);
    },
    {}
  );
};
const handleShowMap = () => {
  const elTemp = document.querySelector(".offcanvas.show");
  if (!elTemp) {
    dataMap.show;
    return;
  }
  elOffcanvas = Offcanvas.getInstance(elTemp) ?? new Offcanvas(elTemp);
  if (elOffcanvas) {
    elOffcanvas.hide();
  }
  dataMap.show = true;
};
const handleClose = () => {
  if (elOffcanvas) {
    elOffcanvas.show();
  }
  dataMap.show = false;
};
const handleChoseLocation = (location) => {
  setMarker(location);
};

const handleSubmit = () => {
  if (!dataMap.marker) return;
  if (elOffcanvas) {
    elOffcanvas.show();
  }
  dataMap.show = false;
  const location = dataMap.marker.getPosition();
  emit("update:modelValue", `${location.lat}, ${location.lng}`);
  emit("change-data", `${location.lat}, ${location.lng}`);
};
</script>

<template>
  <input
    class="form-control"
    @change="handleUpdateModelValue"
    :value="props.modelValue"
    type="text"
    :disabled="disable"
  />
  <div
    class="d-flex justify-content-between align-items-center"
    v-if="!disable"
  >
    <span></span>
    <p
      class="cursor-pointer text-primary p-0 m-0"
      style="text-decoration: underline"
      @click="handleShowMap"
    >
      Chọn từ bản đồ
    </p>
  </div>
  <b-modal
    v-model="dataMap.show"
    hide-footer
    body-class="p-0"
    header-class="p-3"
    modal-class="zoomIn"
    centered
    title="Thông tin thông báo"
    size="xl"
  >
    <div class="modal-body">
      <div class="mb-3">
        <div class="position-fixed" style="inset: 0">
          <div class="position-relative">
            <div
              class="position-absolute"
              style="z-index: 10; top: 0; right: 0; left: 0"
            >
              <InputSearch @change="handleChoseLocation"></InputSearch>
            </div>
            <UseMap @map-mounted="mapMounted" />
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-light" @click="handleClose">
        Đóng
      </button>
      <button type="button" class="btn btn-primary" @click="handleSubmit">
        Lưu
      </button>
    </div>
  </b-modal>
</template>
