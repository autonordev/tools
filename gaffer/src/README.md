# Gaffer Source

The Gaffer source code is heavily split up to enable modularity.

- `index.js` is the both the library and command line entry point. It initialises the CLI, loads the commands, and parses the input.
- `commands/` houses all commands. Each file is a separate command, with `index.js` acting as an entry point, requiring all other command files.
- `helpers/` houses mostly-independent modules used by Gaffer, such as the logger and validation schemas. Generally, helpers export objects and multiple functions.
- `utilities/` houses common functions, such as escaping strings. Each file is an individual function.
- `functions/` houses components used repeatedly, such as updating packages and building place files. These generally map to a command.
  - The `update/` directory houses each state of the update process, an `index.js` entry point (which executes all steps in order), and the `base-tree.json` file.
  - Some commands/functions may only execute parts of the update process (for example, not running the transform step, which actually writes the package files)
