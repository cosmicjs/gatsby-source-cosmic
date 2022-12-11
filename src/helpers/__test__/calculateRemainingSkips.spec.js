import calculateRemainingSkips from '../calculateRemainingSkips';

describe('calculateRemainingSkips', () => {
  it('should return an array of skip numbers', () => {
    const skipArray = calculateRemainingSkips(100, 10);
    expect(skipArray).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90]);
  });

  it('should not return the first skip number', () => {
    const skipArray = calculateRemainingSkips(100, 10);
    expect(skipArray).not.toContain(0);
  });

  it('should return an empty array if the total is less than the limit', () => {
    const skipArray = calculateRemainingSkips(10, 100);
    expect(skipArray).toEqual([]);
  });
});
