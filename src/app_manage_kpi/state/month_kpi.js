import { ref, computed } from "vue";
import API from "@/helpers/api/useAxios.js";
import { Vietnamese } from "flatpickr/dist/l10n/vn";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import { errorToast, successToast } from "@/helpers/api/toastStyle";
const initialKpiData = {
    campaign_name: "",
    total_kpi: 0,
    departments: [],
    dept_kpi_id: "",
    campaign_id: "",
    department_id: "",
    department_name: "",
    total_kpi_department: 0,
    users: [],
};
const isLoading = ref(true);
const isCanAddKpi = ref(false);
const showModal = ref(false);

const picked = ref(`${String(new Date().getMonth() + 1).padStart(2, '0')}.${new Date().getFullYear()}`);// mặc định là tháng hiện tại
const kpiData = ref({
    ...initialKpiData
});
const isManager = computed(() => !!kpiData.value.dept_kpi_id);

const form = ref({
    department_id: "",
    user_id: '',
    kpi: "",
});
const resetForm = ({
    department_id = "",
    user_id = '',
    kpi = "",
} = {}) => {
    form.value.department_id = department_id;
    form.value.user_id = user_id;
    form.value.kpi = kpi;
}

const config = {
    inline: true,
    plugins: [
        new monthSelectPlugin({
            shorthand: false, // true để hiển thị "Th1", "Th2"…
            dateFormat: "m.Y", // giá trị lưu: "07.2025"
            altFormat: "F Y", // hiển thị: "July 2025"
            theme: "light", // giao diện tối
        }),
    ],
    onChange(_, dateStr) {
        picked.value = dateStr;
        loadData();
    },
    locale: Vietnamese,
};
function resetKpiData() {
    // Dùng spread để clone object, tránh thay đổi tham chiếu
    kpiData.value = {
        ...initialKpiData,
        // campaign_id: kpiData.value.campaign_id,
        // campaign_name: kpiData.value.campaign_name,
        // dept_kpi_id: kpiData.value.dept_kpi_id,
        // department_id: kpiData.value.department_id,
        // department_name: kpiData.value.department_name,
    };
}
function loadData(campaign_id = kpiData.value.campaign_id,) {
    isLoading.value = true;
    if (!campaign_id) {
        isLoading.value = false;
        return
    }
    const params = new URLSearchParams({
        timeline: convertToYearMonth(picked.value),
    });
    fetchKpiSummary(campaign_id, params)
}

async function fetchKpiSummary(campaign_id = kpiData.value.campaign_id, params) {
    try {
        const response = await API().get(`campaign-kpi/${campaign_id}/summary?${params.toString()}`);
        if (response?.error) {
            isCanAddKpi.value = false;
            throw new Error(response?.detail);
        }
        isCanAddKpi.value = true;

        // Tính tổng KPI từ departments
        const departments = response?.departments ?? [];
        const totalKpiFromDepartments = departments.reduce((sum, dept) => sum + (dept.kpi || 0), 0);

        // Tính tổng KPI từ users
        const users = response?.users ?? [];
        const totalKpiFromUsers = users.reduce((sum, user) => sum + (user.kpi || 0), 0);

        // Cập nhật kpiData với giá trị mặc định nếu không có dữ liệu
        kpiData.value = {
            campaign_name: response?.campaign_name || "Không có tên chiến dịch",
            total_kpi: totalKpiFromDepartments || 0, // Tính tổng từ departments
            departments: departments.length ? departments : [], // Mặc định là mảng rỗng
            dept_kpi_id: response?.dept_kpi_id || "",
            campaign_id: response?.campaign_id || campaign_id,
            department_id: response?.department_id || "",
            department_name: response?.department_name || "Không có tên phòng ban",
            users: users.length ? users : [], // Mặc định là mảng rỗng
            total_kpi_department: totalKpiFromUsers || 0, // Tính tổng từ users
        };
    } catch (err) {
        errorToast(err?.message ?? err);
        console.error(err);
        resetKpiData();
    } finally {
        resetForm();
        isLoading.value = false;
    }
}


const removeKPI = async (department_id,) => {
    if (!department_id) {
        isLoading.value = false;
        errorToast("Có lỗi xảy ra, vui lòng thử lại.");
        return
    }
    try {
        isLoading.value = true;
        const res = await API().remove(
            `${isManager.value ? "user" : "department"}-kpi/${department_id}/`
        );
        if (!res.ok) {
            throw new Error("Xoá KPI không thành công");
        }
        successToast("Xoá KPI thành công!");
        loadData();
    } catch (error) {
        errorToast("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
        isLoading.value = false;
    }
}
function convertToYearMonth(input) {
    const [month, year] = input.split('.')
    return `${year}-${month.padStart(2, '0')}`
}

const postKPI = (campaign_id = kpiData.value.campaign_id, department_kpi_id = kpiData.value.dept_kpi_id) => {
    switch (isManager.value) {
        case true:
            if (!form.value.user_id) {
                errorToast("Vui lòng chọn người dùng!");
                return;
            }
            break
        default:
            if (!form.value.department_id) {
                errorToast("Vui lòng chọn phòng ban!");
                return
            }
    }
    const payload = isManager.value ? new URLSearchParams({
        department_kpi_id: department_kpi_id,
        user_id: form.value.user_id,
        kpi: form.value.kpi,
    }) : new URLSearchParams({
        campaign_id: campaign_id,
        department_id: form.value.department_id,
        kpi: form.value.kpi,
        timeline: convertToYearMonth(picked.value),
    })
    showModal.value = false;
    isLoading.value = true;
    API()
        .post(`${isManager.value ? "user" : "department"}-kpi/`, payload.toString())
        .then((res) => {
            if (res.ok) {
                loadData();
            }
        });
}
export { isLoading, showModal, isCanAddKpi, picked, kpiData, form, config, loadData, removeKPI, postKPI, isManager }