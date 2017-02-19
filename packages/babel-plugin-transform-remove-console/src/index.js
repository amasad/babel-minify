"use strict";

module.exports = function({ types: t }) {
  return {
    name: "transform-remove-console",
    visitor: {
      CallExpression(path) {
        const callee = path.get("callee");

        if (!callee.isMemberExpression()) return;

        if (isConsole(callee)) {
          // console.log()
          if (path.parentPath.isExpressionStatement()) {
            path.remove();
          } else {
            path.replaceWith(createVoid0());
          }
        } else if (isConsoleBind(callee)) {
          // console.log.bind()
          path.replaceWith(createNoop());
        }
      },
      MemberExpression: {
        exit(path) {
          if (isConsole(path) && !path.parentPath.isMemberExpression()) {
            path.replaceWith(createNoop());
          }
        }
      }
    },
  };

  function isConsole(memberExpr) {
    const object = memberExpr.get("object");
    if (object.isIdentifier({ name: "console" })) return true;

    const property = memberExpr.get("property");
    return object.get("object").isIdentifier({ name: "console" })
      && (
        property.isIdentifier({ name: "call" })
        || property.isIdentifier({ name: "apply" })
      );
  }

  function isConsoleBind(memberExpr) {
    const object = memberExpr.get("object");
    return object.isMemberExpression()
      && object.get("object").isIdentifier({ name: "console" })
      && memberExpr.get("property").isIdentifier({ name: "bind" });
  }

  function createNoop() {
    return t.functionExpression(null, [], t.blockStatement([]));
  }

  function createVoid0() {
    return t.unaryExpression("void", t.numericLiteral(0));
  }
};
