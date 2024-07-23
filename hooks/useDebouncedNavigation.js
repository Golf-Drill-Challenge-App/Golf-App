import { router } from "expo-router";
import { useCallback } from "react";
import { debounce } from "underscore";

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useDebouncedNavigation = () =>
  useCallback(
    debounce(
      (href) => {
        router.push(href);
      },
      1000,
      true,
    ),
    [],
  );
