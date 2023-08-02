export const filterKeys = (inputObject, keysToFilter) => {
  const filteredObject = {};
  for (const key in inputObject) {
    if (keysToFilter.includes(key)) {
      filteredObject[key] = inputObject[key];
    }
  }
  return filteredObject;
};
