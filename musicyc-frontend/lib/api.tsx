import axios from "axios";

export const api = axios.create({
  baseURL: "http://172.20.10.2:3000/api/",
  timeout: 50000,
});
