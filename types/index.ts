export interface Article {
  id: string
  title: string
  content: string
  source: string
  sourceUrl: string
  author: string
  publishTime: string
  collectTime: string
  tags: string[]
  category: string
  readCount: number
  likeCount: number
  status: "pending" | "rewritten" | "published"
}

export interface RewriteStyle {
  name: string
  prompt: string
}

export interface RewriteRecord {
  id: string
  articleId: string
  originalTitle: string
  rewrittenTitle: string
  originalContent: string
  rewrittenContent: string
  style: string
  customPrompt?: string
  createdAt: string
}

export interface PublicationRecord {
  id: string
  articleId: string
  accountId: string
  title: string
  publishedAt: string
  status: "success" | "failed" | "pending"
  viewCount?: number
  likeCount?: number
}

export interface WeChatAccount {
  id: string
  name: string
  appId: string
  isConnected: boolean
  lastSyncAt?: string
}

export interface AppConfig {
  aiApiKey: string
  aiModel: string
  collectInterval: number
  autoRewrite: boolean
  theme: "light" | "dark"
}

export interface GeneratedImage {
  id: string
  articleId: string
  url: string
  prompt: string
  associatedParagraph?: number
  createdAt: string
  status: "generating" | "completed" | "failed"
}
