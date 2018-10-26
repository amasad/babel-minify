function a() {}

function c() {}

function d() {
  var c = b();
  return c;
}

function f() {
  console.log('hi');
}

function i() {
  _i += ' ' + void 0 + void 0 + void 0 + void 0 + void 0 + void 0;
}

function j() {
  _i += ' ' + void 0 + void 0 + void 0 + void 0 + void 0 + void 0;
}

function g() {
  // preserve function
  g.func = function () {};

  return 1;
}

var variableToBeUsed = 1;

function h() {
  // leave used variables
  h.variableToBeUsed = void 0;
  return 1;
}

function blockLocalIf() {
  // preserve block-local function declared inside „consequent” block
  foo.a = 1;
  {
    a();
    return a;

    function a() {}
  }
}

function blockLocalElse() {
  // preserve block-local function declared inside „alternate” block
  foo.a = 1;
  {
    a();
    return a;

    function a() {}
  }
}