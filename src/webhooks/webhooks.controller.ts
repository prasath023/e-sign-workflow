import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { JsonStorageService } from '../storage/json-storage.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly jsonStorage: JsonStorageService) {}

  @Post('signing-updated')
  async handleSigningUpdate(@Body() payload: any, @Res() res) {

    const { role, objectId } = payload;
    const signers = this.jsonStorage.getSigningStatus(objectId);

    if (!signers || signers.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'No signing data found' });
    }

    const role2 = signers.find(s => s.role === 'role2');
    const role3 = signers.find(s => s.role === 'role3');

    if (role === 'role3') {
      if (!role2 || !role2.signed) {
        return res.status(HttpStatus.FORBIDDEN).json({ message: 'Role 3 cannot sign before Role 2' });
      }
      if (!role3 || !role3.email || role3.email.trim() === "") {
        return res.status(HttpStatus.FORBIDDEN).json({ message: 'Role 3 must have an email before signing' });
      }
    }

    this.jsonStorage.updateSigningStatus(objectId, role);

    return res.status(HttpStatus.OK).json({ message: 'Webhook processed' });
  }
  @Post('update-role3-email')
  async updateRole3Email(@Body() payload: any, @Res() res) {
    this.jsonStorage.updateRole3Email(payload.objectId, payload.email);
    return res
      .status(HttpStatus.OK)
      .json({ message: "Role 3's email updated" });
  }
}
