<script setup>

import { reactive, watch } from "vue";
// import { useFetch } from "@/helpers/api/api.js"
// import { BASE_URL } from "@/helpers/api/axiosHttp.js";
import { useMapConfigStore } from "./mapConfigStore.js"

// const PROXY = BASE_URL.endsWith('/') ? BASE_URL + 'api' : BASE_URL + '/' + 'api'
const mapConfigStore = useMapConfigStore()

const mapConfigToEdit = reactive({
    name: "",
    config: {
        center: "",
        lat: "0",
        lng: "0",
        tilt: "0",
        type: "roadmap",
        zoom: "0",
        bearing: "0",
        viewbox: "",
        past_time: "2000",
        time_step: "1",
        suggestion: [
        ],
        future_time: "2030",
        MAP4D_SECRET_KEY: ""
    },
    is_main: false
})

watch(mapConfigStore.currentMapConfig, () => {
    const currentMapConfig = mapConfigStore.currentMapConfig.value
    mapConfigToEdit.name = currentMapConfig.name
    mapConfigToEdit.config = currentMapConfig.config
    // mapConfigToEdit.is_main = currentMapConfig.is_main
    mapConfigToEdit.is_main = currentMapConfig.is_main == 'Không sử dụng' ? false : true
})

</script>
<template>
    <form action="#">
        <b-row class="g-3 p-2">
            <b-col xl="12">
                <b-row>
                    <!-- START THÔNG TIN CẤU HÌNH BẢN ĐỒ -->
                    <b-col lg="12" class="mb-2">
                        <button class="accordion-button p-2 bg-head-title" type="button" data-bs-toggle="collapse"
                            data-bs-target="#accor_iconExamplecollapse1" aria-expanded="true"
                            aria-controls="accor_iconExamplecollapse1">
                            THÔNG TIN CẤU HÌNH
                        </button>
                    </b-col>
                    <b-col lg="6" class="mb-2">
                        <label for="nameMapConfigInput" class="form-label mb-1">Tên cấu hình <span
                                class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="nameMapConfigInput" placeholder="Nhập tên cấu hình"
                            disabled v-model="mapConfigToEdit.name" autocomplete="new-address" />
                    </b-col>
                    <b-col lg="6" class="mb-2">
                        <label for="isDefaultMapInput" class="form-label mb-1">Đặt mặc định <span
                                class="text-danger">*</span></label>
                        <div class="form-check form-switch">
                            <div style="left:-6px;top:0;position:absolute;width:30px;height:100%"></div>
                            <input class="form-check-input fs-15" type="checkbox" role="switch" id="isDefaultMapInput"
                                v-model="mapConfigToEdit.is_main">
                            <p v-if="mapConfigToEdit.is_main">Bật</p>
                            <p v-else>Tắt</p>
                        </div>
                    </b-col>
                    <!-- END THÔNG TIN CẤU HÌNH BẢN ĐỒ -->
                    <!-- START CẤU HÌNH BẢN ĐỒ -->
                    <b-col lg="12" class="mb-2 mt-3">
                        <button class="accordion-button p-2 bg-head-title" type="button" data-bs-toggle="collapse"
                            data-bs-target="#accor_iconExamplecollapse1" aria-expanded="true"
                            aria-controls="accor_iconExamplecollapse1">
                            CẤU HÌNH BẢN ĐỒ
                        </button>
                    </b-col>
                    <b-col lg="6" class="mb-2">
                        <label for="addressInput" class="form-label mb-1">Vị trí trung tâm của bản đồ</label>
                        <input type="text" class="form-control" id="centerMapInput" placeholder="10.336505,106.368963"
                            disabled name="centerMap" v-model="mapConfigToEdit.config.center"
                            autocomplete="new-centerMap" />
                    </b-col>
                    <b-col lg="6" class="mb-2">
                        <label for="typeMapInput" class="form-label mb-1">Loại bản đồ</label>
                        <select id="typeMapInput" class="form-control" v-model="mapConfigToEdit.config.type" disabled>
                            <option value="roadmap">RoadMap</option>
                            <option value="raster">Raster</option>
                            <option value="satellite">Satellite</option>
                        </select>
                    </b-col>
                    <b-col lg="6" class="mb-2">
                        <label for="viewBoxInput" class="form-label mb-1">ViewBox</label>
                        <input type="text" class="form-control" id="viewBoxInput" placeholder="Nhập ViewBox" disabled
                            v-model="mapConfigToEdit.config.viewbox" autocomplete="new-viewbox" />
                    </b-col>
                    <b-col lg="6" class="mb-2">
                        <label for="keyMapInput" class="form-label mb-1">Key</label>
                        <input type="text" class="form-control" id="keyMapInput" placeholder="Nhập Key" disabled
                            v-model="mapConfigToEdit.config.MAP4D_SECRET_KEY" autocomplete="new-viewbox" />
                    </b-col>
                    <b-col lg="4" class="mb-2">
                        <label for="zoomMapInput" class="form-label mb-1">Mức zoom</label>
                        <input type="text" class="form-control" id="zoomMapInput" placeholder="Nhập mức zoom" disabled
                            v-model="mapConfigToEdit.config.zoom" autocomplete="new-mapZoom" />
                    </b-col>
                    <b-col lg="4" class="mb-2">
                        <label for="mapBearingInput" class="form-label mb-1">Góc nhìn</label>
                        <input type="text" class="form-control" id="mapBearingInput" placeholder="Nhập góc nhìn" disabled
                            v-model="mapConfigToEdit.config.bearing" autocomplete="new-bearing" />
                    </b-col>
                    <b-col lg="4" class="mb-2">
                        <label for="mapTiltInput" class="form-label mb-1">Độ nghiêng</label>
                        <input type="text" class="form-control" id="mapTiltInput" placeholder="Nhập độ nghiêng" disabled
                            v-model="mapConfigToEdit.config.tilt" autocomplete="new-tilt" />
                    </b-col>
                    <!-- END CẤU HÌNH BẢN ĐỒ -->
                    <b-col lg="12" class="mb-2">
                        <button class="accordion-button p-2 bg-head-title" type="button" data-bs-toggle="collapse"
                            data-bs-target="#accor_iconExamplecollapse1" aria-expanded="true"
                            aria-controls="accor_iconExamplecollapse1">
                            CẤU HÌNH GỢI Ý TÌM KIẾM
                        </button>
                    </b-col>
                    <!-- Base Buttons -->
                    <b-col lg="2" class="mb-2 text-end d-flex flex-column justify-content-between"
                        v-for="suggest in mapConfigToEdit.config.suggestion" :key="suggest.name">
                        <button type="button" class="btn btn-sm btn-primary waves-effect waves-light"><i
                                :class="suggest.icon"></i> {{ suggest.name }}</button>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </form>
</template>
<style scoped>
.bg-head-title {
    background-color: #DBE4FF;
}

.bg-disabled {
    background-color: var(--vz-input-disabled-bg) !important;
}
</style>