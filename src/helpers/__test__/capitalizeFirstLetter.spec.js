import capitalizeFirstLetter from '../capitalizeFirstLetter';

describe('capitalizeFirstLetter', () => {
  it('Should capitalize the first letter of a string', () => {
    const result = capitalizeFirstLetter('test');
    expect(result).toEqual('Test');
  });

  it('Should not change the case of the rest of the string', () => {
    const result = capitalizeFirstLetter('tes-T-t');
    expect(result).toEqual('Tes-T-t');
  });

  it('Should handle an empty string', () => {
    const result = capitalizeFirstLetter('');
    expect(result).toEqual('');
  });

  it('Should not change strings that start with a number', () => {
    const result = capitalizeFirstLetter('1test');
    expect(result).toEqual('1test');
  });
});
