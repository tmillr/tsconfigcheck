# Changelog

## [2.0.0](https://github.com/tmillr/tsconfigcheck/compare/v1.0.1...tsconfigcheck-v2.0.0) (2022-08-24)

### ⚠ BREAKING CHANGES

* this change is breaking for older versions of Node that don't support es modules

### Bug Fixes

* don't use Node's fetch() ([#7](https://github.com/tmillr/tsconfigcheck/issues/7)) ([e87eed1](https://github.com/tmillr/tsconfigcheck/commit/e87eed1bdc2689cab3d3187b46593d2cabe74771)), closes [#6](https://github.com/tmillr/tsconfigcheck/issues/6)
* error on non-200 response ([36b957e](https://github.com/tmillr/tsconfigcheck/commit/36b957ec152c57b068bebc901b826d4cf4056bc5))
* uncomment all `//` comments unconditionally ([e28b98c](https://github.com/tmillr/tsconfigcheck/commit/e28b98c823daeeb6f2d712df6a4b3dfda30d375d))

### Miscellaneous Chores

* convert tsconfigcheck pkg to es module ([eff5259](https://github.com/tmillr/tsconfigcheck/commit/eff525944429f08963720f995583a36a9148166c))
