import { FileSystemEnum } from 'database';
import { LocalFileSystem } from './local-file-system.js';
import { MinIOFileSystem } from './minio-file-system.js';

export interface IFileSystem {
  createDir(dirPath: string): Promise<void>;
  exists(filePath: string): Promise<boolean>;
  read(filePath: string): Promise<Buffer>;
  write(filePath: string, content: string): Promise<void>;
}

class FileSystem {
  private fileSystems: { [key in FileSystemEnum]: IFileSystem } = {
    [FileSystemEnum.LOCAL]: new LocalFileSystem(),
    [FileSystemEnum.MINIO]: new MinIOFileSystem(),
  };

  async createDir(fileSystem: FileSystemEnum, path: string): Promise<void> {
    this.fileSystems[fileSystem].createDir(path);
  }

  async exists(fileSystem: FileSystemEnum, filePath: string): Promise<boolean> {
    return this.fileSystems[fileSystem].exists(filePath);
  }

  async read(fileSystem: FileSystemEnum, filePath: string): Promise<Buffer> {
    return this.fileSystems[fileSystem].read(filePath);
  }

  async write(fileSystem: FileSystemEnum, filePath: string, content: string): Promise<void> {
    this.fileSystems[fileSystem].write(filePath, content);
  }
}

export const fileSystem = new FileSystem();
