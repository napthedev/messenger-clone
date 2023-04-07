import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useStore } from "./useStore";

export const useModalBackgroundColor = () => {
  const { setIsModalOpened } = useStore();

  useFocusEffect(
    useCallback(() => {
      setIsModalOpened(true);
      return () => setIsModalOpened(false);
    }, [setIsModalOpened])
  );
};
