"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useApp } from "@/contexts/app-context"
import type { Article, PublicationRecord, WeChatAccount } from "@/types"
import { Send, Eye, TrendingUp, CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react"

export function PublishModule() {
  const { articles, accounts, publications, generatedImages, addPublication, updateArticle, setIsLoading, isLoading } =
    useApp()
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [showPreview, setShowPreview] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Filter articles that are ready to publish (rewritten status)
  const publishableArticles = articles.filter((article) => article.status === "rewritten")

  // Get connected accounts
  const connectedAccounts = accounts.filter((account) => account.isConnected)

  // Get images for selected article
  const articleImages = useMemo(() => {
    if (!selectedArticle) return []
    return generatedImages.filter((image) => image.articleId === selectedArticle.id && image.status === "completed")
  }, [generatedImages, selectedArticle])

  // Get publication statistics
  const publishStats = useMemo(() => {
    const total = publications.length
    const successful = publications.filter((p) => p.status === "success").length
    const failed = publications.filter((p) => p.status === "failed").length
    const pending = publications.filter((p) => p.status === "pending").length

    return { total, successful, failed, pending }
  }, [publications])

  const handleSelectArticle = (articleId: string) => {
    const article = articles.find((a) => a.id === articleId)
    if (article) {
      setSelectedArticle(article)
    }
  }

  const handlePublish = async () => {
    if (!selectedArticle || !selectedAccount) return

    setIsLoading(true)

    // Create publication record
    const publicationId = `pub-${Date.now()}`
    const newPublication: PublicationRecord = {
      id: publicationId,
      articleId: selectedArticle.id,
      accountId: selectedAccount,
      title: selectedArticle.title,
      publishedAt: new Date().toISOString(),
      status: "pending",
    }

    addPublication(newPublication)

    // Simulate publishing process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1
    const finalStatus = isSuccess ? "success" : "failed"

    // Update publication record
    const updatedPublication: PublicationRecord = {
      ...newPublication,
      status: finalStatus,
      viewCount: isSuccess ? Math.floor(Math.random() * 5000) + 100 : undefined,
      likeCount: isSuccess ? Math.floor(Math.random() * 500) + 10 : undefined,
    }

    // In a real app, we would update the publication in the context
    // For now, we'll add a new one to simulate the update
    addPublication(updatedPublication)

    if (isSuccess) {
      updateArticle(selectedArticle.id, { status: "published" })
    }

    setIsLoading(false)
    setSelectedArticle(null)
    setSelectedAccount("")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status: PublicationRecord["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: PublicationRecord["status"]) => {
    switch (status) {
      case "success":
        return "发布成功"
      case "failed":
        return "发布失败"
      case "pending":
        return "发布中"
      default:
        return "未知"
    }
  }

  return (
    <div className="space-y-6">
      {/* Publishing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">总发布</p>
                <p className="text-2xl font-bold">{publishStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">成功</p>
                <p className="text-2xl font-bold text-green-600">{publishStats.successful}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">失败</p>
                <p className="text-2xl font-bold text-red-600">{publishStats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">进行中</p>
                <p className="text-2xl font-bold text-yellow-600">{publishStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Publishing Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Article Selection and Publishing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              发布文章
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>选择文章</Label>
              <Select value={selectedArticle?.id || ""} onValueChange={handleSelectArticle}>
                <SelectTrigger>
                  <SelectValue placeholder="选择要发布的文章" />
                </SelectTrigger>
                <SelectContent>
                  {publishableArticles.map((article) => (
                    <SelectItem key={article.id} value={article.id}>
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-64">{article.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          已改写
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>选择公众号</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="选择发布账号" />
                </SelectTrigger>
                <SelectContent>
                  {connectedAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center gap-2">
                        <span>{account.name}</span>
                        <Badge variant="outline" className="text-xs">
                          已连接
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedArticle && (
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <h4 className="font-medium">{selectedArticle.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">{selectedArticle.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>分类: {selectedArticle.category}</span>
                  <span>标签: {selectedArticle.tags.join(", ")}</span>
                  <span>配图: {articleImages.length} 张</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={!selectedArticle} className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    预览
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>发布预览</DialogTitle>
                  </DialogHeader>
                  <PublishPreview article={selectedArticle} images={articleImages} />
                </DialogContent>
              </Dialog>

              <Button
                onClick={handlePublish}
                disabled={!selectedArticle || !selectedAccount || isLoading}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? "发布中..." : "立即发布"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Publications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>最近发布</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowHistory(true)}>
              查看全部
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {publications.length > 0 ? (
                <div className="space-y-3">
                  {publications
                    .slice(0, 5)
                    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                    .map((publication) => (
                      <div key={publication.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                        <div className="flex-shrink-0 mt-1">{getStatusIcon(publication.status)}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{publication.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {accounts.find((a) => a.id === publication.accountId)?.name} •{" "}
                            {formatDate(publication.publishedAt)}
                          </p>
                          {publication.status === "success" && publication.viewCount && (
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span>阅读 {publication.viewCount}</span>
                              <span>点赞 {publication.likeCount}</span>
                            </div>
                          )}
                        </div>
                        <Badge
                          variant={
                            publication.status === "success"
                              ? "default"
                              : publication.status === "failed"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {getStatusLabel(publication.status)}
                        </Badge>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Send className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">还没有发布记录</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Publishing History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>发布历史</DialogTitle>
          </DialogHeader>
          <PublishHistory publications={publications} accounts={accounts} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface PublishPreviewProps {
  article: Article | null
  images: Array<{ id: string; url: string; associatedParagraph?: number }>
}

function PublishPreview({ article, images }: PublishPreviewProps) {
  if (!article) return null

  const paragraphs = article.content.split("\n").filter((p) => p.trim().length > 0)

  return (
    <ScrollArea className="max-h-96">
      <div className="space-y-4 p-4 bg-white dark:bg-gray-900 rounded-lg border">
        {/* Article Header */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{article.title}</h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>{article.author}</span>
            <span>•</span>
            <span>{new Date(article.publishTime).toLocaleDateString("zh-CN")}</span>
          </div>
        </div>

        <Separator />

        {/* Article Content with Images */}
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => {
            const associatedImage = images.find((img) => img.associatedParagraph === index)

            return (
              <div key={index} className="space-y-3">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{paragraph}</p>
                {associatedImage && (
                  <div className="flex justify-center">
                    <img
                      src={associatedImage.url || "/placeholder.svg"}
                      alt={`Illustration for paragraph ${index + 1}`}
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            )
          })}

          {/* General images (not associated with specific paragraphs) */}
          {images
            .filter((img) => img.associatedParagraph === undefined)
            .map((image) => (
              <div key={image.id} className="flex justify-center">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt="Article illustration"
                  className="max-w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            ))}
        </div>

        {/* Article Footer */}
        <Separator />
        <div className="flex flex-wrap gap-2 justify-center">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

interface PublishHistoryProps {
  publications: PublicationRecord[]
  accounts: WeChatAccount[]
}

function PublishHistory({ publications, accounts }: PublishHistoryProps) {
  const sortedPublications = publications.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status: PublicationRecord["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <ScrollArea className="max-h-96">
      <div className="space-y-4">
        {sortedPublications.length > 0 ? (
          sortedPublications.map((publication) => (
            <div key={publication.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(publication.status)}
                    <h3 className="font-medium">{publication.title}</h3>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>账号: {accounts.find((a) => a.id === publication.accountId)?.name}</span>
                    <span>发布时间: {formatDate(publication.publishedAt)}</span>
                  </div>

                  {publication.status === "success" && publication.viewCount && (
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{publication.viewCount} 阅读</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{publication.likeCount} 点赞</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      publication.status === "success"
                        ? "default"
                        : publication.status === "failed"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {publication.status === "success"
                      ? "发布成功"
                      : publication.status === "failed"
                        ? "发布失败"
                        : "发布中"}
                  </Badge>
                  {publication.status === "success" && (
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>还没有发布记录</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
