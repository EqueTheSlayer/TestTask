export enum FileCloudCommand {
  AddFile = 'ADD_FILE',
  GetFile = 'GET_FILE',
  DeleteFile = 'DELETE_FILE'
}

export type TFileSize = `${number}`;

export type TFileCloudAddInput = [command: FileCloudCommand.AddFile, path: string, size: TFileSize]
export type TFileCloudGetInput = [command: FileCloudCommand.GetFile, path: string]
export type TFileCloudDeleteInput = [command: FileCloudCommand.DeleteFile, path: string]

export type TFileCloudInput = TFileCloudAddInput | TFileCloudGetInput | TFileCloudDeleteInput;

export type TFileCloudAddOutput = "true" | "false";
export type TFileCloudGetOutput = TFileSize | '';
export type TFileCloudDeleteOutput = TFileSize | '';

export type TFileCloudOutput = TFileCloudAddOutput | TFileCloudGetOutput | TFileCloudDeleteOutput;

export enum FileStructTypeName {
  File = 'file',
  Directory = 'directory'
}

export type TFile = {
  type: FileStructTypeName.File
  size: TFileSize;
}
export type TDirectory = {
  type: FileStructTypeName.Directory,
  data: { [name: string]: TFile | TDirectory }
}