<script>
import { errorToast } from "@/helpers/api/toastStyle";
import { usePost } from "@/helpers/api/api.js";
import VerifyEmailComponent from "../VerifyEmailComponent.vue";
import Token from "../../helpers/user/user.js";
import { ConfigSystem } from "@/base/store/api/server_api";
import { SERVER_URL } from "@/helpers/utils/config_system.js";
import { GoogleLogin } from "vue3-google-login";
import axios from "axios";

// Import Ionic components
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonNote,
  IonSpinner,
  IonFooter,
  IonToolbar
} from '@ionic/vue';

export default {
  components: {
    "verify-email": VerifyEmailComponent,
    GoogleLogin,
    IonPage,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonNote,
    IonSpinner,
    IonFooter,
    IonToolbar
  },
  data() {
    return {
      ConfigSystem: ConfigSystem,
      form: {
        account: "",
        password: "",
      },
      attemptSubmit: false,
      UserID: "",
      isVerify: false,
      stateVerify: false,
      checkNextPage: "/",
      passToogle: false,
      isSubmit: false,
      // clientId: "28313156361-u55bfbp6cr876830sr3q693vo6b35o87.apps.googleusercontent.com", // Thay bằng Client ID của bạn
    };
  },
  computed: {
    missingUname: function () {
      return this.form.account === "";
    },
    missingPass: function () {
      return this.form.password === "";
    },
  },
  methods: {
    async callback(response) {
      const vm = this;
      let pramsAll = undefined;
      if (this.$route.query.redirect) {
        vm.checkNextPage = this.$route.query.redirect;

        if (this.$route.query) {
          pramsAll = this.$route.query;
        }
      }
      console.log("Google Login Callback:", response);
      //  Gửi token Google đến máy chủ Django để xác minh
      try {
        // Gửi token lên backend Django để xác thực
        const res = await axios.post(`${SERVER_URL}/oauth/google/`, {
          token: response.credential,
        });

        // Set user token vào localStorage
        if (res.data?.access_token) {
          Token()
            .setUser(res.data.access_token)
            .then(() => {
              vm.$router.push({
                path: vm.checkNextPage,
                params: { ...pramsAll },
              });
            });
        } else {
          errorToast("Đăng nhập thất bại!");
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    handleSubmit: async function (event) {
      const vm = this;
      let pramsAll = undefined;
      if (this.$route.query.redirect) {
        vm.checkNextPage = this.$route.query.redirect;

        if (this.$route.query) {
          pramsAll = this.$route.query;
        }
      }
      this.isSubmit = true; // Bắt đầu trạng thái loading
      if (vm.missingUname || vm.missingPass) {
        event.preventDefault();
        this.isSubmit = false; // Dừng loading nếu không hợp lệ
      } else {
        vm.attemptSubmit = true;
        let status = 0;
        let formSubmit = new FormData();
        formSubmit.append("username", vm.form.account);
        formSubmit.append("password", vm.form.password);
        try {
          await usePost("login", formSubmit)
            .then((data) => {
              status = data.status;
              return data.json();
            })
            .then((res) => {
              this.isSubmit = false; // Kết thúc loading sau khi xử lý xong
              if (!res) {
                errorToast("Hệ thống đang bảo trì, vui lòng thử lại sau!");
                return;
              }
              if (
                status === 400 &&
                Object.values(res)[0]?.includes(`User not authenticate`)
              ) {
                vm.UserID = res.user_id;
                vm.isVerify = true;
                return;
              }
              if (res?.access_token) {
                Token()
                  .setUser(res.access_token)
                  .then(() => {
                    vm.$router.push({
                      path: vm.checkNextPage,
                      params: { ...pramsAll },
                    });
                  });
              } else {
                errorToast("Tài khoản hoặc mật khẩu không chính xác!");
              }
            });
        } catch (error) {
          console.error("Login failed:", error);
          this.isSubmit = false; // Dừng loading trong trường hợp lỗi
        }
      }
    },

    async handleResendVerify() {
      const vm = this;
      let item = new FormData();
      await usePost(`user/${vm.UserID}/send-new-authentication-code/`, item)
        .then((data) => data.json())
        .then(() => {
          vm.stateVerify = true;
        });
    },
  },
  watch: {
    "form.account": function () {
      this.attemptSubmit = false;
    },
    "form.password": function () {
      this.attemptSubmit = false;
    },
  },
};
</script>

<template>
  <ion-page>
    <ion-content class="auth-page-wrapper">
      <div class="auth-bg-cover">
        <div class="bg-overlay"></div>
        <div class="auth-page-content">
          <ion-grid>
            <ion-row class="ion-justify-content-center">
              <ion-col size="12" size-lg="8">
                <ion-card>
                  <ion-row>
                    <ion-col size="12" size-lg="6">
                      <div class="nft-hero">
                        <div class="bg-overlay opacity-50"></div>
                        <div class="hero-content">
                          <div class="logo-section">
                            <router-link :to="{ path: '/' }" class="d-block">
                              <img :src="ConfigSystem.logo" alt="" height="40" />
                            </router-link>
                          </div>
                            <div class="quotes-section">
                            <div class="mb-3">
                              <i class="ri-double-quotes-l quotes-icon"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ion-col>

                    <ion-col size="12" size-lg="6">
                      <div class="login-form" v-if="!stateVerify">
                        <div class="form-header">
                          <h2 class="text-primary">Chào mừng bạn quay trở lại!</h2>
                          <p class="text-muted">
                            Vui lòng nhập thông tin đăng nhập để tiếp tục.
                          </p>
                        </div>

                        <div class="form-content">
                          <form>
                            <ion-item>
                              <ion-label position="stacked">Tài khoản</ion-label>
                              <ion-input
                                type="text"
                                :class="{
                                  'ion-invalid': attemptSubmit && missingUname,
                                }"
                                placeholder="Nhập thông tin tài khoản"
                                v-model="form.account"
                              ></ion-input>
                              <template v-slot:error>
                                <ion-note v-if="attemptSubmit && missingUname">
                                  Vui lòng nhập tài khoản
                                </ion-note>
                              </template>
                            </ion-item>

                            <ion-item>
                              <ion-label position="stacked">Mật khẩu</ion-label>
                              <ion-input
                                :type="passToogle ? 'text' : 'password'"
                                :class="{
                                  'ion-invalid': attemptSubmit && missingPass,
                                }"
                                placeholder="Nhập mật khẩu"
                                v-model="form.password"
                                @keyup.enter="handleSubmit"
                              ></ion-input>
                              <template v-slot:end>
                                <ion-button
                                  fill="clear"
                                  @click="passToogle = !passToogle"
                                >
                                  <ion-icon
                                    :name="passToogle ? 'eye-off' : 'eye'"
                                  ></ion-icon>
                                </ion-button>
                              </template>
                              <template v-slot:error>
                                <ion-note v-if="attemptSubmit && missingPass">
                                  Vui lòng nhập mật khẩu
                                </ion-note>
                              </template>
                            </ion-item>

                            <div class="forgot-password">
                              <router-link
                                :to="{ name: 'Forgot' }"
                                class="text-muted"
                              >
                                Quên mật khẩu?
                              </router-link>
                            </div>

                            <p v-if="isVerify" class="verify-message">
                              Tài khoản của bạn cần xác thực Email để đăng nhập!<br />
                              <span
                                class="verify-link"
                                @click="handleResendVerify"
                              >
                                Xác thực tài khoản
                              </span>
                              hoặc đăng nhập với tài khoản khác
                            </p>

                            <ion-button
                              expand="block"
                              :disabled="isSubmit"
                              @click.prevent="handleSubmit"
                              class="login-button"
                            >
                              <ion-spinner
                                v-if="isSubmit"
                                name="crescent"
                                class="me-2"
                              ></ion-spinner>
                              {{ isSubmit ? "Đang xử lý..." : "Đăng nhập" }}
                            </ion-button>
                          </form>

                          <div class="google-login">
                            <GoogleLogin :redirect="true" :callback="callback" />
                          </div>
                        </div>

                        <div class="register-link">
                          <p>
                            Bạn chưa có tài khoản ?
                            <router-link
                              :to="{ name: 'Register' }"
                              class="fw-semibold text-primary"
                            >
                              Đăng ký
                            </router-link>
                          </p>
                        </div>
                      </div>

                      <div class="verify-form" v-else>
                        <div class="form-header">
                          <h2 class="text-primary">Chào mừng bạn quay trở lại!</h2>
                          <p class="text-muted">
                            Vui lòng xác thực tài khoản để tiếp tục.
                          </p>
                        </div>
                        <verify-email :idUser="UserID"></verify-email>
                      </div>
                    </ion-col>
                  </ion-row>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </div>

      <ion-footer>
        <ion-toolbar>
          <div class="text-center">
            <p>
              &copy; {{ new Date().getFullYear() }} DTwin Team. Design &
              Develop by DTwin Team
            </p>
          </div>
        </ion-toolbar>
      </ion-footer>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.auth-page-wrapper {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-bg-cover {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.auth-page-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
}

.nft-hero {
  background-image: url("../assets/bg_login3.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 400px;
  position: relative;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 20px;
}

.logo-section {
  margin-bottom: 20px;
}

.quotes-section {
  margin-top: auto;
}

.quotes-icon {
  font-size: 3rem;
  color: #4caf50;
}

.login-form,
.verify-form {
  padding: 20px;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h2 {
  color: #1976d2;
  margin-bottom: 10px;
}

.form-content {
  margin-bottom: 20px;
}

.forgot-password {
  text-align: right;
  margin-bottom: 20px;
}

.verify-message {
  color: #f44336;
  font-weight: 600;
  margin: 15px 0;
  text-align: center;
}

.verify-link {
  color: #1976d2;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
}

.login-button {
  margin-top: 20px;
  --background: #4caf50;
  --color: white;
}

.google-login {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}

.register-link a {
  color: #1976d2;
  text-decoration: underline;
  font-weight: 600;
}

.text-primary {
  color: #1976d2 !important;
}

.text-muted {
  color: #6c757d !important;
}

.text-center {
  text-align: center;
}

.d-block {
  display: block;
}

.me-2 {
  margin-right: 8px;
}

.mb-3 {
  margin-bottom: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .auth-bg-cover {
    padding: 10px;
  }
  
  .nft-hero {
    min-height: 200px;
    margin-bottom: 20px;
  }
  
  .login-form,
  .verify-form {
    padding: 15px;
  }
}

/* Ensure Ionic components are visible */
ion-page {
  display: block;
}

ion-content {
  display: block;
}

ion-card {
  margin: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

ion-item {
  --background: transparent;
  --border-color: #e0e0e0;
  --border-width: 1px;
  --border-style: solid;
  --border-radius: 8px;
  margin-bottom: 16px;
}

ion-input {
  --padding-start: 12px;
  --padding-end: 12px;
}

ion-button {
  --border-radius: 8px;
  height: 48px;
  font-weight: 600;
}
</style>