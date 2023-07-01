import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  exports: [CloudinaryProvider, CloudinaryService],
  providers: [CloudinaryService, CloudinaryProvider],
  controllers: [CloudinaryController],
})
export class CloudinaryModule {}
