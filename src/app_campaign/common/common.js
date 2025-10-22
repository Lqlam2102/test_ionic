function checkLinkMapShare(input = '') {
    if (!input) return
    // Kiểm tra nếu input chứa URL Google Maps dạng chia sẻ
    const isSharedLink = input.startsWith("https://maps.app.goo.gl/");

    // Kiểm tra nếu input chứa đoạn iframe nhúng
    const isIframeEmbed = input.includes("<iframe") && input.includes("src=\"https://www.google.com/maps/embed?");

    if (isSharedLink) {
        return "Shared Link";
    } else if (isIframeEmbed) {
        return "Iframe Embed";
    } else {
        return "Invalid Input";
    }
}

const convertSharedLinkToEmbed = (link = '') => {
    if (link.startsWith("https://maps.app.goo.gl/")) {
        // Cần API thực tế để chuyển đổi hoặc sửa đổi link tại đây
        const googleMapsBaseEmbed = "https://www.google.com/maps/embed?q=";
        const extractedLocation = link.split("/").pop(); // Tạm lấy phần cuối để minh họa
        return `${googleMapsBaseEmbed}${extractedLocation}`;
    }
    return null;
}
function setField(icon, label, valueFn) {
    return {
        icon,
        label,
        value: valueFn,
    };
}
// Hàm định dạng ngày tháng
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const fieldsView = [
    setField("ri-calendar-2-line", "Ngày đăng", (data) =>
        formatDate(data.created_date)
    ),
    setField("ri-stock-line", "Trạng thái", (data) => data.status_display),
    setField("ri-database-line", "Hình thức làm việc", (data) => data.type_display),
    setField("ri-calendar-line", "Ngày bắt đầu", (data) =>
        formatDate(data.start_date)
    ),
    setField("ri-calendar-check-line", "Ngày kết thúc", (data) =>
        formatDate(data.end_date)
    ),
    setField(
        "bi-briefcase-fill",
        "Vị trí tuyển dụng",
        (data) => data.recruitment_position
    ),
    setField(
        "ri-team-line",
        "Số lượng cần tuyển",
        (data) => data.number_needed
    ),
    setField("bi-tools", "Kỹ năng yêu cầu", (data) => data.skills),
];
function getSrcYoutube(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    const ID = (match && match[2].length === 11) ? match[2] : null
    return 'https://www.youtube.com/embed/' + ID
}


export { checkLinkMapShare, convertSharedLinkToEmbed, fieldsView, setField, formatDate, getSrcYoutube }