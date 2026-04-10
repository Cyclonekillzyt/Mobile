import axios from "axios";

export const api = axios.create({
  baseURL: "http://172.20.10.4:3000/api/",
  timeout: 5000,
});