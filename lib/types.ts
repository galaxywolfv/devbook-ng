export type Book = {
  _id: string,
  title: string,
  author: string,
  description: string
}

export enum Role {
  admin = 0,
  author = 1,
  default = 2,
}
