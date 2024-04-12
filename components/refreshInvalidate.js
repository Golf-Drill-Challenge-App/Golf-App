import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { RefreshControl } from "react-native";

// extra props reason: https://stackoverflow.com/questions/69659094/react-native-custom-refreshcontrol-component-doesnt-work-in-flatlist-on-android
function RefreshInvalidate({ queryKeys, ...props }) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const refresh = async () => {
      await queryClient.invalidateQueries({
        // used predicate as it seemed to be the best method to invalidate multiple query keys
        predicate: (query) => {
          for (let i = 0; i < query.queryKey.length; i++) {
            if (queryKeys[i] && queryKeys[i][0] === query.queryKey[0]) {
              function checkLists(firstList, secondList) {
                // Check each item in the first list
                for (let item of firstList) {
                  if (typeof item === "string") {
                    // If item is a string, check if it exists in the second list
                    if (!secondList.includes(item)) {
                      return false;
                    }
                  } else if (typeof item === "object") {
                    // If item is an object, check if it exists as a subset in the second list
                    let found = false;
                    for (let obj of secondList) {
                      if (isObjectSubset(item, obj)) {
                        found = true;
                        break;
                      }
                    }
                    if (!found) {
                      return false;
                    }
                  }
                }
                return true;
              }

              function isObjectSubset(subset, superset) {
                // Check if superset is an object
                if (typeof superset !== "object" || superset === null) {
                  return false;
                }

                // Check if each key-value pair in the subset exists in the superset
                for (let key in subset) {
                  if (!(key in superset && superset[key] === subset[key])) {
                    return false;
                  }
                }
                return true;
              }
              console.log(queryKeys[i]);
              console.log(query.queryKey);
              console.log(checkLists(queryKeys[i], query.queryKey));
              return checkLists(queryKeys[i], query.queryKey);
            }
          }
        },
      });
      setRefreshing(false);
    };
    refresh();
  }, [queryClient]);
  return (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} {...props} />
  );
}

export default RefreshInvalidate;
