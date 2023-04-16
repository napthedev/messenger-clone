import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResponseType } from "expo-auth-session";
import * as Facebook from "expo-auth-session/providers/facebook";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useStore } from "../hooks/useStore";
import axios from "../services/axios";

WebBrowser.maybeCompleteAuthSession();

const Login: FC = () => {
  const { setUser } = useStore();

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: Constants.manifest.extra.facebookAppId,
    expoClientId: Constants.manifest.extra.facebookAppId,
    responseType: ResponseType.Token,
    scopes: ["email", "public_profile"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const accessToken = response.authentication.accessToken;
      setIsLoggingIn(true);
      axios
        .post("/auth/login-or-register", { token: accessToken })
        .then(async (res) => {
          const jwtToken = res.data.token;
          await AsyncStorage.setItem("token", jwtToken);
          const { user } = (await axios.get("/auth/verify-token")).data;
          setUser(user);
        })
        .catch((error) => {
          setErrorMessage(
            error.response?.data?.message || "Something went wrong"
          );
        })
        .finally(() => {
          setIsLoggingIn(false);
        });
    }
  }, [response, setUser]);

  return (
    <SafeAreaView className="bg-dark flex-1 items-stretch justify-center">
      <View className="flex-1 items-center justify-center px-5">
        <Image
          className="h-[140px] w-[140px] mb-[40px]"
          source={require("../../assets/messenger.png")}
        />
        <Text className="text-white text-[28px] text-center font-bold">
          Log in or register
        </Text>
        <Text className="text-white text-[28px] text-center font-bold">
          with Facebook
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          className={`w-full mt-[40px] bg-primary rounded-md h-12 flex-row items-center ${
            isLoggingIn || !request ? "opacity-80" : ""
          }`}
          onPress={() => promptAsync()}
          disabled={isLoggingIn || !request}
        >
          {isLoggingIn ? (
            <ActivityIndicator className="pl-3" color="#ffffff" />
          ) : (
            <Image
              className="w-[35px] h-[35px] ml-2"
              source={require("../../assets/facebook-white.png")}
            />
          )}
          <View className="flex-1 flex-row justify-center items-center">
            <Text className="text-white text-center text-xl">
              Continue with Facebook
            </Text>
          </View>
        </TouchableOpacity>

        {!!errorMessage ? (
          <Text className="text-red-500 mt-2 text-lg">{errorMessage}</Text>
        ) : typeof response?.type !== "undefined" &&
          response?.type !== "success" ? (
          <Text className="text-red-500 mt-2 text-lg">
            {response?.type === "cancel"
              ? "Login canceled"
              : response?.type === "dismiss"
              ? "Login dismissed"
              : response?.type === "error"
              ? response?.error.message || "Error when login"
              : response?.type === "locked"
              ? "Login locked"
              : response?.type === "opened"
              ? "Login opened"
              : "Something went wrong"}
          </Text>
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Login;
