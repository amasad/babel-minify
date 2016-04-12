jest.autoMockOff();

const babel = require('babel-core');
const unpad = require('../../../utils/unpad');

function transform(code) {
  return babel.transform(code,  {
    plugins: [require('../src/index')],
  }).code;
}

describe('constant-folding-plugin', () => {
  it('should remove call expressions', () => {
    const source = unpad(`
      emptyFunction('how long', '?');
    `);

    const expected = '';
    expect(transform(source)).toBe(expected);
  });

  it('should replace with emptyStatement', () => {
    const source = unpad(`
      if (1) emptyFunction('how long', '?');
    `);

    const expected = 'if (1) ;';
    expect(transform(source)).toBe(expected);
  });

  it('should convert to expressions to false', () => {
    const source = unpad(`
      foo(emptyFunction('how long', '?'));
    `);

    const expected = unpad(`
      foo(false);
    `);
    expect(transform(source)).toBe(expected);
  });
});
