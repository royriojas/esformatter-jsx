import transformString from '../src/transform-string';

describe('transformString', () => {
  it('should transform a string that use double quotes to one using single quotes', () => {
    const result = transformString('"Some string"', { type: 'single' });
    expect(result).to.equal('\'Some string\'');
  });

  it('should properly escape characters that need escaping', () => {
    const result = transformString('"Some\'s string"', { type: 'single' });
    expect(result).to.equal('\'Some\\\'s string\'');
  });

  it('should convert single quotes to double quotes', () => {
    const result = transformString('\'Some\'s string\'', { type: 'double' });
    expect(result).to.equal('"Some\'s string"');
  });

  it('should not convert quotes if not needed', () => {
    const result = transformString('"Some string"', { type: 'double' });
    expect(result).to.equal('"Some string"');
  });

  it('should escape characters if needed when using double quotes', () => {
    const result = transformString('"Some"s string"', { type: 'double' });
    expect(result).to.equal('"Some\\"s string"');
  });

  it('should escape characters if needed when using single quotes originally', () => {
    const singleQuote = '\'';
    const result = transformString(`${singleQuote}Some"s string${singleQuote}`, { type: 'double' });
    expect(result).to.equal('"Some\\"s string"');
  });
});
