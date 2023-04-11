import { FC, useEffect, useState } from "react";
import { Image } from "react-native";

interface CustomImageProps {
  uri: string;
}

const CustomImage: FC<CustomImageProps> = ({ uri }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    Image.getSize(uri, (width, height) => {
      setWidth(width);
      setHeight(height);
    });
  }, [uri]);

  return <Image className="rounded-md" source={{ uri, width, height }} />;
};

export default CustomImage;
