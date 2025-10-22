import { useFetch } from "@/helpers/api/api.js"
import { API_SERVER_URL } from "@/base/store/api/server_api.js"
import { ref } from "vue"

export const applications = ref([])
export const isLoadingApp = ref(false)
export const fullApplications = ref([])
export const getListApplications = async () => {
    resetApplications();
    isLoadingApp.value = true;
    
    await useFetch(API_SERVER_URL + '/user-apps/').then(data => {
        // Ensure we have an array; support APIs that wrap results
        const list = Array.isArray(data)
            ? data
            : (Array.isArray(data?.results) ? data.results : []);

        const reversed = list.slice().reverse();
        applications.value = formatListBlockApps(reversed)
        fullApplications.value = formatListBlockApps(reversed, true)
    })
    isLoadingApp.value = false
}

const formatListBlockApps = (parentApps, full) => {
    const results = []
    ;(parentApps || []).forEach(block => {
        const apps = Array.isArray(block?.apps) ? block.apps : []
        // Nếu không có app mà lấy full thì cho lấy
        if (full || apps.length) {
            const el = {
                id: block?.type?.id,
                title: block?.type?.name,
                listPage: formatListApplications(apps)
            }
            results.push(el)
        }
    })
    return results
}

const formatListApplications = (apps) => {
    const results = []
    ;(apps || []).forEach(app => {
        const el = {
            id: app.id,
            path: app.root_path,
            meta: {
                title: app.name,
                icon: app.icon ?? "ri-apps-2-line",
                name: app.name,
                backendOnly: !app.exist_frontend && app.exist_backend,
                exist_frontend: app.exist_frontend,
                exist_backend: app.exist_backend
            },
            props: {
                nameKCN: app.name
            }
        }
        results.push(el)
    });
    return results
}

export const resetApplications = () => {
    applications.value = []
    fullApplications.value = []
    isLoadingApp.value = false
}
