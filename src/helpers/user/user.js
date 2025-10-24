// helpers/user/user.js
import { BASE_URL } from "../api/axiosHttp.js";
import http from "../api/axiosHttp.js";
import userState from "../state/dataUser.js";
import { resetCompanyInfor, getCompanyInfor } from "./company.js";
import { resetApplications, getListApplications } from "./applications.js";

const Token = () => {
  async function setUser(user) {
    localStorage.setItem("auth", JSON.stringify(user));
    return await getUser();
  }

  function removeUser() {
    http.post(`/logout/`).catch((err) => console.error("Logout error:", err));
    localStorage.removeItem("auth");
    userState.value = {};
    resetCompanyInfor();
    resetApplications();
  }

  const getUser = async function (navigate = "") {
    const tokenString = localStorage.getItem("auth");
    let user = null;
    try {
      user = JSON.parse(tokenString);
    } catch (_) {
      user = null;
    }

    if (user) {
      http.defaults.headers.common["Authorization"] = `Bearer ${user}`;
      http.defaults.headers.Authorization = `Bearer ${user}`;
      let newUser;
      try {
        const res = await fetch(BASE_URL + "/api/user/current-user/", {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${user}`,
          },
        });
        if (res.status === 200) {
          const data = await res.json();
          newUser = {
            ...data,
            token: user,
            isLogin: true,
          };
          await getCompanyInfor();
          await getListApplications(); // Gọi API /api/user-apps/
        } else if (res.status === 401) {
          console.log("Unauthorized user, clearing token");
          localStorage.removeItem("auth");
          userState.value = {};
          if (navigate) {
            window.location.href = `/login?next=${navigate}`;
          }
          return null;
        }
      } catch (error) {
        console.error("getUser error:", error);
        return null;
      }
      userState.value = { ...newUser };
      return newUser;
    }
    return null;
  };

  return {
    getUser,
    setUser,
    removeUser,
  };
};

export default Token;