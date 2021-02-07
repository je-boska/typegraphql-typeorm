export type PostType = {
  id: string
  title: string
  body: string
  user: {
    id: string
    name: string
  }
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
