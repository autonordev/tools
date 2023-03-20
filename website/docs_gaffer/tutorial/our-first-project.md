---
sidebar_position: 2
---

# Our first project

As discussed in the [Core Concepts](../guide/concepts) article, workspaces are made up of projects.

In [the previous article](./getting-started), we created our workspace file, which also defines our project root, which we'll
use `//` to reference in paths, see below for an example. This type of syntactic sugar (of which you'll find plenty in
Gaffer) is supported in all paths; ranging from includes to outputs.

## The project file

We'll create a project for our game's lobby, since this'll be our 'start place' on Roblox. Remember that Gaffer is unopinionated,
we can create this project file anywhere in our workspace; but lets put it in a `projects/` folder to keep everything clean.

**//projects/lobby/project.toml**

```toml
name = "lobby"
edition = 0

[outputs]
build = "//artifacts/lobby.rbxl"
```

Since we're at it, we'll also create our `//artifacts` directory. Lets put a `.gitkeep` file there.
This doesn't have any special meaning, but it signifies to other programmers that the directory is purposefully
empty; remember that Git ignores empty directories.

## The code

Coinciding with standard game architecture, we'll create a `server`, `client`, and `shared` folder within our lobby. This'll
store the code for our lobby place.

For our `server/init.server.lua` and `client/init.client.lua` files, we can just put a `print("Hello World!")` to make sure
everything works. We'll leave `shared` empty for now; but remember that Git ignores empty directories, so if you commit an empty
shared directory, other people will have to re-create it before they build.

We'll create a [tree file](../reference/trees) in the same directory as our `project.toml` file. This tree file represents how our
place will look when we build it.

**//projects/lobby/tree.json**

```json
{
  "ReplicatedStorage": {
    "Shared": "./shared"
  },
  "ServerScriptService": {
    "Server": "./server"
  },
  "StarterPlayer": {
    "StarterPlayerScripts": {
      "Client": "./client"
    }
  }
}
```

Anyone whose used Rojo before is probably a bit confused; there's so much wrong with this!!!

1. We're not defining our Tree as having a `$className` of DataModel
2. We're not defining the `$className` of our services or of `StarterPlayerScripts` (although this _is_ optional in Rojo)
3. We're not including `$path`, instead just setting our nodes to strings

Yet if you run `gaffer build`, you'll get a perfect place file, all up to scratch. What is this dark magic? Well, it's
actually pretty simple. Since Gaffer already is managing our Rojo project files, we use that opportunity to add some syntactic sugar:

1. There's a [`base-tree.json` file](https://github.com/autonordev/tools/blob/main/gaffer/src/functions/update/base-tree.json)
   which applies some sensible defaults, like enabling HttpService, setting default lighting, and also setting the
   root `$className` to `DataModel`.
2. With Gaffer trees, any 'node' that doesn't have a `$className` or `$path` will have its className set to the node's key.
   - While Rojo does do this for services and other well-known singletons (like StarterPlayerScripts), Gaffer is more exhaustive and will add a `$className` for all instances. This can include things like `BlurEffect`s.
   - Heads up though, unclassified nodes that have children are not inferred by Gaffer, and Rojo will usually assume these are folders.
3. When a node is set to a string, Gaffer assumes we want that node to reference to that path. So Gaffer will transform it for us.

If we pop open our project's `.project.json` file and prettify it, we'll see a valid Rojo project file:

```json
{
  "name": "lobby",
  "tree": {
    "$className": "DataModel",
    "HttpService": {
      "$properties": { "HttpEnabled": true },
      "$className": "HttpService"
    },
    "SoundService": {
      "$properties": { "RespectFilteringEnabled": true },
      "$className": "SoundService"
    },
    "Lighting": { ... },
    "ReplicatedStorage": {
      "Shared": { "$path": "./shared" },
      "$className": "ReplicatedStorage"
    },
    "ServerScriptService": {
      "Server": { "$path": "./server" },
      "$className": "ServerScriptService"
    },
    "StarterPlayer": {
      "StarterPlayerScripts": {
        "Client": { "$path": "./client" },
        "$className": "StarterPlayerScripts"
      },
      "$className": "StarterPlayer"
    }
  }
}
```

These generated project files are not meant to be read by humans, so they'll look a bit weird, but you can see how it's all there. Plus, it's included the default Roblox Lighting for us; you can read the [base-tree.json file here](https://github.com/autonordev/tools/blob/main/gaffer/src/functions/update/base-tree.json) to see what gets set.

If you're creating a plugin or model, or are introducing Gaffer in an existing project and don't want the base tree, you can add `use_base_tree = false` in your `project.toml` file to disable it for that project. Heads up though that any workspace-level includes will still be included even if the base tree is disabled.
