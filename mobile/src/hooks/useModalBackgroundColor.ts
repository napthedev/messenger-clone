import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useStore } from "../store";

export const useModalBackgroundColor = () => {
  const { setIsModalOpened } = useStore();

  useFocusEffect(
    useCallback(() => {
      setIsModalOpened(true);
      return () => setIsModalOpened(false);
    }, [setIsModalOpened])
  );
};
