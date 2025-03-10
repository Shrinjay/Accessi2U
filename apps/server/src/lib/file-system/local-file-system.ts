import * as fs from 'fs';
import { IFileSystem } from './file-system.js';
import { LOCAL_FILE_SYSTEM_BASE_PATH } from '../../config/env.js';
import path from 'path';

export class LocalFileSystem implements IFileSystem {
  private basePath: string;

  constructor() {
    this.basePath = LOCAL_FILE_SYSTEM_BASE_PATH;
  }

  async createDir(dirPath: string): Promise<void> {
    fs.mkdirSync(this._getPath(dirPath), { recursive: true });
  }

  async exists(filePath: string): Promise<boolean> {
    return fs.existsSync(this._getPath(filePath));
  }

  async read(filePath: string): Promise<Buffer> {
    return fs.readFileSync(this._getPath(filePath));
  }

  async write(filePath: string, content: string): Promise<void> {
    fs.writeFileSync(this._getPath(filePath), content, { flag: 'w+' });
  }

  _getPath(filePath: string): string {
    return path.join(this.basePath, filePath);
  }
}
