"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/contexts/app-context"
import type { Article } from "@/types"
import { Search, Download } from "lucide-react"

const platforms = [
  { value: "wechat", label: "微信公众号" },
  { value: "zhihu", label: "知乎" },
  { value: "weibo", label: "微博" },
  { value: "baidu", label: "百度热搜" },
]

export function CollectionModule() {
  const { addArticles, setIsLoading, isLoading } = useApp()
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [keyword, setKeyword] = useState("")
  const [collectedArticles, setCollectedArticles] = useState<Article[]>([])

  const handleCollect = async () => {
    if (!selectedPlatform) return

    setIsLoading(true)

    // 模拟采集过程
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockCollectedArticles: Article[] = [
      {
        id: `collected-${Date.now()}-1`,
        title: `${keyword || "热门"} - 最新行业动态分析`,
        content: "这是通过关键词采集到的最新内容...",
        source: platforms.find((p) => p.value === selectedPlatform)?.label || "",
        sourceUrl: "https://example.com/collected1",
        author: "行业专家",
        publishTime: new Date().toISOString(),
        collectTime: new Date().toISOString(),
        tags: [keyword || "热门", "行业", "动态"],
        category: "行业资讯",
        readCount: Math.floor(Math.random() * 10000),
        likeCount: Math.floor(Math.random() * 1000),
        status: "pending",
      },
      {
        id: `collected-${Date.now()}-2`,
        title: `深度解读：${keyword || "热门"}领域的发展趋势`,
        content: "深入分析当前市场趋势和未来发展方向...",
        source: platforms.find((p) => p.value === selectedPlatform)?.label || "",
        sourceUrl: "https://example.com/collected2",
        author: "资深分析师",
        publishTime: new Date().toISOString(),
        collectTime: new Date().toISOString(),
        tags: [keyword || "热门", "趋势", "分析"],
        category: "深度分析",
        readCount: Math.floor(Math.random() * 10000),
        likeCount: Math.floor(Math.random() * 1000),
        status: "pending",
      },
    ]

    setCollectedArticles(mockCollectedArticles)
    setIsLoading(false)
  }

  const handleImport = () => {
    addArticles(collectedArticles)
    setCollectedArticles([])
  }

  return (
    <div className="space-y-6">
      {/* 采集控制面板 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            内容采集控制台
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>采集平台</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="选择采集平台" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>关键词</Label>
              <Input placeholder="输入采集关键词" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={handleCollect} disabled={!selectedPlatform || isLoading} className="w-full">
                {isLoading ? "采集中..." : "开始采集"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 采集结果 */}
      {collectedArticles.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              采集结果 ({collectedArticles.length} 篇)
            </CardTitle>
            <Button onClick={handleImport}>导入素材库</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {collectedArticles.map((article) => (
                <div key={article.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{article.content}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>来源: {article.source}</span>
                        <span>作者: {article.author}</span>
                        <span>阅读: {article.readCount}</span>
                        <span>点赞: {article.likeCount}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
