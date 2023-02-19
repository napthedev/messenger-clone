import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const client = axios.create({
  baseURL: Constants.manifest.extra.serverURL,
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers["authorization"] = `Bearer ${token}`;

  return config;
});

export default client;
