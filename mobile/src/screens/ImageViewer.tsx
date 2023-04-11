import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";

import { imageProxy } from "../utils/image";

const windowWidth = Dimensions.get("window").width;

const ImageViewer: FC = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { uri } = route.params as {
    uri: string;
  };

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const downloadImage = async () => {
      try {
        const fileName = uri.replace(/^.*[\\/]/, "");
        let imageFullPathInLocalStorage =
          FileSystem.documentDirectory + fileName;

        if (Platform.OS === "android") {
          await MediaLibrary.requestPermissionsAsync(true).then((res) => {
            console.log(res.canAskAgain);
            if (!res.granted) throw new Error("No permission");
          });
        }

        await FileSystem.downloadAsync(
          imageProxy(uri),
          imageFullPathInLocalStorage
        );

        await MediaLibrary.saveToLibraryAsync(imageFullPathInLocalStorage);

        Alert.alert("Image saved successfully");
      } catch (error) {
        console.log(error);
        Alert.alert("Failed to save image");
      }
    };

    navigation.setOptions({
      headerRight: (props) => (
        <TouchableOpacity onPress={() => downloadImage()}>
          <Feather name="download" size={24} color={props.tintColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, uri]);

  return (
    <View className="flex-row flex-1 justify-center items-stretch">
      {!loaded && (
        <View className="flex-row justify-center">
          <ActivityIndicator />
        </View>
      )}
      <Image
        onLoad={() => {
          setLoaded(true);
        }}
        style={{ resizeMode: "contain" }}
        source={{ uri: imageProxy(uri), width: windowWidth, cache: "reload" }}
      />
    </View>
  );
};

export default ImageViewer;
