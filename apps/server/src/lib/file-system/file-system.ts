import { LocalFileSystem } from './local-file-system.js';

export interface IFileSystem {
  createDir(dirPath: string): void;
  exists(filePath: string): boolean;
  read(filePath: string): Buffer;
  write(filePath: string, content: string): void;
}

export enum FileSystems {
  LOCAL = 'LOCAL',
}

class FileSystem {
  private fileSystems: { [key in FileSystems]: IFileSystem } = {
    [FileSystems.LOCAL]: new LocalFileSystem(),
  };

  createDir(fileSystem: FileSystems, path: string): void {
    this.fileSystems[fileSystem].createDir(path);
  }
  exists(fileSystem: FileSystems, filePath: string): boolean {
    return this.fileSystems[fileSystem].exists(filePath);
  }
  read(fileSystem: FileSystems, filePath: string): Buffer {
    return this.fileSystems[fileSystem].read(filePath);
  }
  write(fileSystem: FileSystems, filePath: string, content: string): void {
    this.fileSystems[fileSystem].write(filePath, content);
  }
}

export const fileSystem = new FileSystem();
