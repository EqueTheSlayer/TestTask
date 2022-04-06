import {
  TDirectory,
  TFileCloudAddInput,
  TFileCloudAddOutput, TFileCloudDeleteInput, TFileCloudDeleteOutput, TFileCloudGetInput, TFileCloudGetOutput,
  TFileCloudInput,
  TFileCloudOutput
} from "./FileCloudBase.types";

export default abstract class FileCloudBase {
  protected abstract data: TDirectory;

  public abstract exec(inputs: TFileCloudInput[]): TFileCloudOutput[];

  protected abstract createDirectory(path: string[], currentDirectory: TDirectory): void;

  protected abstract getDirectory(path: string[]): TDirectory | null

  protected abstract execAddFileCommand(input: TFileCloudAddInput): TFileCloudAddOutput;

  protected abstract execGetFileCommand(input: TFileCloudGetInput): TFileCloudGetOutput;

  protected abstract execDeleteFileCommand(input: TFileCloudDeleteInput): TFileCloudDeleteOutput;
}