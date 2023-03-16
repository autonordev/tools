---
sidebar_position: 999
---

# Error and Warning Codes

## G001 — error

**(schemePath) is neither a project nor package file**

This error should not be emitted and indicates an internal fault with Gaffer.

## G002 — error

**(schemePath) is both a project and package file**

This error should not be emitted and indicates an internal fault with Gaffer.

## G003 — error

G003 indicates there was an issue parsing a file in TOML.

It is accompanied by a TOML error.

**Scheme file (schemePath) could not be read**

**Workspace file (configPath) could not be read**

## G004 — error

G004 indicates that there was an issue validating a file.

It is accompanied by a Joi error.

**Project/package (schemePath) could not be read**

The [project](./projects) or [package](./packages) file is not in line with the appropriate schema.

**Workspace file (configPath) could not be parsed**

The [workspace file](./workspaces) is not in line with the appropriate schema.

## G005 — error

All schemes are named and this name must be unique throughout the workspace.

**(schemePath)'s name is already in use by (otherSchemePath)**

**(schemePath)'s name is already in use by workspace file**

Schemes cannot use the same name as the workspace.

## G006 — error

**Could not locate a workspace.toml file**

Gaffer searches up from the current directory until it finds a [workspace file](./workspaces) or reaches the volume
root.

This error indicates that you are not in a workspace or that your workspace file is not named correctly.

## G007 — error

**Include could not be resolved**

Includes are searched for in one of two ways:

- by a path, such as `//pkg/lighting`, where this folder contains a scheme file
- by a name, such as `main-lighting`, as defined in a package file

This error indicates that Gaffer was unable to identify a scheme from the include.

## G008 — error

**Included scheme (schemeName) is not a package**

This error indicates that you have attempted to include a project.

Only packages may be included.

## G009 — error

**Package (packageName) includes itself**

This error indicates that a package includes itself.

## G010 — warning

G010 indicates an error with Rojo, which Gaffer utilises to build projects.

This error is accompanied by a Rojo error message.

**Project (projectName) could not be built**

## G011 — warning

**Project (projectName)'s rojo.json file has \`tree\` set**

> Note that this key is overwritten entirely by Gaffer and is ignored.

`rojo.json` files allow projects to pass configuration options into Rojo, such as overriding the project name, setting
place IDs or passing in ignore paths.

This warning indicates that the named project's `rojo.json` file has a key named `tree`. This key is ignored by Gaffer
and will not be passed into the generated project file.

While not an error, this behaviour should be avoided. G011 may become an error in the future.

## G012 — notice, warning

G012 indicates that a file exceeds or is close to exceeding Roblox's maximum file size for uploads.

You should consider using binary files (i.e. rbxl, rbxm) instead of XML-based files as they have significantly smaller file sizes.

**Built file (projectName) exceeds Roblox's maximum file size**

**Built file (projectName) is (...) bytes away from exceeding Roblox's maximum file size limit**
