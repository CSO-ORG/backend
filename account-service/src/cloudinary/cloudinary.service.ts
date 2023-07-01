import { ACCOUNT_SERVICE_MESSAGE, BadRequestError } from '@cso-org/shared';
import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CloudinaryService {
  async upload(image: string) {
    try {
      const result = await v2.uploader.upload(image, {
        public_id: uuidv4(),
        resource_type: 'auto',
      });
      return JSON.stringify({
        public_id: result.public_id,
        url: result.secure_url,
      });
    } catch (err) {
      throw new BadRequestError(ACCOUNT_SERVICE_MESSAGE.IMAGE_NOT_UPLOADED);
    }
  }
  async remove(public_id: string) {
    return v2.uploader.destroy(public_id, (err) => {
      if (err) {
        throw new BadRequestError(ACCOUNT_SERVICE_MESSAGE.IMAGE_NOT_REMOVED);
      }
      return JSON.stringify({
        success: true,
      });
    });
  }
}
