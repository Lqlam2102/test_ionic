import { ref } from "vue"
import API from "@/app_manage_dynamic_api/helper/api/useAxios";
import { ConfigSystem } from "@/base/store/api/server_api";

const defaultCompanyInfor = {
    id: "",
    created_date: "",
    updated_date: "",
    is_deleted: false,
    code: "",
    name: "",
    slug: "",
    short_name: "",
    description: "",
    photo: "",
    founding_date: "",
    representative: "",
    representative_title: "",
    address: "",
    tax_code: "",
    phone_number: null,
    fax: "",
    email: "",
    website: "",
    organization_head: null,
    social_network_link: {},
};

// ✅ Reactive state
const CompanyInfor = ref({ ...defaultCompanyInfor });

// ✅ Hàm reset thông tin
const resetCompanyInfor = () => {
    CompanyInfor.value = { ...defaultCompanyInfor };

    // Nếu muốn reset luôn ConfigSystem
    ConfigSystem.value.name = "DTWIN CONFIG";
    ConfigSystem.value.logo = require("@/assets/images/logo/metadatawin.png");
    ConfigSystem.value.config.contact = {
        address: "",
        website: "",
        phone: "0123.456.789",
        email: "your_organization@gmail.com",
        fax: "Your Company Tax Number",
    };
    ConfigSystem.value.config.title_vn = "TÊN TỔ CHỨC CỦA BẠN";
    ConfigSystem.value.config.title_en = "Your Organization Name - YON";
};

// ✅ Hàm lấy thông tin công ty
const getCompanyInfor = async () => {
    if (!process.env.VUE_APP_ID_ORGANIZATION) return;

    try {
        const data = await API().get(`organization/${process.env.VUE_APP_ID_ORGANIZATION}`);

        if (!data) return;

        CompanyInfor.value = { ...data };

        if (data.photo) {
            changeFavicon(data.photo);
        }

        ConfigSystem.value.name = CompanyInfor.value.name || "DTWIN CONFIG";
        ConfigSystem.value.logo =
            CompanyInfor.value.photo || require("@/assets/images/logo/metadatawin.png");

        ConfigSystem.value.config.contact.address = CompanyInfor.value.address;
        ConfigSystem.value.config.contact.website = CompanyInfor.value.website;
        ConfigSystem.value.config.contact.phone = CompanyInfor.value.phone_number || "0123.456.789";
        ConfigSystem.value.config.contact.email = CompanyInfor.value.email || "your_organization@gmail.com";
        ConfigSystem.value.config.contact.fax = CompanyInfor.value.fax || "Your Company Tax Number";

        ConfigSystem.value.config.title_vn = CompanyInfor.value.short_name || "TÊN TỔ CHỨC CỦA BẠN";
        ConfigSystem.value.config.title_en = CompanyInfor.value.name || "Your Organization Name - YON";
    } catch (error) {
        console.error(error);
    }
};

function changeFavicon(newIconUrl) {
    const favicon = document.getElementById('favicon');
    if (favicon) {
        favicon.href = newIconUrl;
    }
}


export { CompanyInfor, getCompanyInfor, resetCompanyInfor }