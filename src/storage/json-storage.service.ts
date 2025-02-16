import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JsonStorageService {
  private filePath = path.join(
    process.cwd(),
    'src',
    'storage',
    'signing-status.json',
  );

  private readJson(): any {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({}, null, 2));
    }
    const fileContent = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(fileContent);
  }

  private writeJson(data: any): void {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  public initDocument(
    objectId: string,
    signers: { role: string; email: string; signed: boolean }[],
  ) {
    const data = this.readJson();

    if (!data[objectId]) {
      data[objectId] = { signers };
      this.writeJson(data);
    } else {
      console.log(`Entry for ${objectId} already exists!`);
    }
  }

  public updateSigningStatus(objectId: string, role: string) {
    const data = this.readJson();

    if (!data[objectId]) {
      return;
    }

    data[objectId].signers = data[objectId].signers.map((signer) =>
      signer.role === role ? { ...signer, signed: true } : signer,
    );

    this.writeJson(data);
  }

  public updateRole3Email(objectId: string, email: string) {
    const data = this.readJson();

    if (data[objectId]) {
      data[objectId].signers = data[objectId].signers.map((signer) =>
        signer.role === 'role3' ? { ...signer, email } : signer,
      );

      this.writeJson(data);
    } else {
      console.log(`No entry found for objectId: ${objectId}`);
    }
  }

  public getSigningStatus(objectId: string) {
    const data = this.readJson();

    if (data[objectId]) {
      return data[objectId]?.signers || [];
    } else {
      return [];
    }
  }
}
