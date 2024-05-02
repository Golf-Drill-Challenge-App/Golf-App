import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { RefreshControl } from "react-native";
import { invalidateMultipleKeys } from "~/hooks/invalidateMultipleKeys";

// extra props reason: https://stackoverflow.com/questions/69659094/react-native-custom-refreshcontrol-component-doesnt-work-in-flatlist-on-android
function RefreshInvalidate({ invalidateKeys, ...props }) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const refresh = async () => {
      // keep refresh spinner spinning, until the query invalidation completes
      await invalidateMultipleKeys(queryClient, invalidateKeys);
      setRefreshing(false);
    };
    refresh();
  }, [queryClient]);
  return (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} {...props} />
  );
}

export default RefreshInvalidate;
