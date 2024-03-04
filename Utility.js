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
  return value === undefined ? "aaaaaaa" : parseFloat(value.toFixed(3));
}

export function refToID(ref) {
  return ref["_key"] ? ref["_key"]["path"]["segments"].at(-1) : "bad ref";
}

export function getUnique(array, field) {
  const uniqueMap = new Map();
  array.forEach((element) => {
    const keyValue = element[field];
    if (!uniqueMap.has(keyValue)) {
      uniqueMap.set(keyValue, element);
    }
  });
  return Array.from(uniqueMap.values());
}

export function calculateAverageProxToHole(drillSubmissions) {
  const userAverages = [];
  drillSubmissions.forEach((submission) => {
    const userId = submission.userId;
    let totalProximity = 0;
    submission.shots.forEach((shot) => {
      const proximity = Math.sqrt(
        Math.pow(Math.abs(shot.distance - shot.target) * 3, 2) +
          Math.pow(shot.sideLanding, 2),
      );
      totalProximity += proximity;
    });
    const averageProximity =
      Math.round((totalProximity / submission.shots.length) * 10) / 10;

    if (userAverages.length === 0) {
      userAverages.push({
        attempts: [averageProximity],
        totalSubmissions: 1,
        userId: userId,
      });
    } else {
      var userIdx = -1;
      for (let i = 0; i < userAverages.length; i++) {
        if (userAverages[i].userId === userId) {
          userIdx = i;
          break;
        }
      }

      if (userIdx >= 0) {
        userAverages[userIdx].attempts.push(averageProximity);
        userAverages[userIdx].totalSubmissions++;
      } else {
        userAverages.push({
          attempts: [averageProximity],
          totalSubmissions: 1,
          userId: userId,
        });
      }
    }
  });

  return userAverages;
}

export function takeBestScore(userAverages) {
  const bestSubmissions = [];
  userAverages.forEach((user) => {
    var bestScore = Number.MAX_VALUE;
    user.attempts.forEach((attempt) => {
      if (attempt < bestScore) {
        bestScore = attempt;
      }
    });
    bestSubmissions.push({
      user: user.userId,
      score: bestScore,
    });
  });

  return bestSubmissions;
}

export function createOutputData(inputValues, attemptData) {
  //Construct an array of each shot with keys, inputValues, and target Distances
  const outputData = inputValues.map((object, index) => {
    const shot = attemptData.shots[index];
    const shotNum = shot ? shot.shotNum : undefined;

    return { ...object, sid: shotNum };
  });

  //console.log("Output Data: ", outputData);
}
