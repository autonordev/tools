---
sidebar_position: 2
---

# Installing Gaffer

## via Aftman or Foreman

Gaffer is published under `ametools/gaffer`.

[Aftman](https://github.com/lpghatguy/aftman) and [Foreman](https://github.com/roblox/foreman) are toolchain managers and are the most recommended installation methods, especially since they can allow for different projects to use different versions of a tool.

```toml title="aftman.toml"
[tools]
gaffer = "ametools/gaffer@0.0.1-alpha.1"
```

Note that Foreman appears to be unmaintained and has less features than Aftman. You should strongly consider using Aftman over Foreman, unless your project requirements (i.e. GitLab) prevent you from doing so.

## via npm

Gaffer is published on [the npm registry](https://npmjs.com/) as [`gaffer-rbx`](https://npmjs.com/package/gaffer-rbx).

You may install it, either globally or within your project, via your preferred JS package manager of choice. Note that installing locally may create some issues with your path.

Overall, npm is not a super recommended installation method, but the option is there for those who want it.

## via Path

You can view the [releases page here](https://github.com/ametools/gaffer/releases). You may download the binary for your OS and add it to your path.

If you don't know what that means, then you should probably use a different installation method.

## from Source

Upon downloading the source (and running the `yarn` command, on version ^3.3.0), you can then run `npm link` from the `gaffer` directory.

You can also build the binaries yourself by running `node ./release gaffer 0.0.1` (from the repo root). You'll need to replace `0.0.1` with the current version number for the tool to work correctly.

Once built, you can add the appropriate binary to your path.
