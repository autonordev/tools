/**
 * Copyright 2020 AJ ONeal
 * https://git.rootprojects.org/root/walk.js
 * https://www.npmjs.com/package/@root/walk
 *
 * SPDX-License-Identifier: MPL-2.0
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://mozilla.org/MPL/2.0/.
 */

const fs = require('fs').promises
const path = require('path')

const skipDir = new Error('skip this directory')
const _withFileTypes = { withFileTypes: true }
const pass = (err) => err

// a port of Go's filepath.Walk
// Gaffer Edit: we deviate from this intentionally, most notably by following symlinks
const walk = async (pathname, walkFunc, _dirent) => {
  let err

  // special case of the very first run
  if (!_dirent) {
    const _name = path.basename(path.resolve(pathname))
    _dirent = await fs.lstat(pathname).catch(pass)
    if (_dirent instanceof Error) {
      err = _dirent
    } else {
      _dirent.name = _name
    }
  }

  // run the user-supplied function and either skip, bail, or continue
  err = await walkFunc(err, pathname, _dirent).catch(pass)
  if (err === false || skipDir === err) {
    return
  }
  if (err instanceof Error) {
    throw err
  }

  if (_dirent.isSymbolicLink()) {
    const linkName = await fs.readlink(pathname)
    pathname = path.resolve(pathname, linkName)
  } else if (!_dirent.isDirectory()) {
    return
  }

  const result = await fs.readdir(pathname, _withFileTypes).catch(pass)
  if (result instanceof Error) {
    return walkFunc(result, pathname, _dirent)
  }
  for (const dirent of result) {
    await walk(path.join(pathname, dirent.name), walkFunc, dirent)
  }
}

module.exports = {
  walk,
  skipDir
}
