<template>
    <div class="position-relative">
        <p v-if="searchText">Từ khóa - <span><b>{{ searchText }}</b></span> - Không phù hợp với kết quả nào!</p>
        <p v-else>Không có kết quả nào!</p>
        <p>Đề xuất:</p>
        <ul>
            <li>Chắc chắn rằng tất cả từ khóa đều đúng chính tả.</li>
            <li>Hãy thử các từ khóa khác nhau.</li>
            <li>Thử tìm kiếm với từ khóa chung hơn.</li>
        </ul>
    </div>
</template>
<script>
export default {
    name: "notMatchSearchComponent",
    props: {
        searchText: {
            type: String,
            default: ""
        }
    }
};
</script>