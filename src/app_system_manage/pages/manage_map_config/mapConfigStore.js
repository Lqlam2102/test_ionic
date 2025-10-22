import { defineStore } from "pinia";
import { ref } from "vue";
import { useFetch } from "@/helpers/api/api.js"
// import { usePatchJSON } from "../api_custom.js"
import { BASE_URL } from "@/helpers/api/axiosHttp.js";
// import Swal from "sweetalert2";
import { errorToast } from "@/helpers/api/toastStyle";

const apiPath = "map-config"
const PROXY = BASE_URL.endsWith('/') ? BASE_URL + 'api' : BASE_URL + '/' + 'api'


export const useMapConfigStore = defineStore("useMapConfigStore", () => {
    const actionType = ref("add")

    const listTypeSuggest = ref(["car", "car_dealer", "atm", "bank", "hospital", "pharmacy", "bus_stop", "university", "education", "hotel", "resort", "apartment", "restaurant", "gym", "library", "bus_station", "airport", "ferry", "train_station", "gas_station", "preschool", "primary_school", "training_center", "guest_house", "food_service", "pagoda", "religion", "temple", "storage", "establishment", "museum", "sports_center", "stadium", "park", "golf", "entertainment", "cinema", "zoo", "government", "police", "beauty", "fashion", "clothing_store", "electronics_store", "food_store", "supermarket", "local_market", "fruit_shop", "service", "toll_booth", "sports"])

    const listIconSuggest = ref(["ri-home-line", "ri-home-fill", "ri-home-2-line", " ri-home-2-fill", "ri-home-3-line", "ri-home-3-fill", "ri-government-line", "ri-hand-coin-fill", "ri-restaurant-fill", "ri-money-dollar-box-line", "ri-facebook-box-fill", " ri-hotel-fill", " ri-building-fill", "ri-hospital-fill", " ri-store-fill", "ri-gas-station-fill"])

    const mapConfigToAdd = ref({
        value: {
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
        }
    })

    const mapConfigToEdit = ref({
        value: {
            name: "",
            config: {
                lat: "0",
                lng: "0",
                tilt: "",
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
        }
    })

    const currentMapConfig = ref({
        value: {
            name: "",
            config: {
                lat: "0",
                lng: "0",
                tilt: "",
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
        }
    })

    const getDetailMapConfig = async (mapConfigId) => {
        let data = null
        await useFetch(PROXY + `/${apiPath}/${mapConfigId}/`).then(res => {
            data = res
        })
        return data
    }
    const validateObj = (obj) => {
        if (obj.name == "") {
            errorToast("Vui lòng nhập tên cấu hình!")
            return false
        }
        if (obj.email == "") {
            errorToast("Vui lòng email thông báo!")
            return false
        }
        if (obj.password == "") {
            errorToast("Vui lòng mật khẩu email thông báo!")
            return false
        }
        return true
    }
    const resetFromUpdate = async () => {
        const mapConfigId = currentMapConfig.value.value.id

        getDetailMapConfig(mapConfigId).then(data => {
            currentMapConfig.value.value = {
                value: {
                    name: "",
                    config: {
                        lat: "0",
                        lng: "0",
                        tilt: "",
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
                }
            }
            currentMapConfig.value.value = data
        })
    }
    return {
        actionType,
        mapConfigToAdd,
        mapConfigToEdit,
        currentMapConfig,
        listTypeSuggest,
        listIconSuggest,
        apiPath,
        getDetailMapConfig,
        validateObj,
        resetFromUpdate

    }
});