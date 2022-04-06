import {FileCloudCommand} from "../FileCloudBase/FileCloudBase.types";
import FileCloud from "./index";

describe('FileCloud tests', () => {

  describe('exec tests', () => {
    const fileCloud: FileCloud = new FileCloud();

    test('add file successfully', () => {
      expect(fileCloud.exec([[FileCloudCommand.AddFile, 'ada/15.txt', '2']])).toEqual(['true']);
    });

    test('add file failed', () => {
      expect(fileCloud.exec([[FileCloudCommand.AddFile, 'ada/15.txt', '2']])).toEqual(['false']);
    });

    test('get file successfully', () => {
      expect(fileCloud.exec([[FileCloudCommand.GetFile, 'ada/15.txt']])).toEqual(['2']);
    });

    test('get file failed', () => {
      expect(fileCloud.exec([[FileCloudCommand.GetFile, 'ada/10.txt']])).toEqual(['']);
    });

    test('delete file successfully', () => {
      expect(fileCloud.exec([[FileCloudCommand.DeleteFile, 'ada/15.txt']])).toEqual(['2']);
    });

    test('delete file failed', () => {
      expect(fileCloud.exec([[FileCloudCommand.DeleteFile, 'ada/15.txt']])).toEqual(['']);
    });

    test('with multiple input, all success', () => {
      expect(fileCloud.exec([
        [FileCloudCommand.AddFile, 'ada/15.txt', '2'],
        [FileCloudCommand.GetFile, 'ada/15.txt'],
        [FileCloudCommand.DeleteFile, 'ada/15.txt'],
      ])).toEqual(['true', '2', '2']);
    });

    test('with multiple input, almost all failed', () => {
      expect(fileCloud.exec([
        [FileCloudCommand.AddFile, 'ada/10.txt', '2'],
        [FileCloudCommand.GetFile, 'ada/15.txt'],
        [FileCloudCommand.DeleteFile, 'ada/20.txt'],
      ])).toEqual(['true', '', '']);
    });

    test('with multiple directories, success', () => {
      expect(fileCloud.exec([
        [FileCloudCommand.AddFile, 'ada/dir/dir1/dir2/15.txt', '2'],
        [FileCloudCommand.GetFile, 'ada/dir/dir1/dir2/15.txt'],
        [FileCloudCommand.DeleteFile, 'ada/dir/dir1/dir2/15.txt'],
      ])).toEqual(['true', '2', '2']);
    });

    test('with multiple directories, failed', () => {
      expect(fileCloud.exec([
        [FileCloudCommand.AddFile, 'ada/dir/dir1/dir2/15.txt', '2'],
        [FileCloudCommand.AddFile, 'ada/dir/dir1/dir2/15.txt', '2'],
        [FileCloudCommand.GetFile, 'ada/dir/dir1/dir1/10.txt'],
        [FileCloudCommand.DeleteFile, 'ada/dir/dir2/dir2/20.txt'],
      ])).toEqual(['true', 'false', '', '']);
    });
  })
});