---
sidebar_position: 5
---

# Using with Wally

[Wally](https://github.com/upliftGames/wally) is a package manager for Roblox. It is an incredibly useful and ubiquitous tool.

In order to use Wally and Gaffer together, you need to consider three questions:

1. Do you want your Wally packages in the root of your workspace?
2. Do you want multiple different manifests in your workspace?
   - For example: you use `Signal` and `Net` in all of your games, but only use `EnumList` in one
3. Do you want to commit your Wally packages to source control?

## Setting up

For the first question, the Gaffer authors recommend **yes**. In which case, some amount of extra setup is required. This setup also allows you to have multiple, independent Wally manifests; useful for pulling from both public and private registries or keeping different bundles separate.

If you want to keep your Wally manifest (and accordingly, your package directories) in the root of your workspace, then you can continue using Wally like usual. If you already know what you're doing and don't want Gaffer to touch Wally, then you can also continue using it like usual.

**1. Create a project for our dependencies**

In the [Gaffer example](https://github.com/autonordev/tools/tree/main/gaffer/example) we use `packages/third_party` to house our Wally packages.

We recommend having a single folder that contains _all_ 'third party' code, this can be helpful to — for instance — ignore code you do not maintain in linting and formatting, but it's up to you.

Here's an example from an internal repository:

```toml title="third_party/wally/package.toml"
name = "tp/wally"
edition = 0

[scripts]
packages = [
  "wally install",
  "gaffer x package_thunks -s w/tp/wally",
]

package_thunks = [
  "gaffer x sourcemap",
  { cmd = "wally-package-types --sourcemap sourcemap.json third_party/wally/Packages/", dir = "//" },
  { cmd = "wally-package-types --sourcemap sourcemap.json third_party/wally/ServerPackages/", dir = "//" },
]
```

This example also uses [Gaffer scripts](./scripts) to call [wally-package-types](https://github.com/johnnymorganz/wally-package-types), a tool that helps maintain typing and intellisense information when using Wally, but this is all optional.

**2. Create a tree file for our dependencies**

In this recommended setup, we have a project that contains our Wally dependencies (or all third party code even). In order to include our packages as usual, we'll create a tree file:

```json title="third_party/wally/tree.json"
{
  "ReplicatedStorage": {
    "Packages": "./Packages"
  },

  "ServerScriptService": {
    "Packages": "./ServerPackages"
  }
}
```

In this case, we only use Packages and ServerPackages. If you're also using DevPackages, you can add those as required. If you're not using ServerPackages, then you can remove it from the tree file; same applies if you're _only_ using ServerPackages.

If you're creating a single project for all third party code, you can also add additional sources here.

**3. Include our dependencies project**

You can now `include` our project (in this case, `tp/wally`) like usual. If you're using it in all of your projects, you may want to include it in your workspace file (although we don't recommend using workspace includes in the first place).

**4. Add more?**

If your answer to the second question is yes, then you can build upon this example to add further manifests to your game.

You could create a manifest for each individual game, or create a manifest for each individual bundle (e.g. one bundle for all games, and then separate bundles on a per-game basis). You should consider the possible implications of either option before deciding.

## Committing

The Gaffer authors recommend including `*.project.json` in your gitignore. However, if you're using Wally **and** committing your dependencies to source control, we'll need to add a few additional lines, otherwise some unexpected issues could appear.

```ignore title=".gitignore"
# Gaffer project files
*.project.json

#highlight-start
# Include wally-related project files
!**/Packages/**/default.project.json
!**/ServerPackages/**/default.project.json
!**/DevPackages/**/default.project.json
#highlight-end
```

You can remove the package types you don't need.

This will ensure that the `default.project.json` files, which your dependencies use as a referent, remain intact. Otherwise, users will need to run `wally install` to get them back.

Again, you should consider the implications of committing vs not committing your dependencies to source control; discussion of such is out of scope for this article.
