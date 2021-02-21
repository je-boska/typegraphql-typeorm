import { UploadType } from '../types'
import cloudinary from 'cloudinary'

export const uploadToCloudinary = (image: UploadType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        allowed_formats: ['jpg', 'png'],
        public_id: '',
        folder: 'MRL',
      },
      (error: any, result: any) => {
        if (result) {
          console.log('Image uploaded,', result.secure_url)
          resolve(result)
        } else {
          reject(error)
        }
      }
    )
    const stream = image.createReadStream()
    stream.pipe(uploadStream)
  })
}
