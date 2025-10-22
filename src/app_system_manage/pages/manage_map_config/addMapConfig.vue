<script setup>

import { ref } from "vue";
// import { useFetch } from "@/helpers/api/api.js"
// import { BASE_URL } from "@/helpers/api/axiosHttp.js";
import { useMapConfigStore } from "./mapConfigStore.js"
import { errorToast } from "@/helpers/api/toastStyle";

// const PROXY = BASE_URL.endsWith('/') ? BASE_URL + 'api' : BASE_URL + '/' + 'api'
const mapConfigStore = useMapConfigStore()

const mapConfigToAdd = mapConfigStore.mapConfigToAdd.value

const listTypeSuggest = mapConfigStore.listTypeSuggest
const listIconSuggest = mapConfigStore.listIconSuggest

const newSuggest = ref({
    name: "",
    type: "restaurant",
    icon: "ri-restaurant-fill"
})

const resetNewSuggest = () => {
    newSuggest.value = {
        name: "",
        type: "restaurant",
        icon: "ri-restaurant-fill"
    }
}

const addNewSuggest = () => {
    let isContain = false
    mapConfigToAdd.config.suggestion.forEach(suggest => {
        if (suggest.type === newSuggest.value.type && suggest.icon === newSuggest.value.icon) {
            isContain = true
        }
    })
    if (!isContain) {
        mapConfigToAdd.config.suggestion.push(newSuggest.value)
        resetNewSuggest()
    }
    else {
        errorToast("Đã tồn tại gợi ý tương tự!")
    }

}

</script>
<template>
    <form action="#">
        <button class="d-none" type="reset" name="reset"></button>
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
                            v-model="mapConfigToAdd.name" autocomplete="new-address" :class="{ 'is-invalid': !mapConfigToAdd.name }" />
                        <div class="invalid-feedback d-block" v-if="!mapConfigToAdd.name">
                            Vui lòng nhập tên cấu hình
                        </div>
                    </b-col>
                    <b-col lg="6" class="mb-2">
                        <label for="isDefaultMapInput" class="form-label mb-1">Đặt mặc định<span
                                class="text-danger">*</span></label><br> 
                        <div class="form-check form-switch">
                            <input class="form-check-input fs-15" type="checkbox" role="switch" id="isDefaultMapInput" v-model="mapConfigToAdd.is_main">
                            <p v-if="mapConfigToAdd.is_main">Bật</p>
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
                            name="centerMap" v-model="mapConfigToAdd.config.center" autocomplete="new-centerMap" />
                    </b-col>
                    <b-col lg="6" class="mb-2">
                        <label for="typeMapInput" class="form-label mb-1">Loại bản đồ</label>
                        <select id="typeMapInput" class="form-control" v-model="mapConfigToAdd.config.type">
                            <option value="roadmap">RoadMap</option>
                            <option value="raster">Raster</option>
                            <option value="satellite">Satellite</option>
                        </select>
                    </b-col>
                    <b-col lg="6" class="mb-2">
                        <label for="viewBoxInput" class="form-label mb-1">ViewBox</label>
                        <input type="text" class="form-control" id="viewBoxInput" placeholder="Nhập ViewBox"
                            v-model="mapConfigToAdd.config.viewbox" autocomplete="new-viewbox" />
                    </b-col>
                    <b-col lg="6" class="mb-2">
                        <label for="keyMapInput" class="form-label mb-1">Key</label>
                        <input type="text" class="form-control" id="keyMapInput" placeholder="Nhập Key"
                            v-model="mapConfigToAdd.config.MAP4D_SECRET_KEY" autocomplete="new-viewbox" />
                    </b-col>
                    <b-col lg="4" class="mb-2">
                        <label for="zoomMapInput" class="form-label mb-1">Mức zoom</label>
                        <input type="text" class="form-control" id="zoomMapInput" placeholder="Nhập mức zoom"
                            v-model="mapConfigToAdd.config.zoom" autocomplete="new-mapZoom" />
                    </b-col>
                    <b-col lg="4" class="mb-2">
                        <label for="mapBearingInput" class="form-label mb-1">Góc nhìn</label>
                        <input type="text" class="form-control" id="mapBearingInput" placeholder="Nhập góc nhìn"
                            v-model="mapConfigToAdd.config.bearing" autocomplete="new-bearing" />
                    </b-col>
                    <b-col lg="4" class="mb-2">
                        <label for="mapTiltInput" class="form-label mb-1">Độ nghiêng</label>
                        <input type="text" class="form-control" id="mapTiltInput" placeholder="Nhập độ nghiêng"
                            v-model="mapConfigToAdd.config.tilt" autocomplete="new-tilt" />
                    </b-col>
                    <!-- END CẤU HÌNH BẢN ĐỒ -->
                    <b-col lg="12" class="mb-2">
                        <button class="accordion-button p-2 bg-head-title" type="button" data-bs-toggle="collapse"
                            data-bs-target="#accor_iconExamplecollapse1" aria-expanded="true"
                            aria-controls="accor_iconExamplecollapse1">
                            CẤU HÌNH GỢI Ý TÌM KIẾM
                        </button>
                    </b-col>
                    <b-col lg="4" class="mb-2">
                        <label for="suggestNameInput" class="form-label mb-1">Tên gợi ý<span
                                class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="suggestNameInput" placeholder="Nhập tên gợi ý"
                            v-model="newSuggest.name" autocomplete="new-suggestName" />
                    </b-col>
                    <b-col lg="3" class="mb-2">
                        <label for="suggestIconInput" class="form-label mb-1">Chọn Icon</label>
                        <select id="suggestIconInput" class="form-control" v-model="newSuggest.icon">
                            <option :value="icon" v-for="icon in listIconSuggest" :key="icon"><i :class="icon"></i> {{ icon
                            }}</option>
                        </select>
                    </b-col>
                    <b-col lg="3" class="mb-2">
                        <label for="suggestTypeInput" class="form-label mb-1">Chọn Type</label>
                        <select name="" id="suggestTypeInput" class="form-control" v-model="newSuggest.type">
                            <option :value="typeS" v-for="typeS in listTypeSuggest" :key="typeS">{{ typeS }}</option>
                        </select>
                    </b-col>
                    <b-col lg="2" class="mb-2 text-end d-flex flex-column justify-content-between">
                        <div></div>
                        <button type="button" class="btn btn-primary" @click="addNewSuggest">Thêm</button>

                    </b-col>
                    <b-col lg="2" class="mb-2 text-end d-flex flex-column justify-content-between"
                        v-for="suggest in mapConfigToAdd.config.suggestion" :key="suggest.name">
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