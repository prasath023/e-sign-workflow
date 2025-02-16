import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  async convertToBase64(filePath: string): Promise<string> {
    const fileBuffer = await fs.promises.readFile(filePath);
    return fileBuffer.toString('base64');
  }

  getFilePath(fileName: string): string {
    return path.join(__dirname, '..', '..', 'uploads', fileName);
  }

  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }
}
