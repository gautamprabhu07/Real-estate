import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://real-estate-2eqg.onrender.com",
  //http://localhost:8800/api
  withCredentials: true,
});

export default apiRequest;