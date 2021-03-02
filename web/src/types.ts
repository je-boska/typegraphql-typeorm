export type PostType = {
  id: string
  title: string
  body: string
  image: string
  imageId: string
  createdAt: string
  updatedAt: string
  name: string
  avatar: string
  userId: string
}

export type UserType = {
  id: string
  name: string
  email: string
  about: string
  avatar: string
  avatarId: string
  createdAt: string
  follows: OtherUserType[]
}

export type OtherUserType = {
  id: string
  name: string
  about: string
  avatar: string
  createdAt: string
}
