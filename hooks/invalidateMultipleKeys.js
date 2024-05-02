export const invalidateMultipleKeys = (queryClient, invalidateKeys) => {
  console.log("Query Key Cache Invalidation Status:");
  queryClient.invalidateQueries({
    // used predicate as it seemed to be the best method to invalidate multiple query keys
    predicate: (query) => {
      for (let i = 0; i < query.queryKey.length; i++) {
        if (invalidateKeys[i] && invalidateKeys[i][0] === query.queryKey[0]) {
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
          console.log(invalidateKeys[i]);
          console.log(query.queryKey);
          console.log(checkLists(invalidateKeys[i], query.queryKey));
          return checkLists(invalidateKeys[i], query.queryKey);
        }
      }
    },
  });
};
