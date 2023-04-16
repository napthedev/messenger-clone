import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { FC, useCallback } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { useStore } from "../hooks/useStore";
import { StorageKeys } from "../utils/async-storage";
import { imageProxy } from "../utils/image";

const SettingsScreen: FC = () => {
  const { setIsModalOpened, setUser, user } = useStore();

  useFocusEffect(
    useCallback(() => {
      setIsModalOpened(true);
      return () => setIsModalOpened(false);
    }, [setIsModalOpened])
  );

  const handleSignOut = async () => {
    await AsyncStorage.removeItem(StorageKeys.authToken);
    setUser(null);
  };

  return (
    <>
      <View className="flex-1 items-stretch bg-[#222]">
        <View className="items-center">
          <Image
            className="rounded-full"
            source={{ uri: imageProxy(user.picture), width: 90, height: 90 }}
          />
          <Text className="text-xl font-bold text-white mt-3 mb-6">
            {user.name}
          </Text>
        </View>

        <View className="mx-6">
          <TouchableOpacity
            className="flex-row items-center justify-between rounded-md px-4 py-[14px] bg-dark-lightened"
            onPress={handleSignOut}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-[#DB7964] items-center justify-center mr-2">
                <Entypo name="log-out" size={18} color="white" />
              </View>
              <Text className="text-white text-xl">Sign out</Text>
            </View>
            <Entypo name="chevron-right" size={24} color="#575757" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default SettingsScreen;
