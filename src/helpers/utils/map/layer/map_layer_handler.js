import { ref } from "vue"
import { useFetch } from "@/helpers/api/api.js";
import { BASE_URL } from "@/helpers/api/axiosHttp.js";
import { uuidv4 } from "@/helpers/utils/uuid/uuid.js"
const PROXY = BASE_URL + "/api/";


/**
 * Hàm được xử dụng để lấy về dữ liệu cho các layer đặc biệt được thêm vào bản đồ: Layer báo cáo 
 * @param {*} layer Lớp dữ liệu bản đồ 
 */
export const getLayersFromLayer = async (layer, isBuildMap = false) => {
    let layers = []
    if (layer.type_layer == 2) {
        if (isBuildMap) layers = [{ ...layer }]
        await getDynamicReport(layer.layer_id).then(cqlLayers => {
            cqlLayers.forEach(cqlLayer => {
                const el_layer = {
                    ...layer,
                }
                el_layer.cql = `subsystem_name='${cqlLayer}'`
                el_layer.name = cqlLayer
                el_layer.name_display = cqlLayer
                el_layer.id = uuidv4()
                layers.push(el_layer)
            })
        })
        return layers
    }
    else {
        layers = [{ ...layer }]
        return layers
    }
}


export const getGroupLayerDisplay = async (group_layer, isBuildMap = false) => {
    const rl = await Promise.all(group_layer.map(async (group) => {
        const currentGroup = ref({ ...group });
        const layers = group?.layers
        if (layers) {
            layers.forEach(async layer => {
                // Call to api
                const data = await getLayersFromLayer(layer, isBuildMap);
                currentGroup.value.layers = data;
            })
        }
        return currentGroup.value;
    }));
    return rl;
};

const getDynamicReport = async (layerId) => {
    let cqlLayers = []
    await useFetch(`${PROXY}/dynamic-report/get-dynamic-report/?model_dynamic_folder_id=${layerId}`).then(data => {
        cqlLayers = data?.extra_data.map(subSys => subSys)
    })
    return cqlLayers
}

export const getDynamicReportChartData = async (layerId) => {
    try {
        const data = await useFetch(`${PROXY}/dynamic-report/get-dynamic-report/?model_dynamic_folder_id=${layerId}`);
        const top5 = await useFetch(`${PROXY}/dynamic-report/${data.id}/get-top-5/`);
        const chartData = convertChartDataToList(top5)
        const timeRange = data.time_range
        return { timeRange: timeRange, chartData: chartData};
    } catch (error) {
        // Handle any errors that occurred during the fetch requests
        console.error(error);
        throw error;
    }
};

const convertChartDataToList = (chartData) => {
    const convertedList = []
    for (const [key, value] of Object.entries(chartData)) {
        let transformedData = {};
        transformedData.name = key;
        transformedData.data = value;
        convertedList.push(transformedData)
    }
    return convertedList
}