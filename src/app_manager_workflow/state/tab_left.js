import { ref } from "vue";

const isContentVisible = ref(true);
const NavItems = ref([
  { key: 'detail', label: 'Chi tiết', icon: 'ri-information-line', active: true,  disabled: false },
  { key: 'edit-history', label: 'Lịch sử chỉnh sửa', icon: 'ri-history-line', active: false, disabled: false },
  { key: 'run-history', label: 'Lịch sử lượt chạy', icon: 'ri-time-line', active: false, disabled: false },
  { key: 'versions', label: 'Phiên bản', icon: 'ri-git-branch-line', active: false, disabled: false },
  { key: 'flow-summary', label: 'Tóm tắt thiết kế luồng', icon: 'ri-route-line', active: false, disabled: false },
]);

function selectItem(item) {
  NavItems.value.forEach(i => i.active = false);
  item.active = true;
}
const toggleContent = () => {
    isContentVisible.value = !isContentVisible.value;
}

export {
    isContentVisible,
    toggleContent,
    NavItems,
    selectItem
}