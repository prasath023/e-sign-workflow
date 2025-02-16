import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { OpenSignService } from './opensign.service';

@Controller('opensign')
export class OpenSignController {
  constructor(private readonly openSignService: OpenSignService) {}

  @Post('send')
  async sendToSign(@Body('base64File') base64File: string, @Body('role2Email') role2Email: string) {
    return this.openSignService.createTemplate(base64File, role2Email);
  }

  @Post('register-webhook')
  async registerWebhook() {
    return this.openSignService.registerWebhook();
  }

  @Get('get-webhooks')
  async getWebhooks() {
    return this.openSignService.getRegisteredWebhooks();
  }
  @Get('preview/:templateId')
  async getFileUrl(@Param('templateId') templateId: string) {
    return this.openSignService.getTemplateFileUrl(templateId);
  }

  @Get('status/:objectId')
  async getSigningStatus(@Param('objectId') objectId: string) {
    return this.openSignService.getSigningStatus(objectId);
  }
}
