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
    http.post(`/logout/`);
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
          await res.json().then((res) => {
            newUser = {
              ...res,
              token: user,
              isLogin: true,
            };
          });
          await getCompanyInfor()
          await getListApplications();
        } else {
          if (navigate) {
            // location.replace(`/account?next=${navigate}`);
            return;
          }
        }
      } catch (error) {
        return
      }
      userState.value = { ...newUser };
      return newUser;
    }
  };

  /*const getPermissionRole = async () => {
        const getCurrentUser = getUser();
    }*/

  return {
    getUser,
    setUser,
    removeUser,
    /*getPermissionRole*/
  };
};

export default Token;
