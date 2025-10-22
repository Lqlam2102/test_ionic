<script>
import animationData from "./widgets/spxnqpau.json";
import Lottie from "./widgets/lottie.vue";

export default {
    data() {
        return {
            defaultOptions: { animationData: animationData },
        };
    },
    components: {
        lottie: Lottie
    }
};
</script>

<template>
    <div class="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
        <div class="bg-overlay"></div>
        <div class="auth-page-content overflow-hidden pt-lg-5">
            <b-container>
                <b-row class="justify-content-center">
                    <b-col xl="5">
                        <b-card no-body class="overflow-hidden">
                            <b-card-body class="p-4">
                                <div class="text-center">
                                    <lottie colors="primary:#405189,secondary:#0ab39c" :options="defaultOptions"
                                        style="height:7.5rem;width:7.5rem;" />
                                    <h1 class="text-primary mb-4">Oops !</h1>
                                    <h4 class="text-uppercase">Permission denied 😭</h4>
                                    <p class="text-muted mb-4">Bạn không có quyền truy cập vào ứng dụng này!</p>
                                    <router-link to="/system" class="btn btn-success"><i class="mdi mdi-home me-1"></i>Trở về trang chủ</router-link>
                                    &nbsp;
                                    <router-link to="/login" class="btn btn-success"><i class="ri-login-box-line"></i>&nbsp;  Đăng nhập tài khoản khác</router-link>
                                </div>
                            </b-card-body>
                        </b-card>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>