import axios from "axios";
import { SERVER_URL } from "@/helpers/utils/config_system.js"
import { getAccessToken } from "@/helpers/api/token.js"

export const BASE_URL = SERVER_URL;

export default axios.create({
  baseURL: BASE_URL + "/api",
  headers: {
    Authorization: getAccessToken(),
  },
});
