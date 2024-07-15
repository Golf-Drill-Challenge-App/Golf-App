/*
general reference: https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation

General Info (see comments in code for more):
invalidateKeys input is supplied as a 2d array (list of lists), where each child list is query key, e.g.

  const invalidateKeys = [
    ["userInfo", { userId }],
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

const isObjectSubset = (subset, superset) => {
  if (typeof superset !== "object" || superset === null) {
    return false;
  }

  for (const key in subset) {
    if (!(key in superset && superset[key] === subset[key])) {
      return false;
    }
  }
  return true;
};

const checkLists = (invalidateKey, activeQueryKey) => {
  for (const invalidateKeyArg of invalidateKey) {
    if (typeof invalidateKeyArg === "string") {
      if (!activeQueryKey.includes(invalidateKeyArg)) {
        return false;
      }
    } else if (typeof invalidateKeyArg === "object") {
      let found = false;
      for (const activeQueryKeyArg of activeQueryKey) {
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
};

export const invalidateMultipleKeys = async (queryClient, invalidateKeys) => {
  try {
    console.log("invalidateKeys requested: ", invalidateKeys);
    console.log("These query keys (cache) were successfully invalidated:");

    await queryClient.invalidateQueries({
      predicate: (query) => {
        for (const invalidateKey of invalidateKeys) {
          if (invalidateKey && invalidateKey[0] === query.queryKey[0]) {
            if (checkLists(invalidateKey, query.queryKey)) {
              console.log(query.queryKey);
              return true;
            }
          }
        }
        return false;
      },
    });
  } catch (e) {
    console.log("Error in invalidateMultipleKeys: ", e);
    throw e; // Rethrow the error to handle it at the caller's level if needed
  }
};
