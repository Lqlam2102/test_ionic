<template>
  <swiper
    :slidesPerView="slidesPer"
    :spaceBetween="10"
    :centeredSlides="true"
    :autoplay="{
      delay: 2500,
      disableOnInteraction: false,
    }"
    :pagination="{
      clickable: true,
    }"
    :navigation="true"
    :modules="modules"
    class="mySwiper"
  >
    <!-- Lặp qua mảng modoValue để hiển thị ảnh -->
    <swiper-slide class="h-100" v-for="image in modoValue" :key="image.id">
      <img :src="image.image" alt="Slide Image" />
    </swiper-slide>
  </swiper>
</template>

<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import required modules
import { Autoplay, Pagination, Navigation } from "swiper";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    modoValue: {
      type: Array,
      required: true, // Đảm bảo mảng ảnh được truyền vào là bắt buộc
    },
    slidesPer: {
      type: Number,
      default: 1
    },
  },
  setup() {
    return {
      modules: [Autoplay, Pagination, Navigation],
    };
  },
};
</script>
<style scoped>
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 250px;
  object-fit: cover; /* Giữ ảnh vừa khung */
}
</style>
