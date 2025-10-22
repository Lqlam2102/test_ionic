import { ref, reactive, computed } from "vue";
import API from "@/helpers/api/useAxios.js";
import { errorToast, successToast } from "@/helpers/api/toastStyle";
import debounce from "lodash/debounce";

// UI
const showModal = ref(false);
const isLoading = ref(false);
const submitting = ref(false);

const kpiData = ref({
    campaign_name: "",
    total_kpi: 0,
    departments: [],
    dept_kpi_id: "",
    campaign_id: "",
    department_id: "",
    department_name: "",
    total_kpi_department: 0,
    users: [],
});
const isManager = computed(() => !!kpiData.value.dept_kpi_id);
//type là all, year, month
const typeTimeFilter = ref("month");
// Mặc định năm hiện tại
const pickedYear = ref(new Date().getFullYear())

// Mặc định tháng–năm hiện tại, dạng "MM"
const pad = (n) => String(n).padStart(2, '0')
const pickedMonth = ref(
    `${pad(new Date().getMonth() + 1)}`
)
const form = reactive({
    campaign_id: "",
    department_id: "",
    kpi: null,
});
const formUser = reactive({
    department_kpi_id: "",
    user_id: "",
    kpi: null,
});
const loadData = debounce(
    (campaign_id = kpiData.value.campaign_id) => {
        isLoading.value = true;
        form.campaign_id = campaign_id;
        // Xác định giá trị timeline dựa trên typeTimeFilter
        let timeline = new URLSearchParams();
        if (typeTimeFilter.value === "year") {
            timeline.append("timeline", pickedYear.value);
        } else if (typeTimeFilter.value === "month") {
            timeline.append("timeline", `${pickedYear.value}-${pickedMonth.value}`);
        }
        API()
            .get(`campaign-kpi/${campaign_id}/summary?${timeline.toString()}`)
            .then((response) => {
                kpiData.value.campaign_name = response?.campaign_name;
                kpiData.value.total_kpi = response?.total_kpi;
                kpiData.value.dept_kpi_id = response?.dept_kpi_id;
                formUser.department_kpi_id = response?.dept_kpi_id;
                kpiData.value.campaign_id = response?.campaign_id ?? kpiData.value.campaign_id;
                kpiData.value.department_id = response?.department_id;
                kpiData.value.department_name = response?.department_name;
                kpiData.value.total_kpi_department = response?.total_kpi_department;
                kpiData.value.users = response?.users ?? [];
                kpiData.value.departments = mergeDepartments(response?.departments ?? []);
            })
            .catch((error) => {
                console.error("Error assigning KPI:", error);
            })
            .finally(() => {
                isLoading.value = false;
            });
    }, 300);
const removeKPI = async (department_id) => {
    try {
        isLoading.value = true;
        const res = await API().remove(
            `${isManager.value ? "user" : "department"}-kpi/${department_id}/`
        );
        if (!res.ok) {
            throw new Error("Xoá KPI không thành công");
        }
        successToast("Xoá KPI thành công!");
        loadData(form.campaign_id);
    } catch (error) {
        errorToast("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
        isLoading.value = false;
    }
}

const validateForm = () => {
    let payload, totalKPI, totalAllocated;
    if (isManager.value) {
        totalKPI = kpiData.value.total_kpi_department;
        totalAllocated = kpiData.value.users.reduce((acc, user) => {
            return acc + (user.kpi || 0);
        }, 0);
        if (
            !formUser.user_id ||
            !formUser.department_kpi_id ||
            formUser.kpi === null
        ) {
            errorToast("Vui lòng điền đầy đủ thông tin.");
            return;
        } else {
            payload = {
                department_kpi_id: formUser.department_kpi_id,
                user_id: formUser.user_id,
                kpi: formUser.kpi,
            };
        }
    } else if (!form.campaign_id || !form.department_id || form.kpi === null) {
        errorToast("Vui lòng điền đầy đủ thông tin.");
        return;
    } else {
        totalKPI = kpiData.value.total_kpi;
        totalAllocated = kpiData.value.departments.reduce((acc, dept) => {
            return acc + (dept.kpi || 0);
        }, 0);
        payload = {
            campaign_id: form.campaign_id,
            department_id: form.department_id,
            kpi: form.kpi,
        };
    }
    if (totalAllocated + payload.kpi > totalKPI) {
        errorToast(
            "Tổng KPI đã vượt quá giới hạn cho phép. Cần dưới " +
            (totalKPI - totalAllocated) +
            "."
        );
        return;
    }
    return payload
}

const postKPI = async () => {
    const payload = await validateForm()
    if (!payload) return
    submitting.value = true;
    try {
        await API().post(
            isManager.value ? "user-kpi/" : "department-kpi/",
            payload
        );

        // Thông báo thành công, reset form…
        successToast("Lưu KPI thành công!");
        loadData(form.campaign_id);
    } catch (err) {
        errorToast("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
        submitting.value = false;
        showModal.value = false;
    }
}

function mergeDepartments(departments) {
    const merged = {};

    departments.forEach((dept) => {
        if (merged[dept.department_id]) {
            // Nếu đã tồn tại department_id, cộng dồn KPI
            merged[dept.department_id].kpi += dept.kpi;
        } else {
            // Nếu chưa tồn tại, thêm mới
            merged[dept.department_id] = { ...dept };
        }
    });

    // Chuyển từ object về array
    return Object.values(merged);
}

export {
    showModal, isLoading, submitting, kpiData, form,
    formUser, loadData, removeKPI, postKPI, isManager,
    pickedYear, pickedMonth, typeTimeFilter
}