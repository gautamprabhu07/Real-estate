import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://localhost:8800/api",
  //https://real-estate-2eqg.onrender.com/api
  withCredentials: true,
});

export default apiRequest;