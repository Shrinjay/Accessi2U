import { Client } from 'minio';
import { IFileSystem } from './file-system.js';
import { MINIO_ACCESS_KEY_ID, MINIO_SECRET_ACCESS_KEY, MINIO_HOST, MINIO_BUCKET } from '../../config/env.js';

export class MinIOFileSystem implements IFileSystem {
  private client: Client;

  constructor() {
    this.client = new Client({
      endPoint: MINIO_HOST,
      port: 443,
      useSSL: true,
      accessKey: MINIO_ACCESS_KEY_ID,
      secretKey: MINIO_SECRET_ACCESS_KEY,
    });
  }

  async createDir(dirPath: string): Promise<void> {
    const exists = await this.client.bucketExists(dirPath);
    if (!exists) {
      await this.client.makeBucket(dirPath, '');
    }
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await this.client.statObject(MINIO_BUCKET, filePath);
      return true;
    } catch (err) {
      return false;
    }
  }

  async read(filePath: string): Promise<Buffer> {
    const stream = await this.client.getObject(MINIO_BUCKET, filePath);

    return new Promise((resolve, reject) => {
      let data = '';
      stream.on('data', (chunk) => {
        data += chunk;
      });
      stream.on('end', () => {
        resolve(new Buffer(data, 'utf-8'));
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  async write(filePath: string, content: string): Promise<void> {
    const buffer = Buffer.from(content, 'utf-8');
    await this.client.putObject(MINIO_BUCKET, filePath, buffer, buffer.length, {
      'Content-Type': 'text/plain',
    });
  }
}
