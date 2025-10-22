// /callcenter/utils/api.js
import { useFetch } from "@/helpers/api/api.js";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import { errorToast } from "@/helpers/api/toastStyle";

export async function fetchCallToken() {
  try {
    const data = await useFetch(API_SERVER_URL + "/call-center/v1/token");
    if (data?.error) {
      errorToast(data?.msg);
      return null;
    }
    return data;
  } catch {
    errorToast("Lỗi không thể lấy call token!");
    return null;
  }
}
