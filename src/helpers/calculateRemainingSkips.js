const calculateRemainingSkips = (total, limit) => {
  const skipArray = [];
  let skip = limit;
  while (skip < total) {
    skipArray.push(skip);
    skip += limit;
  }
  return skipArray;
};

export default calculateRemainingSkips;
