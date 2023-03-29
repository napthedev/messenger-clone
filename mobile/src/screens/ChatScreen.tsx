import { useRoute } from "@react-navigation/native";
import { FC } from "react";
import { Text } from "react-native";

const ChatScreen: FC = () => {
  const route = useRoute();

  //@ts-ignore
  const { conversationId } = route.params;

  return (
    <>
      <Text className="text-white">Chat. Conversation: {conversationId}</Text>
    </>
  );
};

export default ChatScreen;
