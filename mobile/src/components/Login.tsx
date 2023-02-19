import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { removeAccents } from "../utils/text";

const Login: FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: "",
      username: "",
      password: "",
    },
  });
  const onSubmit = (data: { username: string; password: string }) => {
    // setIsLoading(true);
    // setErrorMessage("");
    // signInOrRegister(data.username, data.password)
    //   .then(async ({ token }) => {
    //     await AsyncStorage.setItem("token", token);
    //     setUsername(data.username);
    //   })
    //   .catch((err) => {
    //     setErrorMessage(err?.response?.data?.message || "Something went wrong");
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  };

  return (
    <SafeAreaView className="bg-dark flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback
          className="flex-1 items-center justify-center"
          onPress={Keyboard.dismiss}
        >
          <View className="items-center justify-center flex-1 px-5">
            <Image
              className="h-[140px] w-[140px] mt-[60px] mb-[40px]"
              source={require("../../assets/messenger.png")}
            />
            <Text className="text-white text-[28px] text-center font-bold">
              Log in or register with an username and password
            </Text>

            <Controller
              control={control}
              rules={{
                required: {
                  message: "Your display name is required",
                  value: true,
                },
                minLength: {
                  message: "Must be at least 6 characters",
                  value: 6,
                },
                maxLength: {
                  message: "Must not be more than 64 characters",
                  value: 64,
                },
                validate: {
                  valid: (v) =>
                    /^[a-zA-Z ]*$/gm.test(removeAccents(v)) ||
                    "Display name must contain only characters and spaces",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="w-full mt-5">
                  <TextInput
                    className="w-full bg-dark-lightened rounded-lg px-3 text-[18px] h-[48px] text-white"
                    placeholderTextColor="#929297"
                    placeholder="Display Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                </View>
              )}
              name="displayName"
            />
            {errors.displayName && (
              <Text className="text-red-500 mt-2 mb-1">
                {errors.displayName.message}
              </Text>
            )}

            <Controller
              control={control}
              rules={{
                required: { message: "Your username is required", value: true },
                minLength: {
                  message: "Must be at least 6 characters",
                  value: 6,
                },
                maxLength: {
                  message: "Must not be more than 18 characters",
                  value: 18,
                },
                pattern: {
                  message: "Username must not contain space",
                  value: /^[^\s]+$/gm,
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="w-full mt-2">
                  <TextInput
                    className="w-full bg-dark-lightened rounded-lg px-3 text-[18px] h-[48px] text-white"
                    placeholderTextColor="#929297"
                    placeholder="Username"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    onSubmitEditing={handleSubmit(onSubmit)}
                    autoCapitalize="none"
                  />
                </View>
              )}
              name="username"
            />
            {errors.username && (
              <Text className="text-red-500 mt-2 mb-1">
                {errors.username.message}
              </Text>
            )}

            <Controller
              control={control}
              rules={{
                required: { message: "Your password is required", value: true },
                minLength: {
                  message: "Must be at least 6 characters",
                  value: 6,
                },
                maxLength: {
                  message: "Must not be more than 18 characters",
                  value: 18,
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="w-full mt-2">
                  <TextInput
                    className="w-full bg-dark-lightened rounded-lg px-3 text-[18px] h-[48px] text-white"
                    placeholderTextColor="#929297"
                    placeholder="Password"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    onSubmitEditing={handleSubmit(onSubmit)}
                    autoCapitalize="none"
                  />
                </View>
              )}
              name="password"
            />

            {errors.password && (
              <Text className="text-red-500 mt-2 mb-1">
                {errors.password.message}
              </Text>
            )}

            <TouchableOpacity
              activeOpacity={0.7}
              className="w-full mt-2 bg-blue rounded-md h-11 justify-center items-center"
              onPress={handleSubmit(onSubmit)}
            >
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <Text className="text-white text-center text-xl">
                  Sign in or register
                </Text>
              )}
            </TouchableOpacity>

            {errorMessage && (
              <Text className="text-red-500 mt-2 text-lg">{errorMessage}</Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
