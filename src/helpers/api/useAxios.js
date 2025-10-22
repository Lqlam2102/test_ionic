import axios from "axios";
import axiosHttp from "@/helpers/api/axiosHttp.js";
import { errorToast, successToast } from "@/helpers/api/toastStyle";
import { getAccessToken } from "@/helpers/api/token.js"

// Hàm xử lý lỗi chung
const handleError = (err, isErrorToast) => {
  const status = err?.response?.status?.toString();
  const temErr = err?.response?.data ?? err;

  if (isErrorToast) {
    switch (status) {
      case "400":
        errorToast(temErr?.msg ?? temErr?.message ?? "Bad request");
        break;
      case "404":
        errorToast(temErr?.msg ?? temErr?.message ?? "404 not found");
        break;
      default:
        errorToast(isErrorToast);
        break;
    }
  }

  return {
    ...temErr,
    ok: false,
    error: true
  };
};

const API = () => {
  const call = async (url) => {
    try {
      const response = await axios.create({
        headers: {
          Authorization: getAccessToken(),
        },
      }).get(url);
      return { ...response.data, ok: true };
    } catch (err) {
      return handleError(err, true);
    }
  };

  const get = async (url, responseType = "json", isErrorToast) => {
    try {
      const response = await axiosHttp.get(url, { responseType });
      const data = await response.data;
      return data;
    } catch (err) {
      return handleError(err, isErrorToast);
    }
  };

  const post = async (url, dataPost, isSuccessToast = false, isErrorToast = false) => {
    try {
      const response = await axiosHttp.post(url, dataPost);
      if (isSuccessToast) successToast(isSuccessToast);
      return { ...response.data, ok: true };
    } catch (err) {
      return handleError(err, isErrorToast);
    }
  };

  const put = async (url, dataPost, isSuccessToast = false, isErrorToast = false) => {
    try {
      const response = await axiosHttp.put(url, dataPost);
      if (isSuccessToast) successToast(isSuccessToast);
      return { ...response.data, ok: true };
    } catch (err) {
      return handleError(err, isErrorToast);
    }
  };

  const patch = async (url, dataPost, isSuccessToast = false, isErrorToast = false) => {
    try {
      const response = await axiosHttp.patch(url, dataPost);
      if (isSuccessToast) successToast(isSuccessToast);
      return { ...response.data, ok: true };
    } catch (err) {
      return handleError(err, isErrorToast);
    }
  };

  const remove = async (url, isSuccessToast = false, isErrorToast = false) => {
    try {
      const response = await axiosHttp.delete(url);
      if (isSuccessToast) successToast(isSuccessToast);
      return { ...response.data, ok: true };
    } catch (err) {
      return handleError(err, isErrorToast);
    }
  };

  return { get, post, put, patch, remove, call };
};

export default API;
