import {
  FileCloudCommand, FileStructTypeName,
  TDirectory,
  TFileCloudAddInput, TFileCloudAddOutput, TFileCloudDeleteInput,
  TFileCloudDeleteOutput, TFileCloudGetInput,
  TFileCloudGetOutput, TFileCloudInput, TFileCloudOutput
} from "../FileCloudBase/FileCloudBase.types";
import FileCloudBase from "../FileCloudBase";

export default class FileCloud extends FileCloudBase {
  data: TDirectory = {
    type: FileStructTypeName.Directory,
    data: {}
  }

  protected createDirectory(path: string[], currentDirectory: TDirectory = this.data):TDirectory {
    if (path.length === 0) {
      return currentDirectory;
    }

    const nextDirectory = currentDirectory.data[path[0]];

    if (nextDirectory && nextDirectory.type === FileStructTypeName.Directory) {
      return this.createDirectory(path.slice(1), nextDirectory);
    } else if (!nextDirectory) {
      currentDirectory.data = {
        ...currentDirectory.data,
        [path[0]]: {
          type: FileStructTypeName.Directory,
          data: {}
        }
      }

      return this.createDirectory(path.slice(1), currentDirectory.data[path[0]] as TDirectory);
    }
  }

  protected getDirectory(path: string[], currentDirectory: TDirectory = this.data): TDirectory | null {
    if (path.length === 0) return currentDirectory

    const nextDirectory = currentDirectory.data[path[0]];
    if (nextDirectory && nextDirectory.type === FileStructTypeName.Directory) {
      return this.getDirectory(path.slice(1), nextDirectory)
    }
    return null
  }

  protected execAddFileCommand(input: TFileCloudAddInput): TFileCloudAddOutput {
    const [_, path, size] = input;
    const directoryAndFile = path.split('/');
    const foundDirectory = this.getDirectory(directoryAndFile.slice(0, -1));
    const fileName = directoryAndFile[directoryAndFile.length - 1];
    const targetDirectory = foundDirectory ?? this.createDirectory(directoryAndFile.slice(0, -1));

    if (!targetDirectory.data[fileName]) {
      targetDirectory.data = {
        ...targetDirectory.data,
        [fileName]: {
          type: FileStructTypeName.File,
          size: size
        }
      }

      return "true";
    }

    return "false";
  }

  protected execGetFileCommand(input: TFileCloudGetInput): TFileCloudGetOutput {
    const [_, path] = input;
    const directoryAndFile = path.split('/');
    const foundDirectory = this.getDirectory(directoryAndFile.slice(0, -1));
    const fileName = directoryAndFile[directoryAndFile.length - 1];
    const foundItem = foundDirectory?.data[fileName];

    if (foundItem?.type === FileStructTypeName.File) {
      return foundItem.size ;
    }
    return '';
  }

  protected execDeleteFileCommand(input: TFileCloudDeleteInput): TFileCloudDeleteOutput {
    const [_, path] = input;
    const directoryAndFile = path.split('/');
    const foundDirectory = this.getDirectory(directoryAndFile.slice(0, -1));
    const fileName = directoryAndFile[directoryAndFile.length - 1];
    const foundItem = foundDirectory?.data[fileName];

    if (foundItem?.type === FileStructTypeName.File) {
      delete foundDirectory.data[fileName];

      return foundItem.size
    }

    return ''
  }

  exec(inputs: TFileCloudInput[]): TFileCloudOutput[] {
    return inputs.map(input => {
      switch (input[0]) {
        case FileCloudCommand.AddFile:
          return this.execAddFileCommand(input)
        case FileCloudCommand.GetFile:
          return this.execGetFileCommand(input)
        case FileCloudCommand.DeleteFile:
          return this.execDeleteFileCommand(input)
        default:
          return ''
      }
    })
  }
}