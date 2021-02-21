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
import { uploadToCloudinary } from '../utils/uploadToCloudinary'

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
    return uploadToCloudinary(image)
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
