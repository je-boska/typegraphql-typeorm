import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import cloudinary from 'cloudinary'
import { GraphQLUpload } from 'apollo-server-express'
import { UploadType } from '../types'
import { isAuth } from '../middleware/isAuth'

@ObjectType()
class UploadResponse {
  @Field(() => String, { nullable: true })
  imageUrl?: string

  @Field(() => String, { nullable: true })
  imageId?: string

  @Field(() => String, { nullable: true })
  error?: string
}

@Resolver()
export class UploadResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => UploadResponse)
  async uploadImage(@Arg('image', () => GraphQLUpload!) image: UploadType) {
    const uploadToCloudinary = () => {
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

    return uploadToCloudinary()
      .then((result: any) => {
        return { imageUrl: result.secure_url, imageId: result.public_id }
      })
      .catch((err) => {
        console.log('error message:', err.message)
        return { error: err.message }
      })
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deleteImage(@Arg('imageId') imageId: string) {
    const result = await cloudinary.v2.uploader.destroy(imageId)
    console.log(result)
    return true
  }
}
