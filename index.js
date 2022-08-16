#!/usr/bin/env node

/**
 *
 * Copyright (c) 2022 Tyler Miller (https://github.com/tmillr)
 * This software is distributed under the terms of the MIT license.
 * SPDX-License-Identifier: MIT
 * @license MIT
 * (see accompanying file LICENSE)
 *
 */

const fs = require("fs");
const JSON5 = require("JSON5");
const traverseSchema = require("json-schema-traverse");

function getPropFromPointer(obj, path) {
  path
    .replace(/^#\//, "")
    .split(/\//g)
    .forEach((k) => (obj = obj && obj[k]));

  return obj;
}

function hasKey(o, k) {
  return Object.prototype.hasOwnProperty.call(o, k);
}

let lastErr;
let origErr;
let attempts = 0;
let f;

/**
 * attempts to autofix JSON/JSON5 parser errors (usually due to missing commas)
 */
function tryAutoFix(err) {
  const { lineNumber, columnNumber } = err;
  if (!origErr) origErr = err;
  if (attempts >= 200) return false;
  let match;

  if ((match = err.message.match(/invalid\scharacter\s*["']\\?("|,)/iu))) {
    lastErr = err;
    f = f.split("\n");

    if (match[1] === '"')
      f[lineNumber - 1] = f[lineNumber - 1].replace(
        RegExp(`.{${columnNumber - 1}}`, "u"),
        "$&,"
      );
    else
      f[lineNumber - 1] = f[lineNumber - 1].replace(
        RegExp(`(.{${columnNumber - 1}}),`, "u"),
        "$1"
      );

    f = f.join("\n");
    attempts++;
    return true;
  }

  return false;
}

(async () => {
  const list = [];
  let tsconfig;
  const arg = process.argv[2];

  f = (f || fs.readFileSync(arg ? arg : "./tsconfig.json", "utf8")).replace(
    /^([ \t]*)\/\/[ \t]*("[^\n]+"\s*:)/gm,
    "$1$2"
  );

  while (true)
    try {
      tsconfig = JSON5.parse(f);
      break;
    } catch (e) {
      if (tryAutoFix(e)) continue;
      if (f) console.error(f);
      console.error(origErr);
      process.exit(1);
    }

  const cb = (...a) => {
    if (a[1].includes("properties"))
      list.push(
        a[1].replace(/^.*?properties\//, "").replace(/properties\//g, "")
      );
  };

  const schema = JSON.parse(
    await (await fetch("https://json.schemastore.org/tsconfig.json")).text()
  );

  traverseSchema(schema, { cb });

  const ignored = [],
    missing = [];

  list.forEach((str) => {
    if (/(?:\/items|anyOf\/?[^\/]*)$/.test(str)) ignored.push(str);
    else if (getPropFromPointer(tsconfig, str) === undefined)
      missing.push(`MISSING PROPERTY: ${str}`);
  });

  console.log("=== BEGIN IGNORED SCHEMA PROPERTIES (DEBUG) ===");
  console.log(
    ignored.join("\n") + "\n=== END IGNORED SCHEMA PROPERTIES (DEBUG) ===\n"
  );
  console.log(missing.join("\n"));
})();
