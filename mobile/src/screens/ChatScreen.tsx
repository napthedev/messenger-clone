import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { FC, useEffect, useState } from "react";
import {
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
import { UserType } from "server/src/user/user.service";

import { NavigationProps } from "../../App";
import { useStore } from "../store";

const windowWidth = Dimensions.get("window").width;

const ChatScreen: FC = () => {
  const route = useRoute();

  //@ts-ignore
  const { conversationId, otherUserInfo } = route.params as {
    conversationId: string;
    otherUserInfo: UserType;
  };

  const { user } = useStore();

  const [messages, setMessages] = useState(
    new Array(30)
      .fill("")
      .map((_, index) =>
        index % 6 <= 2
          ? {
              id: index,
              type: "text",
              content: `Hello world ${index}`,
              userId: user.id,
            }
          : {
              id: index,
              type: "text",
              content: `Hello world ${index}`,
              userId: otherUserInfo.id,
            }
      )
      .reverse()
  );

  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => {
        return (
          <View className="flex-1">
            <TouchableOpacity
              onPress={() => {}}
              className="flex-row justify-between items-center"
            >
              <View className="flex-row items-center">
                <Image
                  className="rounded-full mr-3"
                  source={{
                    uri: otherUserInfo.picture,
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
  }, [navigation, otherUserInfo.picture, otherUserInfo.name]);

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={90}
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          className="flex-1"
        >
          <FlashList
            inverted
            data={messages}
            renderItem={({ item, index }) =>
              item.userId === user.id ? (
                <View className="flex-row justify-end mb-[2px] px-2">
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
                </View>
              ) : (
                <View className="flex-row justify-start mb-[2px] px-2">
                  <View className="w-[44px]">
                    {messages?.[index - 1]?.userId !== item.userId && (
                      <Image
                        className="rounded-[40px]"
                        source={{
                          uri: otherUserInfo.picture,
                          width: 35,
                          height: 35,
                        }}
                      />
                    )}
                  </View>
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
                </View>
              )
            }
            estimatedItemSize={40}
          />
        </TouchableWithoutFeedback>
        <View className="h-[66px] flex-row items-center gap-x-3 px-3 py-2">
          <TouchableOpacity>
            <FontAwesome name="camera" size={24} color="#2374E1" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ios-image" size={28} color="#2374E1" />
          </TouchableOpacity>
          <View className="flex-grow">
            <TextInput
              className="bg-[#303030] text-white rounded-full py-2 px-3"
              style={{ fontSize: 20 }}
              placeholder="Aa"
            />
          </View>
          <TouchableOpacity>
            <Ionicons name="ios-send" size={26} color="#2374E1" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
