import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MessageType } from "server/src/message/message.service";
import { UserType } from "server/src/user/user.service";

import { NavigationProps } from "../../App";
import CustomImage from "../components/CustomImage";
import { useStore } from "../hooks/useStore";
import { imageProxy, imageProxyPlus } from "../utils/image";
import { uuid } from "../utils/uuid";

const windowWidth = Dimensions.get("window").width;

const ChatScreen: FC = () => {
  const route = useRoute();

  const { conversationId, otherUserInfo } = route.params as {
    conversationId: string;
    otherUserInfo: UserType;
  };

  const { user, socket } = useStore();

  const [inputValue, setInputValue] = useState("");

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation<NavigationProps>();

  const handleAddNewMessage = (type: "text" | "image", content: string) => {
    const newMessage = {
      id: uuid(),
      type,
      content: content,
      userId: user.id,
      conversationId,
      createdAt: new Date(),
    };
    setMessages((prev) =>
      [...prev, newMessage].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
    socket.emit("create-message", newMessage);
    setInputValue("");
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      handleAddNewMessage("text", inputValue.trim());
    }
  };

  useEffect(() => {
    socket.on("new-message", (data: any[]) => {
      setMessages((prev) =>
        [
          ...prev.filter(
            (item1) => !data.some((item2) => item1.id === item2.id)
          ),
          ...data,
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      setIsLoading(false);
    });

    socket.emit("join-room", { conversationId });

    return () => {
      socket.off("new-message");
    };
  }, [socket, conversationId]);

  useEffect(() => {
    AsyncStorage.setItem("current-conversation-id", conversationId);
  }, [conversationId]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => {
        return (
          <View className="flex-1">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Profile", { userId: otherUserInfo.id })
              }
              className="flex-row justify-between items-center"
            >
              <View className="flex-row items-center">
                <Image
                  className="rounded-full mr-3"
                  source={{
                    uri: imageProxy(otherUserInfo.picture),
                    width: 35,
                    height: 35,
                  }}
                />
                <View className="justify-center gap-[1px]">
                  <Text
                    numberOfLines={1}
                    className="text-white font-bold text-[16px] leading-[18px]"
                  >
                    {otherUserInfo.name}
                  </Text>
                  <Text className="text-[#6D6D6D] leading-[16px]">
                    Active now
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [navigation, otherUserInfo.picture, otherUserInfo.name, otherUserInfo.id]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });

    if (result?.assets?.[0]?.base64) {
      let bodyContent = new FormData();
      bodyContent.append("image", result.assets[0].base64);

      fetch(
        `https://api.imgbb.com/1/upload?key=${Constants.manifest.extra.imgbbAPIKey}`,
        {
          method: "POST",
          body: bodyContent,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          handleAddNewMessage("image", data.data.display_url);
        })
        .catch((err) => {
          console.log(err);
          Alert.alert("Failed to upload image");
        });
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          className="flex-1"
        >
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator />
            </View>
          ) : (
            <FlashList
              inverted
              data={messages}
              renderItem={({ item, index }) =>
                item.userId === user.id ? (
                  <View className="flex-row justify-end mb-[2px] px-2">
                    {item.type === "text" ? (
                      <View
                        className={`bg-[#4E5BF5] py-[6px] px-4 overflow-hidden rounded-[20px] ${
                          messages?.[index + 1]?.userId === item.userId
                            ? "rounded-tr-md"
                            : ""
                        } ${
                          messages?.[index - 1]?.userId === item.userId
                            ? "rounded-br-md"
                            : ""
                        }`}
                      >
                        <Text
                          className="text-white text-lg"
                          style={{ maxWidth: (windowWidth * 3) / 5 }}
                        >
                          {item.content}
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          navigation.navigate("ImageViewer", {
                            uri: item.content,
                          });
                        }}
                      >
                        <CustomImage
                          uri={imageProxyPlus(
                            item.content,
                            (windowWidth / 3) * 2,
                            500,
                            "inside"
                          )}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <View className="flex-row justify-start mb-[2px] px-2">
                    <View className="w-[44px]">
                      {messages?.[index - 1]?.userId !== item.userId && (
                        <Image
                          className="rounded-[40px]"
                          source={{
                            uri: imageProxy(otherUserInfo.picture),
                            width: 35,
                            height: 35,
                          }}
                        />
                      )}
                    </View>
                    {item.type === "text" ? (
                      <View
                        className={`bg-[#303030] py-[6px] px-4 overflow-hidden rounded-[20px] ${
                          messages?.[index + 1]?.userId === item.userId
                            ? "rounded-tl-md"
                            : ""
                        } ${
                          messages?.[index - 1]?.userId === item.userId
                            ? "rounded-bl-md"
                            : ""
                        }`}
                      >
                        <Text
                          className="text-white text-lg"
                          style={{ maxWidth: (windowWidth * 3) / 5 }}
                        >
                          {item.content}
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          navigation.navigate("ImageViewer", {
                            uri: item.content,
                          });
                        }}
                      >
                        <CustomImage
                          uri={imageProxyPlus(
                            item.content,
                            (windowWidth / 3) * 2,
                            500,
                            "inside"
                          )}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )
              }
              estimatedItemSize={40}
            />
          )}
        </TouchableWithoutFeedback>
        <View className="h-[66px] flex-row items-center gap-x-3 px-3 pt-2">
          <TouchableOpacity onPress={pickImageAsync} className="flex-shrink-0">
            <Ionicons name="ios-image" size={28} color="#2374E1" />
          </TouchableOpacity>
          <TextInput
            className="bg-[#303030] text-white rounded-full py-2 px-3 flex-1 overflow-hidden"
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis dolor non expedita. Nam numquam consequuntur laboriosam quibusdam! Quis dicta, repellendus obcaecati voluptates ipsum doloremque temporibus cupiditate. Possimus architecto aliquam delectus."
            style={{ fontSize: 20 }}
            placeholder="Aa"
            placeholderTextColor="#656568"
            value={inputValue}
            onChangeText={(value) => setInputValue(value)}
            onSubmitEditing={handleSubmit}
          />
          <TouchableOpacity onPress={handleSubmit} className="flex-shrink-0">
            <Ionicons name="ios-send" size={26} color="#2374E1" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
