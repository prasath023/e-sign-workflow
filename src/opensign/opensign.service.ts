import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { JsonStorageService } from '../storage/json-storage.service';
import * as dotenv from 'dotenv';


dotenv.config();

@Injectable()
export class OpenSignService {
  private API_TOKEN = process.env.OPEN_SIGN_API_TOKEN;
  private WEBHOOK_URL = process.env.WEBHOOK_URL;

  constructor(private readonly jsonStorage: JsonStorageService) {}

  async createTemplate(base64File: string, role2Email: string) {
    const signers = [
      {
        role: 'role2',
        email: 'placeholder_role2@example.com',
        widgets: [{ type: 'signature', page: 1, x: 300, y: 100, w: 38, h: 46 }],
      },
      {
        role: 'role3',
        email: '',
        widgets: [{ type: 'signature', page: 1, x: 350, y: 150, w: 38, h: 46 }],
      },
    ];

    try {
      const response = await axios.post(
        'https://sandbox.opensignlabs.com/api/v1/createtemplate',
        {
          file: base64File,
          title: 'Sequential Signing Document',
          sendInOrder: true,
          signers,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-token': this.API_TOKEN,
          },
        },
      );

      const objectId = response.data.objectId;

      this.jsonStorage.initDocument(objectId, [
        { role: 'role2', email: role2Email, signed: false },
        { role: 'role3', email: '', signed: false },
      ]);

      const previewUrl = await this.getTemplateFileUrl(objectId);

      return {
        message: 'Template created successfully!',
        templateId: objectId,
        previewUrl,
      };
    } catch (error) {
      throw new Error('Failed to create template');
    }
  }

  async registerWebhook() {
    try {
      const existingWebhooks = await this.getRegisteredWebhooks();
      if (
        existingWebhooks.some((webhook) => webhook.url === this.WEBHOOK_URL)
      ) {
        return { message: 'Webhook already registered', existingWebhooks };
      }

      const response = await axios.post(
        'https://sandbox.opensignlabs.com/api/v1/webhook',
        { url: this.WEBHOOK_URL, events: ['signing_completed'] },
        {
          headers: {
            Accept: 'application/json',
            'x-api-token': this.API_TOKEN,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error('Failed to register webhook');
    }
  }

  async getRegisteredWebhooks() {
    try {
      const response = await axios.get(
        'https://sandbox.opensignlabs.com/api/v1/webhook',
        {
          headers: {
            Accept: 'application/json',
            'x-api-token': this.API_TOKEN,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error fetching webhooks');
    }
  }

  async updateSignerEmail(objectId: string, role: string, newEmail: string) {
    throw new Error('Updating signer email is not supported.');
  }

  async getTemplateFileUrl(templateId: string) {
    try {
      const response = await axios.get(
        `https://sandbox.opensignlabs.com/api/v1/template/${templateId}`,
        {
          headers: {
            Accept: 'application/json',
            'x-api-token': this.API_TOKEN,
          },
        },
      );

      return { fileUrl: response.data.file };
    } catch (error) {
      throw new Error('Error fetching template file URL');
    }
  }

  async getSigningStatus(objectId: string) {
    return { signers: this.jsonStorage.getSigningStatus(objectId) };
  }
}
