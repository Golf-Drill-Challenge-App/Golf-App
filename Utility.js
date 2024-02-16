export const clampNumber = (num, a, b) =>
  Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
export function formatDate(unixTimestamp) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(unixTimestamp * 1000);

  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}, ${year}`;
}

export function numTrunc(value) {
  return parseFloat(value.toFixed(3));
}

export function createOutputData(inputValues, attemptData) {
  //Construct an array of each shot with keys, inputValues, and target Distances
  const outputData = inputValues.map((object, index) => {
    const shot = attemptData.shots[index];
    const shotNum = shot ? shot.shotNum : undefined;

    return { ...object, sid: shotNum };
  });

  console.log("Output Data: ", outputData);
}
