/* eslint-disable no-unreachable */
import Token from "../../helpers/user/user";
import API from "../../helpers/api/useAxios.js";
import { setPermissionApp } from "@/helpers/state/dataUser.js";

const checkLogout = (isPublic, next) => {
  Token().removeUser();
  if (isPublic) {
    next('/'); // Chuyển hướng đến trang chính
  } else {
    next('/login'); // Chuyển hướng đến trang đăng nhập
  }
};

async function checkManage(matched, next, isLogin = false) {
  const pathRaw = matched[0]?.path
  if (!pathRaw) {
    return next({ path: "/error-404" })
  }

  const path = pathRaw.endsWith("/")
    ? pathRaw.slice(0, -1)
    : pathRaw

  const { can_access } = await API().get(`cpuia/?app=${path}`)
  setPermissionApp({ can_access })

  if (!can_access) {
    if (!isLogin) {
      return next("/login")
    }
    return next({ path: "/error-403" })
  }

  // Trong trường hợp can_access === true, ta vẫn phải gọi next()
  return next()
}


export { checkLogout, checkManage };
