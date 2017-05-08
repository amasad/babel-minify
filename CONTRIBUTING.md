## Contributing

### Setup
```sh
$ git clone https://github.com/babel/babili
$ cd babili
$ npm install
$ npm run bootstrap
```

#### Build

To build **once**:

```sh
npm run build
```

Or to do an incremental build in watch mode:

```sh
npm run watch
```

#### Lint

This project uses [prettier](https://github.com/prettier/prettier) for formatting code and [eslint](https://github.com/eslint/eslint) for other linting.

To check both:

```sh
npm run lint
```

You can also run them each individually:

 ```sh
# prettier
npm run format-check

# eslint
npm run eslint
```

##### Lint Fix

To fix formatting and auto-fixable eslint errors,

```sh
npm run fix
```

You can also run them each individually:

```sh
# prettier
npm run format

# eslint
npm run eslint-fix
```

#### Test

To run all tests,

```sh
npm test
```

To run tests for a specific package,

```sh
npm test packages/babel-preset-babili
```

#### Smoke Tests

Prepare:

```sh
git submodule init
git submodule update
```

Run:

```sh
node smoke/run.js [options] [inputTests...]
```

Usage:

```
Usage: run [options] [inputTests...]

  Options:

    -h, --help         output usage information
    -i --skip-install  Skip Install Step
    -b --skip-build    Skip Build step
    -c --skip-cleanup  Skip cleanup step
    -q --quiet         Quiet mode
```

Example:

To build and test `lodash`,

```sh
node smoke/run.js lodash
```

To run smoke test without re-building and re-installing again

```sh
node smoke/run.js -ib lodash
```

#### Benchmarks

[benchmark.js](https://github.com/babel/babili/blob/master/scripts/benchmark.js) compares Babili with [Uglify](https://github.com/mishoo/UglifyJS2), [Closure Compiler](https://github.com/google/closure-compiler) and [Closure Compiler JS](https://github.com/google/closure-compiler-js)

```sh
./scripts/benchmark.js [file...]
```

[plugin-timing.js](https://github.com/babel/babili/blob/master/scripts/plugin-timing.js) is used to calculate and compare the time spent in each plugin.

```sh
./scripts/plugin-timing.js file.js
```

[plugin-contribution.js](https://github.com/babel/babili/blob/master/scripts/plugin-contribution.js) calculates how much each plugin of babili contributes to size reduction.

```sh
./scripts/plugin-contribution.js file.js
```

### Debugging

In your project, if you find that there is a bug that appears ONLY when you use Babili, it's most likely that there is a bug in Babili and you should definitely report it. Here are some guidelines that might help you drill down the issue. If it doesn't help you, you can of course create a minimal repro project with the bug and report it.

#### Compile time Errors

If you get a syntax error at compile time, then it could be a few things:

1. The parser itself doesn't handle the syntax being used (a [babylon](https://github.com/babel/babylon) bug).
2. The code is actually invalid syntax.
3. You didn't turn on the relevant Babel plugin for that syntax (if experimental).

If the syntax error occurs at runtime,  it likely means the code generator ([babel-generator](https://github.com/babel/babel/tree/master/packages/babel-generator)) has a bug and has output invalid code.

#### Runtime errors

When you run your minified code in the browser,

1. If there is an error in the console, as a first step, look around the code block where the error happens, and the code block of a few steps up in the stack.
2. Try to predict what caused the error and try relating it to some of the plugin names in the [packages/](https://github.com/babel/babili/tree/master/packages) directory. The major ones (that do a lot of transformations) are - mangle, deadcode-elimination and simplify.
3. Every plugin that Babili uses has an option in preset to toggle it on/off - [preset-options](https://github.com/babel/babili/tree/master/packages/babel-preset-babili#options)
4. Disable any transformation(s) that you suspect are causing problems. Turning OFF mangling (`mangle: false`) is a good practice if you don't think it's related to a mangling bug, since unmangled variable names will make debugging easier.
5. Sometimes it might NOT be a bug with one plugin but a combination of plugins. Again, `deadcode-elimination` and `simplify` maybe good candidates to start with here as they perform many transformations.
6. Sometimes it might because of the [unsafe transformations](https://github.com/babel/babili/tree/master/packages/babel-preset-babili#option-groups). Some of them are grouped into a single option named `unsafe`. This option can help you identify it sooner if the bug is in one these plugins.
7. Produce a minimal repro of the same issue - the function block containing the bug should be enough to help reproduce the bug.
8. [Report it 🙂](https://github.com/babel/babili/issues/new)
9. You're awesome. Thanks!

##### Mangler bugs

This should be the easy one. If there is an error thrown in the console,

1. In the devtools find the variable that's mismatched (Usually it is the one that's in the Error message. If you have try..catch, add breakpoints in the try block and get the variable name that's faulty).
2. In current Babili, there is no variable reuse (Fix in [#284](https://github.com/babel/babili/pull/284)). So, every variable that you see is declared ONLY ONCE (except `var`s which can be declared mutiple times, but all those will still be in one function block). So it should be pretty easy to find that one declaration in your code.
3. Usually, the containing function should help you reproduce the same error.
4. [Report it 🙂](https://github.com/babel/babili/issues/new)
5. You're awesome. Thanks!

### Releasing

> If you are releasing a new package, you'll want to run `./scripts/npm-owner-update.sh` to add all owners to the new npm package after releasing. Or do it manually via `https://www.npmjs.com/package/package-name-here/access`.

If you need to update deps run `npm run clean` and then `npm run bootstrap`.

To get the changelog, run `npm run changelog` to print to the terminal.

Use `npm run publish`. It will run `lerna publish` (we use `--independent`) so it will prompt the version number for every package.
