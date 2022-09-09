export const checkAnswers = (array1, array2) => {
  if (array1?.sort()?.join(",") === array2?.sort()?.join(",")) {
    return true;
  } else return false;
};
