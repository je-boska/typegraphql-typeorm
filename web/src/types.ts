export type BookType = {
  id: string
  title: string
  author: string
  isPublished: boolean
  user: UserType
}

export type UserType = {
  name: string
}
