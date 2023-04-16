import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosLib from "axios";
import Constants from "expo-constants";

import { StorageKeys } from "../utils/async-storage";

const axios = axiosLib.create({
  baseURL: Constants.manifest.extra.serverURL,
});

axios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(StorageKeys.authToken);
  if (token) config.headers["authorization"] = `Bearer ${token}`;

  return config;
});

export default axios;
