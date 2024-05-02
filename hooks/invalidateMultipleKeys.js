/*
general reference: https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation

General Info (see comments in code for more):
invalidateKeys input is supplied as a 2d array (list of lists), where each child list is query key, e.g.

  const invalidateKeys = [
    ["user", { userId }],
    ["attempts", { userId }],
    ["userEmail", userId],
    ["drillInfo"],
  ];

Note that query.queryKey is equivalent to invalidateKeys[i].
This is because query.queryKey is a 1D array (just the query key), and is called recursively for each active query key
for the current page you are on (in the mobile app).

Any mentions of "active Query Key" below, such as in input arguments of checkLists function, can be read as equivalent to
query.queryKey
*/

export const invalidateMultipleKeys = (queryClient, invalidateKeys) => {
  console.log("Query Key Cache Invalidation Status:");
  queryClient.invalidateQueries({
    predicate: (query) => {
      for (let i = 0; i < query.queryKey.length; i++) {
        // If the first query key argument (e.g. "user") does not match up between invalidateKeys[i] and query.queryKey,
        // it's safe to assume there will not be a match between the 2 keys, and we don't have to check the rest.
        if (invalidateKeys[i] && invalidateKeys[i][0] === query.queryKey[0]) {
          function checkLists(invalidateKey, activeQueryKey) {
            for (let invalidateKeyArg of invalidateKey) {
              if (typeof invalidateKeyArg === "string") {
                // If arg of invalidateKeys[i] is a string, check if it also exists (as a string) in query.queryKey
                if (!activeQueryKey.includes(invalidateKeyArg)) {
                  return false;
                }
              } else if (typeof invalidateKeyArg === "object") {
                // If arg of invalidateKeys[i] is an object, check if it exists as a subset of another (object) arg in
                // query.queryKey
                let found = false;
                for (let activeQueryKeyArg of activeQueryKey) {
                  if (isObjectSubset(invalidateKeyArg, activeQueryKeyArg)) {
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
