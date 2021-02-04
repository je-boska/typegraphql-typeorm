export type PostType = {
  id: string
  title: string
  body: string
  user: UserType
}

export type UserType = {
  id: string
  name: string
}
