jest.autoMockOff();

const babel = require("babel-core");
const plugin = require("../src/index");
const unpad = require("../../../utils/unpad");

function transform(code) {
  return babel.transform(code,  {
    plugins: [plugin],
  }).code;
}

describe("transform-property-literals-plugin", () => {
  it("should strip unnecessary property literal qoutes", () => {
    const source = "var x = { 'foo': 'bar' };";
    const expected = "var x = { foo: 'bar' };";
    expect(transform(source)).toBe(expected);
  });
  
  it("should convert computed object method names with a string", () => {
    const source = "var x = { ['foo'](){} };";
    const expected = "var x = { 'foo'(){} };";
    expect(transform(source)).toBe(expected);
  });
  
  it("should convert computed class method names with a string", () => {
	const source = unpad(`
		class C {
			['foo']() {}
		}
	`);
	const expected = unpad(`
		class C {
			foo() {}
		}
	`);
    expect(transform(source)).toBe(expected);
  });

  it("should strip unnecessary property literal quotes for numbers", () => {
    const source = "var x = { '1': 'bar' };";
    const expected = "var x = { 1: 'bar' };";
    expect(transform(source)).toBe(expected);
  });

  it("should not transform invalid identifiers", () => {
    const source = unpad(`
      ({
        "default": null,
        "import": null
      });
    `);
    expect(transform(source)).toBe(source);
  });

  it("should not transform non-string properties", () => {
    const source = unpad(`
      ({
        foo: null
      });
    `);
    expect(transform(source)).toBe(source);
  });

  it("should not transform propety keys that are computed", () => {
    const source = unpad(`
      ({
        [a]: null
      });
    `);
    expect(transform(source)).toBe(source);
  });
});
