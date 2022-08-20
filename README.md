# tsconfigcheck

[![npm](https://img.shields.io/npm/v/tsconfigcheck?color=red)](https://www.npmjs.com/package/tsconfigcheck)
[![install size](https://packagephobia.com/badge?p=tsconfigcheck)](https://packagephobia.com/result?p=tsconfigcheck)

Quickly check your `tsconfig.json` for missing properties.

- Compares your tsconfig against **ALL** "_properties_" from the [official tsconfig schema][schema]
- Uncomment's all commented-out keys/properties in your tsconfig prior to checking (so that they don't show up as missing)

## Why?

1. `tsc --init` only includes a subset of all truly possible tsconfig properties.
2. The [tsconfig reference] itself doesn't necessarily document _each and every_ possible property.
3. Opening a browser window every time just to check for new properties can be a hassle.
4. ?
5. OCD (probably)

## Install

```sh
npm i -g tsconfigcheck
```

For one-off/impromptu invocations without worrying about local or global installation, skip the installation step above and use `npx` (see [Usage](#usage)).

You may also install the cli/binary locally inside of your package if you'd like. This will add tsconfigcheck to your developer dependencies (via the `-D` flag) inside your `package.json` and will place the physical binary inside of the local `node_modules` directory.

```sh
# Note: cd into your package's root directory first
npm i -D tsconfigcheck
```

Then, to run the locally installed binary, use `npx` (see [Usage](#usage)).

> If you don't have a `tsconfig.json` yet for your TypeScript project, you can generate one with `tsc --init`. You can also make the contents of tsconfig.json an empty object `{}` in order to simply get back a list of _all_ valid properties from the schema.

## Usage

```sh
# Missing path defaults to tsconfig.json in the current directory
tsconfigcheck [tsconfigpath]

# To run a local installation, or, if you skipped the manual installation step
npx tsconfigcheck [tsconfigpath]
```

> Note: this is quite a rough and small program atm, hence why it has been restricted to checking tsconfigs only. In my opinion, it should really only be used as an interactive cli tool to help ensure yourself that you've gone over absolutely _all_ of the current, published tsconfig settings (as reported by the official schema) when scaffolding a new project, and should probably not be relied upon for anything too serious (including using it in CI and other such automated environments). I imagine it is best used manually/by hand and by humans rather than machines, although merely piping the output into sed/awk/grep probably wouldn't hurt either if you'd like to do that in order to filter the output).

Missing properties are output as JSON property paths (more formally known as [JavaScript Object Notation (JSON) Pointers][json pointer]) one per line. For any listed missing properties that you would like to introduce to your tsconfig, you will have to go back and add them to your `tsconfig.json` by hand.

## Caveats, Etcetera

The `buildOptions` root tsconfig property from the tsconfig schema does not appear to be documented in the public [tsconfig reference], so it very well may not be a valid `tsconfig.json` property. It might only be listed in order to document cli-only options/flags, or it may simply exist for internal use only. You will likely want to ignore this property and everything under it.

The `ts-node` root tsconfig property (including everything under it) is used for options to ts-node. It is typically only used/needed in projects that actually use ts-node.

This tool does not do any schema validation against `tsconfig.json` as it is not meant for that. Use a different tool to validate your tsconfig.json.

Missing properties output by this tool must be added to your tsconfig.json (if you wish to do so) manually/by-hand, or via any other such external means. The feature of automatically adding missing properties along with their default values (and descriptions etc.) may come at a later time sometime in the future.

Any moderate to major changes or updates to the official tsconfig schema could easily break this tool as it is currently implemented.

Since, prior to comparing your tsconfig.json against the tsconfig schema, this tool attempts to uncomment any properties that have been commented-out via `//` in your tsconfig.json, any non-code (i.e. non-JSON) appearing inside such comments _may_ cause issues, as well as can any property/key commented-out with `//` whose value portion (the portion after the colon `:`) spans multiple literal lines in the tsconfig.json file. If you are having issues with parser errors, make sure that every single property has a trailing comma before running this tool. Also beware of any `//` commented-out properties spanning multiple lines in your JSON file. Any JSON properties commented out via `/* */` multiline comment markers will be falsely reported as missing from the file.

JSON pointers containing escape sequences are not properly handled yet, but this probably isn't an issue for now since there aren't any tsconfig properties that contain `~` or `/` (and I highly doubt that any ever will).

Finally, [issues](../../issues) and [pull-requests](../../pulls) are both welcomed and encouraged!

## License

[MIT](LICENSE)

[json pointer]: https://www.rfc-editor.org/rfc/rfc6901
[schema]: https://json.schemastore.org/tsconfig.json
[tsconfig reference]: https://www.typescriptlang.org/tsconfig
