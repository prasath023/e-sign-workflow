import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { OpenSignModule } from '../opensign/opensign.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [OpenSignModule, StorageModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
