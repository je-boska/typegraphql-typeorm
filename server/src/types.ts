import { Request } from 'express'
import { Stream } from 'stream'

export type ContextType = {
  req: Request
}

export type UploadType = {
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => Stream
}
