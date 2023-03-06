import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosLib from "axios";
import Constants from "expo-constants";

const axios = axiosLib.create({
  baseURL: Constants.manifest.extra.serverURL,
});

axios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers["authorization"] = `Bearer ${token}`;

  return config;
});

export default axios;
