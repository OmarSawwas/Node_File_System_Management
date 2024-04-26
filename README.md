# File Action Manager

The File Action Manager is a simple Node.js application that monitors a text file for specific commands and performs corresponding actions based on those commands. It allows users to execute actions such as creating, deleting, renaming, or adding content to files.This application can be extended to be a fully controlling CLI to even automate repetitive actions but mainly it was made to practice fs node module, event emitters, typescript ...

## Features

- Supports predefined actions: CREATE_FILE, DELETE_FILE, RENAME_FILE, ADD_TO_FILE.
- Monitors a text file (command.txt) for commands and executes corresponding actions.
- Uses asynchronous file operations for efficient handling (non blocking methods).

## Installation

1. Clone this repository to your local machine.

2. Navigate to the project directory.

3. Install packages dependencies.

using:

```CLI
# Using npm
npm install

# Using yarn
yarn
```

## Usage

1. To start Typescript server and watch the index.ts file run:

```CLI
# Using npm
npm run dev-ts

# Using yarn
yarn dev-ts
```

2. To use add file command please make sure to specify in command.txt file:

   - action type: choose based on the enum called 'ActionType' in the index.ts file the action type.
   - oldPath: you can specify full directory or relative directory with respect to index.ts! (to be specified for all methods).
   - newPath: required for rename function only.
   - content: required for addToFile function only.

**_Note: _**
Order of inputs inside command.txt doesn't matter because regex matching is used to extract the value of each input!

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request for any improvements or features you'd like to see.
