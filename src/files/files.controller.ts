import { Controller, Post, UploadedFile, UseInterceptors, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const base64File = await this.filesService.convertToBase64(file.path);
    return { base64File };
  }

  @Get('preview/:fileName')
  async previewFile(@Param('fileName') fileName: string, @Res() res: Response) {
    const filePath = this.filesService.getFilePath(fileName);
    if (!this.filesService.fileExists(filePath)) throw new NotFoundException('File not found');
    res.sendFile(filePath);
  }
}
