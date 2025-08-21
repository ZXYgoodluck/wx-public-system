"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useApp } from "@/contexts/app-context"
import { rewriteStyles } from "@/data/mock-data"
import type { Article, RewriteRecord } from "@/types"
import { PenTool, Wand2, History, FileText, RotateCcw, Copy, Check } from "lucide-react"

export function RewriteModule() {
  const { articles, rewrites, addRewrite, updateArticle, setIsLoading, isLoading } = useApp()
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [selectedStyle, setSelectedStyle] = useState("general")
  const [customPrompt, setCustomPrompt] = useState("")
  const [rewrittenContent, setRewrittenContent] = useState("")
  const [rewrittenTitle, setRewrittenTitle] = useState("")
  const [copied, setCopied] = useState(false)

  // Filter articles that can be rewritten (pending or already rewritten)
  const availableArticles = articles.filter((article) => article.status !== "published")

  // Get rewrite history for selected article
  const articleRewrites = useMemo(() => {
    if (!selectedArticle) return []
    return rewrites
      .filter((rewrite) => rewrite.articleId === selectedArticle.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [rewrites, selectedArticle])

  const handleSelectArticle = (articleId: string) => {
    const article = articles.find((a) => a.id === articleId)
    if (article) {
      setSelectedArticle(article)
      setRewrittenContent("")
      setRewrittenTitle("")
    }
  }

  const handleRewrite = async () => {
    if (!selectedArticle) return

    setIsLoading(true)

    // Simulate AI rewriting process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const style = rewriteStyles[selectedStyle]
    const prompt = selectedStyle === "custom" ? customPrompt : style.prompt

    // Mock rewritten content
    const mockRewrittenTitle = `${selectedArticle.title} (${style?.name || "自定义"}改写版)`
    const mockRewrittenContent = `${selectedArticle.content}\n\n[AI改写内容]\n根据${style?.name || "自定义"}风格重新改写的内容。这里展示了经过AI处理后的文章内容，保持了原文的核心观点，但在表达方式和语言风格上进行了优化调整。\n\n改写要点：\n- 保持原文核心信息不变\n- 优化语言表达和逻辑结构\n- 适应目标读者群体的阅读习惯\n- 增强内容的吸引力和可读性`

    setRewrittenTitle(mockRewrittenTitle)
    setRewrittenContent(mockRewrittenContent)

    // Add to rewrite history
    const rewriteRecord: RewriteRecord = {
      id: `rewrite-${Date.now()}`,
      articleId: selectedArticle.id,
      originalTitle: selectedArticle.title,
      rewrittenTitle: mockRewrittenTitle,
      originalContent: selectedArticle.content,
      rewrittenContent: mockRewrittenContent,
      style: selectedStyle,
      customPrompt: selectedStyle === "custom" ? customPrompt : undefined,
      createdAt: new Date().toISOString(),
    }

    addRewrite(rewriteRecord)
    updateArticle(selectedArticle.id, { status: "rewritten" })
    setIsLoading(false)
  }

  const handleApplyRewrite = () => {
    if (!selectedArticle || !rewrittenContent) return

    updateArticle(selectedArticle.id, {
      title: rewrittenTitle,
      content: rewrittenContent,
      status: "rewritten",
    })

    // Update selected article to reflect changes
    setSelectedArticle({
      ...selectedArticle,
      title: rewrittenTitle,
      content: rewrittenContent,
      status: "rewritten",
    })
  }

  const handleLoadRewrite = (rewrite: RewriteRecord) => {
    setRewrittenTitle(rewrite.rewrittenTitle)
    setRewrittenContent(rewrite.rewrittenContent)
    setSelectedStyle(rewrite.style)
    if (rewrite.customPrompt) {
      setCustomPrompt(rewrite.customPrompt)
    }
  }

  const handleCopyContent = async () => {
    if (rewrittenContent) {
      await navigator.clipboard.writeText(rewrittenContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getWordCount = (text: string) => {
    return text.replace(/\s+/g, "").length
  }

  return (
    <div className="space-y-6">
      {/* Article Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            AI智能改写
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>选择文章</Label>
              <Select value={selectedArticle?.id || ""} onValueChange={handleSelectArticle}>
                <SelectTrigger>
                  <SelectValue placeholder="选择要改写的文章" />
                </SelectTrigger>
                <SelectContent>
                  {availableArticles.map((article) => (
                    <SelectItem key={article.id} value={article.id}>
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-64">{article.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {article.status === "pending" ? "待处理" : "已改写"}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>改写风格</Label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(rewriteStyles).map(([key, style]) => (
                    <SelectItem key={key} value={key}>
                      {style.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">自定义风格</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedStyle === "custom" && (
            <div className="space-y-2">
              <Label>自定义提示词</Label>
              <Textarea
                placeholder="请输入自定义的改写要求和风格描述..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {selectedStyle !== "custom" && rewriteStyles[selectedStyle] && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">{rewriteStyles[selectedStyle].prompt}</p>
            </div>
          )}

          <Button
            onClick={handleRewrite}
            disabled={!selectedArticle || isLoading || (selectedStyle === "custom" && !customPrompt.trim())}
            className="w-full"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {isLoading ? "AI改写中..." : "开始改写"}
          </Button>
        </CardContent>
      </Card>

      {selectedArticle && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                原文内容
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">标题</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg text-sm">{selectedArticle.title}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">内容</Label>
                  <ScrollArea className="h-64 mt-1 p-3 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedArticle.content}</p>
                  </ScrollArea>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>字数: {getWordCount(selectedArticle.content)}</span>
                  <span>来源: {selectedArticle.source}</span>
                  <span>作者: {selectedArticle.author}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rewritten Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  改写结果
                </div>
                {rewrittenContent && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyContent}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" onClick={handleApplyRewrite}>
                      应用改写
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rewrittenContent ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">改写标题</Label>
                    <p className="mt-1 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm border border-green-200 dark:border-green-800">
                      {rewrittenTitle}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">改写内容</Label>
                    <ScrollArea className="h-64 mt-1 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm whitespace-pre-wrap">{rewrittenContent}</p>
                    </ScrollArea>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>字数: {getWordCount(rewrittenContent)}</span>
                    <span>
                      变化: {getWordCount(rewrittenContent) > getWordCount(selectedArticle.content) ? "+" : ""}
                      {getWordCount(rewrittenContent) - getWordCount(selectedArticle.content)}
                    </span>
                    <span>风格: {rewriteStyles[selectedStyle]?.name || "自定义"}</span>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>选择文章和改写风格后，点击"开始改写"</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rewrite History */}
      {selectedArticle && articleRewrites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              改写历史 ({articleRewrites.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articleRewrites.map((rewrite) => (
                <div key={rewrite.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{rewriteStyles[rewrite.style]?.name || "自定义"}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(rewrite.createdAt).toLocaleString("zh-CN")}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm mb-2">{rewrite.rewrittenTitle}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{rewrite.rewrittenContent}</p>
                      {rewrite.customPrompt && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs">
                          <span className="font-medium">自定义提示: </span>
                          {rewrite.customPrompt}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleLoadRewrite(rewrite)}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
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
