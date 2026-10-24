export type TPostStatus = "DRAFT" | "PUBLISHED" | "UNLISTED"
export type TPostType = "POST" | "PAGE"

// Post as passed to pages (dates serialized to ISO strings)
export type TPost = {
  id: string
  slug: string
  title: string
  summary: string
  coverImage: string | null
  tags: string[]
  category: string | null
  status: TPostStatus
  type: TPostType
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type TPostDetail = TPost & { content: string }

export type TAttachment = {
  id: string
  filename: string
  mimeType: string
  size: number
  url: string
  createdAt: string
}

export type TTags = {
  [tagName: string]: number
}

export type ThemeType = "dark" | "light"
