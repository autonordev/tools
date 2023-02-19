# Introduction

Gaffer is an orchestrator tool for Roblox developers, focused on (but not exclusive to) monorepos, enabling them to
create more reusable, modular projects.

<!-- N.B. this warning is also copied to tutorial/getting-started -->

::: warning Beware, here be dragons!
Gaffer is currently a prototype. You should:

- not use it for any production work unless you are 100% sure know you what you're doing
- expect there to be major, possibly breaking, changes between patches
- expect there to be bugs and glitches, possibly workflow-breaking problems

If you're interested in Gaffer, but unwilling to deal with the critical bugs or breaking changes that may occur, then
feel free to continue following our development and maybe even play around with the tool on unimportant, non-production
projects.

:::

## Motivation

I'm ([Eleanor](https://twitter.com/yelzom)) a big proponent of monorepos; while I don't want to come across as
evangelical, implementing them in my various non-Roblox projects have solved countless different pain points, and
so I aim to use them wherever possible. And like most Roblox programmers, I've developed a specific structure I use
for my projects, and also a set of dependencies which I lug around from project to project, iterating and improving
them as I go.

On a recent project, I made the decision to use a monorepo layout; this decision was helped by the requirements of
the project, these being:

- it is a series of games, of which one has multiple places
- most &mdash; but not all &mdash; of the games inherit a common codebase
- there are elements and components that I wish to use across multiple games, but this isn't necessarily consistent

I also wanted to minimise dead code, so simply using the same 'shared' folder across all the games wouldn't cut it.

> **P.S.** If you're not sold on the whole monorepo thing, [here](https://danluu.com/monorepo/) is [two](https://medium.com/netscape/the-case-for-monorepos-907c1361708a)
> great articles on why monorepos are awesome; especially in teams.

## Background

I created a straightforward script that would automatically process Rojo `project.json` files according to each
individual's games requirements, this script would merge multiple trees to create a Rojo project file.

This script became part of that set which I copy and paste from each project to another, with me tweaking and improving
it every project. Eventually, I ended up (effectively) creating and maintaining a bespoke toolchain for all of my
projects. This becomes even more cumbersome as the number of projects goes up.

<!-- TODO: Link the Gaffer Scripts issue here -->

My goal with Gaffer is to create a single tool which acts as a flexible, turnkey solution for developers; it coordinates
your project files, runs your builds, and will in the future interface with other tools, like Wally.

## Features

Today, Gaffer will:

- reconcile independent "tree" files into one big Rojo project file
  - Because Gaffer also transforms these tree files before merging them, it allows us to do things that aren't possible
    in "real" Rojo project files, like JSON comments (a concept created by Microsoft) and various other shorthands
    (e.g. for an RGB Color3, use `//` paths to refer to the workspace root).
- build projects, allowing you to simply refer to project names, and Gaffer will:
  - ensure the Rojo project file is up to date
  - instruct Rojo to build the project, with the output being set appropriately

<!-- TODO: Add more as Gaffer continues to be developed -->

## Future

I'm currently using Gaffer in my personal projects, moving away from that bespoke toolchain, and in that process
fixing any bugs I identify and adding features as I need them.

Feel free to contribute to the project (either by writing code or providing your input on tickets), or open an issue
if you find a bug or think there's a better way we can do things.

You can check the [GitHub backlog](https://github.com/eleanorlm/gaffer/issues) to see what's planned. Once Gaffer is in
a more stable state and when the feature set has been polished and refined, I hope to release a 1.0 version and continue
from there.

## What Gaffer is not

### A package manager

- Gaffer simply links together '[packages](./concepts#packages)'. It does not download anything.
- It's not possible to include packages from outside the workspace. While it is possible to use Rojo paths to bring
  things in from outside the workspace, it's not recommended and would make your projects incredibly fragile.
- Gaffer will merge together [tree files](../reference/trees). This means that if there are conflicts (for example, two
  separate packages attempting to set `ReplicatedStorage.Shared` to be their source), your build will fail.

If you are using third-party dependencies, you will need to include these yourself (which can then be linked into Gaffer).
For example, you could:

- include all of your dependencies into your workspace directly, for instance, under a `third_party` folder, or use
  Git submodules to do this automatically.
- use a dedicated package manager like [wally](https://wally.run)

### An alternative to Rojo

- Gaffer is dependant on Rojo in order to actually build the projects (e.g. place/level files).
