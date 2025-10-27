<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonInput, IonButton, IonItem, IonNote, IonText, IonIcon } from "@ionic/vue";
import { eye, eyeOff } from "ionicons/icons";
import Lottie from "../widgets/lottie.vue";
import animationData from "../widgets/rhvddzym.json";
import animationData2 from "../widgets/lupuorrc.json";
import { errorToast } from "@/helpers/api/toastStyle";
import { usePost } from "@/helpers/api/api";
import { ConfigSystem } from "@/base/store/api/server_api";

const router = useRouter();

// State
const userEA = ref("");
const attemptSubmit = ref(false);
const stateSite = ref(1);
const idRequest = ref("");
const confirmCode = ref("");
const verifyState = ref(false);
const isExits = ref(false);
const hashCode = ref("");
const newPass = ref({
  pass: "",
  confirm: "",
});
const showPass = ref({
  pass: false,
  repass: false,
});

// Computed
const missingEA = computed(() => userEA.value === "");
const missingConfirmCode = computed(() => confirmCode.value === "");
const missingNewPass = computed(() => newPass.value.pass === "");
const missingCofirmNewPass = computed(() => newPass.value.confirm === "");
const passNotMatch = computed(() => {
  if (missingCofirmNewPass.value) return false;
  return newPass.value.confirm !== newPass.value.pass;
});

// Methods
const handleSubmit = async () => {
  attemptSubmit.value = true;
  if (missingEA.value) return;

  const regexExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let item = new FormData();
  if (regexExp.test(userEA.value)) {
    item.append("email", userEA.value);
  } else {
    item.append("username", userEA.value);
  }

  try {
    const response = await usePost("forgot-password", item);
    const data = await response.json();
    if (response.status === 202) {
      idRequest.value = data.id_request;
      stateSite.value = 2;
      attemptSubmit.value = false;
    } else if (response.status === 400 && Object.values(data)[0]?.includes("Tài khoản không tồn tại.")) {
      isExits.value = true;
    } else {
      errorToast("Đã xảy ra lỗi. Vui lòng thử lại sau!");
    }
  } catch (error) {
    errorToast("Đã xảy ra lỗi. Vui lòng thử lại sau!");
  }
};

const handleConfirm = async () => {
  attemptSubmit.value = true;
  if (missingConfirmCode.value) return;

  let item = new FormData();
  item.append("id", idRequest.value);
  item.append("code", confirmCode.value);

  try {
    const response = await usePost("confirm-code-forgot", item);
    const data = await response.json();
    if (response.status === 400) {
      verifyState.value = true;
    } else {
      hashCode.value = data.hash;
      stateSite.value = 3;
      attemptSubmit.value = false;
    }
  } catch (error) {
    errorToast("Đã xảy ra lỗi. Vui lòng thử lại sau!");
  }
};

const handleNewPass = async () => {
  attemptSubmit.value = true;
  if (missingNewPass.value || missingCofirmNewPass.value || passNotMatch.value) return;

  let item = new FormData();
  item.append("hash", hashCode.value);
  item.append("new_password", newPass.value.confirm);

  try {
    const response = await usePost("reset-password", item);
    if (response.status === 400) {
      errorToast("Đã xảy ra lỗi. Vui lòng thử lại sau!");
    } else {
      attemptSubmit.value = false;
      stateSite.value = 4;
      router.push({ name: "Login" });
    }
  } catch (error) {
    errorToast("Đã xảy ra lỗi. Vui lòng thử lại sau!");
  }
};

// Watch
watch([() => newPass.value.pass, () => newPass.value.confirm, userEA, confirmCode], () => {
  attemptSubmit.value = false;
});

// Lottie animations
const defaultOptions = { animationData };
const defaultOptions2 = { animationData: animationData2 };
</script>

<style scoped>
.auth-page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.nft-hero {
  position: relative;
  padding: 2rem;
  background: linear-gradient(135deg, #0ab39c, #405189);
  border-radius: 8px;
}
.footer {
  padding-top: 1rem;
}
</style>

<!-- src/app_auth/reset/cover.vue -->
<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="auth-page-wrapper">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="12" size-lg="6">
              <div class="nft-hero">
                <div class="ion-margin-bottom">
                  <router-link to="/" class="d-block">
                    <img :src="ConfigSystem.logo" alt="Logo" style="height: 40px;" />
                  </router-link>
                </div>
                <div class="ion-text-center ion-margin-top">
                  <lottie
                    class="avatar-xl"
                    colors="primary:#0ab39c,secondary:#405189"
                    :options="defaultOptions"
                    :height="120"
                    :width="120"
                  />
                </div>
              </div>
            </ion-col>
            <ion-col size="12" size-lg="6">
              <div v-if="stateSite === 1" class="ion-padding">
                <h5 class="ion-text-primary">Quên mật khẩu?</h5>
                <ion-text color="medium">
                  <p>Đừng lo, chúng tôi sẽ hỗ trợ cho bạn</p>
                </ion-text>

                <ion-text color="warning" class="ion-text-center ion-margin">
                  <p>Nhập thông tin và hướng dẫn sẽ được gửi đến bạn!</p>
                </ion-text>

                <div class="ion-margin-top">
                  <ion-item :class="{ 'ion-invalid': attemptSubmit && missingEA || attemptSubmit && isExits }">
                    <ion-input
                      label="Nhập tài khoản hoặc email"
                      label-placement="floating"
                      placeholder="Nhập tài khoản hoặc email đăng ký"
                      v-model="userEA"
                    ></ion-input>
                    <ion-note v-if="attemptSubmit && missingEA">
                      Tài khoản hoặc email không được để trống.
                    </ion-note>
                    <ion-note v-if="attemptSubmit && isExits">
                      Không tìm thấy tài khoản hoặc email.
                    </ion-note>
                  </ion-item>
                  <ion-button
                    expand="block"
                    color="success"
                    class="ion-margin-top"
                    @click="handleSubmit"
                  >
                    Gửi yêu cầu
                  </ion-button>
                </div>
                <div class="ion-text-center ion-margin-top">
                  <ion-text color="medium">
                    <p>
                      Bạn đã nhớ mật khẩu?
                      <router-link
                        :to="{ name: 'Login' }"
                        class="fw-semibold text-primary text-decoration-underline"
                      >
                        Đăng nhập
                      </router-link>
                    </p>
                  </ion-text>
                </div>
              </div>

              <div v-else-if="stateSite === 2" class="ion-padding">
                <ion-text color="secondary" class="fw-semibold fst-italic">
                  <p>
                    Một mã khôi phục tài khoản được gửi tới Email đăng ký của bạn.<br />
                    Vui lòng kiểm tra Email và nhập mã để tiếp tục!
                  </p>
                </ion-text>
                <div class="ion-margin-vertical">
                  <ion-item :class="{ 'ion-invalid': attemptSubmit && missingConfirmCode || attemptSubmit && verifyState }">
                    <ion-input
                      label="Nhập mã khôi phục"
                      label-placement="floating"
                      placeholder="Nhập mã khôi phục"
                      v-model="confirmCode"
                    ></ion-input>
                    <ion-note v-if="attemptSubmit && missingConfirmCode">
                      Vui lòng nhập mã khôi phục
                    </ion-note>
                    <ion-note v-if="attemptSubmit && verifyState">
                      Mã khôi phục không đúng. Vui lòng kiểm tra lại
                    </ion-note>
                  </ion-item>
                  <ion-button
                    expand="block"
                    color="primary"
                    @click="handleConfirm"
                  >
                    Tiếp tục
                  </ion-button>
                </div>
                <ion-text color="medium" class="fst-italic">
                  <p>
                    Chưa nhận được mã?
                    <span
                      class="fw-semibold text-primary text-decoration-underline cursor-pointer"
                      @click="handleSubmit"
                    >
                      Nhấn vào đây
                    </span>
                    để nhận lại mã
                  </p>
                </ion-text>
              </div>

              <div v-else-if="stateSite === 3" class="ion-padding">
                <ion-text color="secondary" class="fw-semibold fst-italic">
                  <p>Nhập mật khẩu mới cho tài khoản của bạn</p>
                </ion-text>
                <div class="ion-margin-top">
                  <ion-item :class="{ 'ion-invalid': attemptSubmit && missingNewPass }">
                    <ion-input
                      label="Mật khẩu mới"
                      label-placement="floating"
                      :type="showPass.pass ? 'text' : 'password'"
                      placeholder="Nhập mật khẩu mới"
                      v-model="newPass.pass"
                    ></ion-input>
                    <ion-button
                      fill="clear"
                      @click="showPass.pass = !showPass.pass"
                    >
                      <ion-icon :icon="showPass.pass ? eyeOff : eye"></ion-icon>
                    </ion-button>
                    <ion-note v-if="attemptSubmit && missingNewPass">
                      Mật khẩu mới không được để trống
                    </ion-note>
                  </ion-item>

                  <ion-item :class="{ 'ion-invalid': attemptSubmit && (missingCofirmNewPass || passNotMatch) }">
                    <ion-input
                      label="Nhập lại mật khẩu mới"
                      label-placement="floating"
                      :type="showPass.repass ? 'text' : 'password'"
                      placeholder="Nhập lại mật khẩu mới"
                      v-model="newPass.confirm"
                    ></ion-input>
                    <ion-button
                      fill="clear"
                      @click="showPass.repass = !showPass.repass"
                    >
                      <ion-icon :icon="showPass.repass ? eyeOff : eye"></ion-icon>
                    </ion-button>
                    <ion-note v-if="attemptSubmit && missingCofirmNewPass">
                      Nhập lại mật khẩu mới không được để trống
                    </ion-note>
                    <ion-note v-if="attemptSubmit && passNotMatch">
                      Hai mật khẩu không trùng khớp
                    </ion-note>
                  </ion-item>

                  <ion-button
                    expand="block"
                    color="success"
                    class="ion-margin-top"
                    @click="handleNewPass"
                  >
                    Xác nhận
                  </ion-button>
                </div>
              </div>

              <div v-else class="ion-padding ion-text-center">
                <div class="ion-margin-bottom">
                  <lottie
                    colors="primary:#0ab39c,secondary:#405189"
                    :options="defaultOptions2"
                    :height="120"
                    :width="120"
                  />
                </div>
                <h5>Tài khoản của bạn đã được đổi mật khẩu thành công!</h5>
                <ion-text color="medium">
                  <p>Bây giờ bạn có thể đăng nhập tài khoản của mình bằng mật khẩu mới!</p>
                </ion-text>
                <router-link :to="{ name: 'Login' }">
                  <ion-button color="success" class="ion-margin-top">
                    Đăng nhập ngay
                  </ion-button>
                </router-link>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>

        <footer class="footer ion-padding">
          <ion-grid>
            <ion-row>
              <ion-col size="12" class="ion-text-center">
                <ion-text color="medium">
                  <p>&copy; {{ new Date().getFullYear() }} DTwin Team. Design & Develop by DTwin Team</p>
                </ion-text>
              </ion-col>
            </ion-row>
          </ion-grid>
        </footer>
      </div>
    </ion-content>
  </ion-page>
</template>

