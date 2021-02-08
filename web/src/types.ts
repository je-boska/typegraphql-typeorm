export type PostType = {
  id: string
  title: string
  body: string
  name: string
  userId: string
}

export type UserType = {
  id: string
  name: string
  email: string
  follows: OtherUserType[]
}

export type OtherUserType = {
  id: string
  name: string
}
