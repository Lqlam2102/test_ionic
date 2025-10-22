import userState from "@/helpers/state/dataUser.js";
import { checkLogout, checkManage } from "./page_case.js";

function getFullCasePath(paths) {
  let extendPaths = []
  paths.forEach(originPath => {
    const extendPs = [originPath, `/${originPath}`, `/${originPath}/`]
    extendPaths = [...extendPaths, ...extendPs]
  })
  return extendPaths
}

const RouterCheck = async (to, from, next) => {
  const isUserLogined = !!userState.value?.id;
  const { name, matched } = to;

  // const systemPath = getFullCasePath(['system']);
  const authPath = getFullCasePath(['login', 'register', 'forgot']);
  const errorsPath = getFullCasePath(['error-403', 'error-404']);
  const logoutPath = getFullCasePath(['logout']);

  const autoPassPath = [...authPath, ...errorsPath];
  const authRoutes = ["Login", "Register", "ResetPassword"];
  const needsPermission = matched.some(record => record.meta.cpuiaPermission);

  // 1. Logout
  if (logoutPath.includes(to.fullPath)) {
    return checkLogout(true, next);
  }

  // 2. Root path "/"
  if (to.path === "/") {
    const rootMatched = matched[0]?.path;
    if (!isUserLogined) {
      return next("/login");
    }
    if (!rootMatched) {
      return next("/system");
    }
    return checkManage(matched, next, isUserLogined);
  }

  // 3. Các path không cần login
  if (autoPassPath.includes(to.path)) {
    return next();
  }

  // 4. Nếu chưa login
  if (!isUserLogined) {
    return next("/login");
  }

  // 5. Đã login mà đang ở auth routes
  if (authRoutes.includes(name)) {
    return next("/");
  }

  // 6. Xử lý permission
  if (needsPermission) {
    return checkManage(matched, next, isUserLogined);
  }

  // 7. Các route bình thường khác
  return next();
};



export { RouterCheck };
