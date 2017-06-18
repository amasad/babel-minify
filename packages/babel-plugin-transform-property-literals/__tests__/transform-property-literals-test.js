jest.autoMockOff();

const thePlugin = require("../../../utils/test-transform")(
  require("../src/index")
);

describe("transform-property-literals-plugin", () => {
  thePlugin(
    "should strip unnecessary property literal qoutes",
    `
    var x = { 'foo': 'bar' };
  `,
    `
    var x = { foo: 'bar' };
  `
  );

  thePlugin(
    "should strip unnecessary property literal qoutes for numbers",
    `
    var x = { '1': 'bar' };
  `,
    `
    var x = { 1: 'bar' };
  `
  );

  thePlugin(
    "should not strip necessaary quotes for numeric like things",
    `
    var data = {
      "00": 1,
      "01": 2
    };
  `
  );

  thePlugin(
    "should not transform invalid identifiers",
    `
    ({
      "default": null,
      "import": null
    });
  `,
    `
    ({
      default: null,
      import: null
    });
  `
  );

  thePlugin(
    "should not transform non-string properties",
    `
    ({
      foo: null
    });
  `
  );

  thePlugin(
    "should not transform propety keys that are computed",
    `
    ({
      [a]: null
    });
  `
  );

  thePlugin(
    "should not transform invalid es5 property names",
    `
    ({
      "\u2118": "wp",
      "𐊧": "foo"
    });
  `
  );

  thePlugin(
    "should transform valid ES5 unicodes as property names",
    `
    ({
      "ಠ_ಠ": "bar",
      "12e34": "wut",
      "\u01FC": "AE"
    })
  `,
    `
    ({
      ಠ_ಠ: "bar",
      "12e34": "wut",
      \u01FC: "AE"
    });
  `
  );

  thePlugin(
    "should transform computed properties which are strings",
    `
    ({
      [ಠ_ಠ]: "foo",
      ["ಠ_ಠ"]: "bar"
    });
  `,
    `
    ({
      [ಠ_ಠ]: "foo",
      ಠ_ಠ: "bar"
    });
  `
  );
});
