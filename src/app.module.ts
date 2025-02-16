import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { OpenSignService } from './opensign/opensign.service';
import { OpenSignController } from './opensign/opensign.controller';
import { WebhooksController } from './webhooks/webhooks.controller';
import { OpenSignModule } from './opensign/opensign.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [FilesModule, OpenSignModule, WebhooksModule, StorageModule],
  controllers: [AppController, OpenSignController, WebhooksController],
  providers: [AppService, OpenSignService],
})
export class AppModule {}
