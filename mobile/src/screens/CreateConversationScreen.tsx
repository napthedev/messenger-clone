import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { UsersType } from "server/src/user/user.service";

import { NavigationProps } from "../../App";
import { useModalBackgroundColor } from "../hooks/useModalBackgroundColor";
import { useStore } from "../hooks/useStore";
import axios from "../services/axios";
import { imageProxy } from "../utils/image";

const CreateConversationScreen: FC = () => {
  useModalBackgroundColor();

  const navigation = useNavigation<NavigationProps>();

  const { user } = useStore();

  const { data, isLoading, isError } = useQuery<UsersType>(
    ["all-users-except-current"],
    async () => (await axios.get("/user/all-users-except-current")).data
  );

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          disabled={isCreating || !selectedUser}
          onPress={() => {
            setIsCreating(true);
            axios
              .post("/conversation/create", { otherUserId: selectedUser })
              .then((res) => {
                navigation.goBack();
                navigation.navigate("Chat", {
                  conversationId: res.data.id,
                  otherUserInfo: res.data.userOnConversation.find(
                    (item) => item.user.id !== user.id
                  ),
                });
              })
              .catch(() => {
                Alert.alert("Failed to create conversation");
              })
              .finally(() => setIsCreating(false));
          }}
          title="Create"
        />
      ),
    });
  }, [selectedUser, navigation, isCreating, user.id]);

  return (
    <View className="flex-1 bg-dark">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#fff" />
        </View>
      ) : isError ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-center text-3xl text-red-500">Error</Text>
        </View>
      ) : (
        <View className="flex-1">
          <FlashList
            extraData={selectedUser}
            data={data}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  onPress={() =>
                    setSelectedUser(selectedUser === item.id ? null : item.id)
                  }
                  className="flex-row justify-between items-center px-4 py-3 gap-3 border-b border-b-[#333333]"
                >
                  <View className="flex-row items-center">
                    <Image
                      className="rounded-full mr-3"
                      source={{
                        uri: imageProxy(item.picture),
                        width: 55,
                        height: 55,
                      }}
                    />
                    <View className="justify-center">
                      <Text className="text-white font-bold text-xl">
                        {item.name}
                      </Text>
                    </View>
                  </View>
                  {selectedUser === item.id && (
                    <AntDesign name="check" size={30} color="#2374E1" />
                  )}
                </TouchableOpacity>
              </View>
            )}
            estimatedItemSize={79}
          />
        </View>
      )}
      {isCreating && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#00000080",
          }}
        >
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

export default CreateConversationScreen;
