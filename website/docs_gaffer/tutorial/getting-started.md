---
sidebar_position: 1
---

# Getting Started

Welcome to Gaffer! We're super happy to have you here. This tutorial will walk you through the main concepts and
features, so you can get an understanding of how to use the tool. After that, you can delve yourself into the more
abstract articles.

<!-- N.B. this warning is also copied to guide/introduction -->

:::danger Beware, here be dragons!
Gaffer is currently a prototype. You should:

- not use it for any production work unless you are 100% sure know you what you're doing
- expect there to be major, possibly breaking, changes between patches
- expect there to be bugs and glitches, possibly workflow-breaking problems

If you're interested in Gaffer, but unwilling to deal with the critical bugs or breaking changes that may occur, then
feel free to continue following our development and maybe even play around with the tool on unimportant, non-production
projects.

:::

## Before you start

You should:

1. read the [Introduction](../guide//introduction), so you know what Gaffer is all about
2. read the [Core Concepts](../guide/concepts) article
3. [Install Gaffer](../guide/installation)

These tutorials assume that you've done all three and are following along linearly.

These tutorials often assume that you're somewhat familiar and comfortable with [Rojo](https://rojo.space), and that you
understand how Rojo project files work.

## Creating our workspace

In the future, Gaffer will have a command to bootstrap a workspace for us, but in the mean time we'll need to
get started ourselves.

Lets start by creating a directory, we'll call it `tutorial`, and creating our `workspace.toml` file. This file represents
the root of our workspace, and sets out the main configuration options:

```toml
name = 'tutorial'
edition = 0
```

All scheme and workspace files must have:

- a name, which must begin and end with an alphanumeric character, and can contain only dashes, underscores, dots, and forward slashes
  - unlike with other tools, like Aftman or Wally, a forward slash doesn't necessarily mean anything in Gaffer;
    there isn't scoping. However, you _should_ use names sensibly and consistently throughout your workspaces.
- an 'edition' value, which must be simply `0`
  - This value isn't very important currently, but if we ever make backwards incompatible changes to workspaces or schemes,
    then this value will help make clear what's broken and what's just old

### If you're using Git

You should create a `.gitattributes` file in the root of your repository, and put in:

```properties
/**/tree.json linguist-language=JSON-with-Comments
/**/rojo.json linguist-language=JSON-with-Comments
```

This will tell GitHub (and similar tools) that our Tree and Rojo files support comments.

You should also include any build outputs (such as `rbxl` files) _and_ any project.json files in your gitignore.
For example, this is from the Gaffer gitignore:

```ignore
# Roblox level files
*.rbxl
*.rbxlx
*.rbxlx.lock
*.rbxl.lock

# Gaffer project files
*.project.json
```

If you decide against this, you may want to include the following in your gitattributes file:

```properties
# merge=binary means any changes are always flagged as a merge conflict
# linguist-generated=true is a GitHub specific thing; see the link below.

*.rbxl merge=binary
*.rbxl linguist-generated=true

*.project.json merge=binary
*.project.json linguist-generated=true
```

> You can learn more about this [on GitHub's documentation](https://docs.github.com/en/repositories/working-with-files/managing-files/customizing-how-changed-files-appear-on-github).

### If you're using Visual Studio Code

VSCode may mark comments in JSON files as being incorrect, for this reason we need to tell VSC that we're using JSON with Comments.
Add the following in your `settings.json` file:

```json
"files.associations": {
  "/**/tree.json": "jsonc",
  "/**/rojo.json": "jsonc"
}
```

You may add this [in a file in your repository](https://github.com/autonordev/tools/blob/main/.vscode/settings.json), in a 'code workspace' or in your personal settings.
How you add the setting isn't important; it's just important that you do add it.
