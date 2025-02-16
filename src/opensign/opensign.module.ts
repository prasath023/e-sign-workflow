import { Module } from '@nestjs/common';
import { OpenSignController } from './opensign.controller';
import { OpenSignService } from './opensign.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [OpenSignController],
  providers: [OpenSignService],
  exports: [OpenSignService],
})
export class OpenSignModule {}
