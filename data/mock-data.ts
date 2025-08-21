import type { Article, RewriteStyle, WeChatAccount } from "@/types"

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "人工智能如何改变内容创作行业",
    content:
      "随着AI技术的快速发展，内容创作行业正在经历前所未有的变革。从自动化写作到智能编辑，AI正在重新定义创作者的工作方式...",
    source: "微信公众号",
    sourceUrl: "https://example.com/article1",
    author: "科技观察者",
    publishTime: "2024-01-15T10:30:00Z",
    collectTime: "2024-01-16T08:00:00Z",
    tags: ["AI", "内容创作", "科技"],
    category: "科技",
    readCount: 5240,
    likeCount: 328,
    status: "pending",
  },
  {
    id: "2",
    title: "2024年社交媒体营销趋势分析",
    content:
      "社交媒体营销在2024年呈现出新的趋势和特点。短视频内容持续火热，直播带货成为主流，个性化推荐算法更加精准...",
    source: "知乎",
    sourceUrl: "https://example.com/article2",
    author: "营销专家",
    publishTime: "2024-01-14T15:20:00Z",
    collectTime: "2024-01-16T09:15:00Z",
    tags: ["营销", "社交媒体", "趋势"],
    category: "营销",
    readCount: 3180,
    likeCount: 256,
    status: "rewritten",
  },
  {
    id: "3",
    title: "远程工作的未来发展方向",
    content: "疫情改变了全球的工作模式，远程工作从临时措施变成了长期趋势。企业和员工都在适应这种新的工作方式...",
    source: "微博",
    sourceUrl: "https://example.com/article3",
    author: "职场导师",
    publishTime: "2024-01-13T11:45:00Z",
    collectTime: "2024-01-16T10:30:00Z",
    tags: ["远程工作", "职场", "未来"],
    category: "职场",
    readCount: 4520,
    likeCount: 389,
    status: "published",
  },
]

export const rewriteStyles: Record<string, RewriteStyle> = {
  general: {
    name: "通用风格",
    prompt: "请保持原文核心观点，优化语言表达，使内容更加流畅易读",
  },
  professional: {
    name: "专业风格",
    prompt: "请使用专业术语改写，增加权威性和专业性",
  },
  friendly: {
    name: "亲民风格",
    prompt: "请用通俗易懂的语言改写，贴近普通读者",
  },
  marketing: {
    name: "营销风格",
    prompt: "请增强感染力和说服力，适合营销推广",
  },
}

export const mockAccounts: WeChatAccount[] = [
  {
    id: "1",
    name: "科技前沿",
    appId: "wx1234567890",
    isConnected: true,
    lastSyncAt: "2024-01-16T08:00:00Z",
  },
  {
    id: "2",
    name: "营销洞察",
    appId: "wx0987654321",
    isConnected: false,
  },
]
