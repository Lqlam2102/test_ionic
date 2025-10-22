import Token from "@/helpers/user/user.js";
import { errorToast } from "@/helpers/api/toastStyle";
import { usePost } from "@/helpers/api/api.js";

export const loginFunction = async function (username, password) {
    let status = 0;
    let formSubmit = new FormData();
    formSubmit.append("username", username);
    formSubmit.append("password", password);
    let isLogin = false
    await usePost("login", formSubmit)
        .then((data) => {
            status = data.status;
            return data.json();
        })
        .then((res) => {
            if (!res) {
                errorToast("Hệ thống đang bảo trì, vui lòng thử lại sau!");
                isLogin = false;
            }
            if (
                status === 400 &&
                Object.values(res)[0]?.includes(`User not authenticate`)
            ) {
                isLogin = false;
            }
            if (res?.access_token) {
                Token()
                    .setUser(res.access_token)
                    .then(() => {
                        isLogin = true
                    });
                isLogin = true
            } else {
                errorToast("Tài khoản hoặc mật khẩu không chính xác!");
                isLogin = false
            }
        });
    return isLogin
}