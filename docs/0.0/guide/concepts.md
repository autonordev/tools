# Core Concepts

## Workspaces

A workspace, identified by [a `workspace.toml` file](../reference/workspaces), is the 'root' of a Gaffer entity.
It usually, but not exclusively, maps to a Git repository and also is usually the place where developers launch their
IDEs from.

The directory with the `workspace.toml` file is considered the 'workspace root'. This means that when a path in Gaffer
begins with `//`, it's relative to that directory. Any `project.toml` or `package.toml` files found in the workspace root
and its subdirectories will be seen as part of the workspace.

A workspace file can set out ['includes'](#packages), which themselves will apply to all [projects](#projects) within
the workspace.

All workspaces are independent to each other.

## Schemes

Schemes (or 'scheme files') are packages and projects. They have some common properties between them, like:

- a 'name' field, which must meet a specific criteria and be unique across all schemes in the workspace
  - Also: schemes can't use the same name as the workspace
- the ability to include packages from elsewhere in the workspace

## Projects

A project, identified by [a `project.toml` file](../reference/projects), generally maps to a Roblox place. A project
represents something that is converted into a Rojo project file, which is _usually_ also a buildable target.

### Outputs

Project files have an 'outputs' [table](https://toml.io/en/v1.0.0#table) which describes:

- where the project file should go
- if and how the project should be built

By default, projects build to `./.project.json`, the bare minimum for Rojo to process our projects.

However, some tooling may expect a `default.project.json` file in our workspace root. We could achieve this like so:

```toml
name = "sourcemap"
edition = 0
includes = [ ... ]

[outputs]
project = "//default.project.json" // [!code hl]
```

Now when we run `gaffer update`, our example-project will create a `default.project.json` file in our workspace root.

Gaffer expects us to tell it where we should build our projects. We'll get an error if there is no `outputs.build` key.
For example, here's an example 'lobby' project:

```toml
name = "lobby"
edition = 0

[outputs]
build = "//artifacts/lobby.rbxl" // [!code hl]
```

When we run `gaffer build`, we'll see a `lobby.rbxl` file created in the `artifacts` folder.

::: tip Heads up!
In this case, it's our responsibility to make sure that our `artifacts` folder exists, otherwise Gaffer will error.
The same applies for any subdirectories we reference in a build path.
:::

`outputs.build` can be used on any extension that Rojo supports:

- level files (binary: `rbxl`, XML: `rbxlx`)
- and model files (binary: `rbxm`, XML: `rbxmx`)

Some projects shouldn't be built, this can be done by setting `outputs.build` to `false`.

Let's take our `sourcemap` project above (the one that outputs to `default.project.json`) and stop it from being built:

```toml
name = "sourcemap"
edition = 0
includes = [ ... ]

[outputs]
project = "//default.project.json"
build = false // [!code focus]
```

Now if we try to run `gaffer build sourcemap`, nothing'll happen:

```
gaffer notice: Project `sourcemap` was not built as it has no build output.
gaffer notice: No projects were built. There are either no projects in the workspace or your filter did not match any projects.
```

## Packages

A package, identified by [a `package.toml` file](../reference/packages), is not built itself. Rather, it (usually)
has [a `tree.json` file](../reference/trees) which is included into the tree of projects that include it.

Packages can also include other packages, which are also appended onto the project.
