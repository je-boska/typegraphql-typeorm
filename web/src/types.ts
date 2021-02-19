export type PostType = {
  id: string
  title: string
  body: string
  image: string
  createdAt: string
  updatedAt: string
  name: string
  userId: string
}

export type UserType = {
  id: string
  name: string
  email: string
  about: string
  createdAt: string
  follows: OtherUserType[]
}

export type OtherUserType = {
  id: string
  name: string
  about: string
  createdAt: string
}
