const fs = require("fs/promises");
// Predefined actions
enum ActionType {
  CREATE_FILE = "CREATE_FILE",
  DELETE_FILE = "DELETE_FILE",
  RENAME_FILE = "RENAME_FILE",
  ADD_TO_FILE = "ADD_TO_FILE",
}

const isValidAction = (action: string): ActionType | null => {
  if (Object.values(ActionType).includes(action as ActionType)) {
    return action as ActionType;
  }
  return null;
};

const actionExtractor = (value: string) => {
  // Matches "action=" followed by any characters except space and newline
  const actionValueRegex = /action=([^ \n]+)/;

  const match = value.match(actionValueRegex);
  let result = "";
  if (match && match[1]) {
    result = match[1];
  }
  return result;
};
const oldPathExtractor = (value: string) => {
  // Matches "oldPath=" followed by any characters except space and newline
  const oldPath = /oldPath=([^ \n]+)/;

  const match = value.match(oldPath);
  let result = "";
  if (match && match[1]) {
    result = match[1];
  }
  return result;
};

const newPathExtractor = (value: string) => {
  // Matches "newPath=" followed by any characters except space and newline
  const newPath = /newPath=([^ \n]+)/;

  const match = value.match(newPath);
  let result = "";
  if (match && match[1]) {
    result = match[1];
  }
  return result;
};
const contentExtractor = (value: string) => {
  // Matches "content=" followed by any characters except space and newline
  const content = /content=(.*)/;
  const match = value.match(content);
  let result = "";
  if (match && match[1]) {
    result = match[1];
  }
  return result;
};
(async () => {
  //   Create file action:
  const createFile = async (path: string) => {
    try {
      // Checking if file exsists if file was not found then it will trigger an error that we will catch to create the file then!
      const fileExsistingHandler = await fs.open(path, "r");
      // We should close the file after reading from
      fileExsistingHandler.close();
      return console.log(
        `File of path ${path} already exsists click on the path with ctrl to view!`
      );
    } catch (error) {
      const fileCreatedHandler = await fs.open(path, "w");
      console.log(
        `File created successfully click here with ctrl to view: ${path}`
      );
      fileCreatedHandler.close();
    }
  };

  //   Delete file action:
  const deleteFile = async (path: string) => {
    try {
      // We can also using command fs.rm() equivalent to rm (-rf) file  ; -rf equivalent add options {recursive:true, force:true}!
      await fs.unlink(path);
      console.log("File removed from directory!");
    } catch (error) {
      console.log(`An error occured while deleting the file ${error}`);
    }
  };

  //   Rename file action:
  const renameFile = async (oldPath: string, newPath: string) => {
    try {
      await fs.rename(oldPath, newPath);
      console.log("File renamed successfully!");
    } catch (error) {
      console.log(`An error occured while renaming the file ${error}`);
    }
  };

  //   Add content to file action:
  let contentAdded = "";
  const addToFile = async (path: string, content: string) => {
    try {
      if (contentAdded === content) return console.log("Content already found");
      // 'a' symbol to append to the file!
      const fileHandler = await fs.open(path, "a");
      contentAdded = content;
      fileHandler.write(content);
      console.log("Content has been appended successfully to the file!");
    } catch (error) {
      console.log(`An error occured while renaming the file ${error}`);
    }
  };

  const actionManager = async (data: string) => {
    // This is the extracted action from the file
    const inputAction = actionExtractor(data);
    // This is the actual matched action with the enum
    const actualAction = isValidAction(inputAction);

    if (actualAction) {
      const oldPath = oldPathExtractor(data);
      switch (actualAction) {
        case ActionType.CREATE_FILE:
          await createFile(oldPath);
          break;

        case ActionType.DELETE_FILE:
          deleteFile(oldPath);
          break;

        case ActionType.RENAME_FILE:
          const newPath = newPathExtractor(data);
          renameFile(oldPath, newPath);
          break;

        case ActionType.ADD_TO_FILE:
          const content = contentExtractor(data);
          addToFile(oldPath, content);
          break;

        default:
          break;
      }
    } else {
      console.log("Invalid action");
    }
  };

  // To read the file we have to open the file first
  const fileHandler = await fs.open("./command.txt");
  //   Defining  which file/directory we need to watch
  const watcher = fs.watch("./command.txt");

  // Since file handler is an event emitter as stated in node docs: https://nodejs.org/docs/latest/api/fs.html#class-filehandle we can use event emitter module to emit and receive event of the change hapenning to the file.
  fileHandler.on("change", async () => {
    //   Specifying here the buffer allocation size required to only use the needed amount from the memory (this is considered an optimization technique not to define a buffer filled with extra 0s).
    const size = (await fileHandler.stat()).size;
    //   Defining the buffer
    const buffer = Buffer.alloc(size);

    //   Specifying read properties here we need to define those to read from the beginning till the end.
    const offset = 0;
    const length = buffer.byteLength;
    const position = 0;

    //   File content (here we can also not save the data into content const knowing that it changing by reference directly on the buffer!)
    const content = await fileHandler.read(buffer, offset, length, position);

    // Scenario 2 of not saving content
    const myContent = buffer.toString("utf-8");
    actionManager(myContent);
  });

  //   File watcher
  for await (const event of watcher) {
    if (event.eventType === "change") {
      // Emitting an event of change on the file watched!
      fileHandler.emit("change");
    }
  }
})();
