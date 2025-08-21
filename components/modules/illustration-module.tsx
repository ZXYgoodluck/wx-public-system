"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useApp } from "@/contexts/app-context"
import type { Article, GeneratedImage } from "@/types"
import { ImageIcon, Wand2, RefreshCw, Download, Trash2, Eye, Loader2 } from "lucide-react"

export function IllustrationModule() {
  const {
    articles,
    generatedImages,
    addGeneratedImage,
    updateGeneratedImage,
    deleteGeneratedImage,
    setIsLoading,
    isLoading,
  } = useApp()
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [customPrompt, setCustomPrompt] = useState("")
  const [selectedParagraph, setSelectedParagraph] = useState<number | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Filter articles that have content
  const availableArticles = articles.filter((article) => article.content.trim().length > 0)

  // Get images for selected article
  const articleImages = useMemo(() => {
    if (!selectedArticle) return []
    return generatedImages.filter((image) => image.articleId === selectedArticle.id)
  }, [generatedImages, selectedArticle])

  // Split article content into paragraphs
  const paragraphs = useMemo(() => {
    if (!selectedArticle) return []
    return selectedArticle.content.split("\n").filter((p) => p.trim().length > 0)
  }, [selectedArticle])

  const handleSelectArticle = (articleId: string) => {
    const article = articles.find((a) => a.id === articleId)
    if (article) {
      setSelectedArticle(article)
      setCustomPrompt("")
      setSelectedParagraph(null)
    }
  }

  const generateImagePrompt = (paragraph: string, title: string) => {
    // Generate a descriptive prompt based on content
    const keywords = paragraph
      .split(/[，。！？；：\s]+/)
      .slice(0, 5)
      .join(" ")
    return `根据文章"${title}"的内容，创建一个专业的插图，关键词：${keywords}，风格：现代简约，适合公众号文章配图`
  }

  const handleGenerateImage = async (paragraphIndex?: number) => {
    if (!selectedArticle) return

    setIsLoading(true)

    const targetParagraph = paragraphIndex !== undefined ? paragraphs[paragraphIndex] : selectedArticle.content
    const prompt = customPrompt || generateImagePrompt(targetParagraph, selectedArticle.title)

    // Create image record with generating status
    const imageId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newImage: GeneratedImage = {
      id: imageId,
      articleId: selectedArticle.id,
      url: "", // Will be set after "generation"
      prompt,
      associatedParagraph: paragraphIndex,
      createdAt: new Date().toISOString(),
      status: "generating",
    }

    addGeneratedImage(newImage)

    // Simulate image generation process
    await new Promise((resolve) => setTimeout(resolve, 4000))

    // Mock generated image URL
    const mockImageUrl = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(prompt)}`

    updateGeneratedImage(imageId, {
      url: mockImageUrl,
      status: "completed",
    })

    setIsLoading(false)
  }

  const handleRegenerateImage = async (image: GeneratedImage) => {
    updateGeneratedImage(image.id, { status: "generating" })

    // Simulate regeneration
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const newImageUrl = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(image.prompt)}&v=${Date.now()}`

    updateGeneratedImage(image.id, {
      url: newImageUrl,
      status: "completed",
    })
  }

  const handleDownloadImage = (imageUrl: string, imageName: string) => {
    // In a real app, this would download the actual image
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `${imageName}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Article Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            智能配图生成
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>选择文章</Label>
              <Select value={selectedArticle?.id || ""} onValueChange={handleSelectArticle}>
                <SelectTrigger>
                  <SelectValue placeholder="选择要配图的文章" />
                </SelectTrigger>
                <SelectContent>
                  {availableArticles.map((article) => (
                    <SelectItem key={article.id} value={article.id}>
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-64">{article.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {articleImages.filter((img) => img.status === "completed").length} 张图片
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>自定义提示词 (可选)</Label>
              <Input
                placeholder="描述您想要的图片风格和内容..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={() => handleGenerateImage()} disabled={!selectedArticle || isLoading} className="w-full">
            <Wand2 className="h-4 w-4 mr-2" />
            {isLoading ? "生成中..." : "为整篇文章生成配图"}
          </Button>
        </CardContent>
      </Card>

      {selectedArticle && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Article Content with Paragraph Selection */}
          <Card>
            <CardHeader>
              <CardTitle>文章内容</CardTitle>
              <p className="text-sm text-muted-foreground">点击段落为特定内容生成配图</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-3">{selectedArticle.title}</h3>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {paragraphs.map((paragraph, index) => {
                      const hasImage = articleImages.some(
                        (img) => img.associatedParagraph === index && img.status === "completed",
                      )
                      const isGenerating = articleImages.some(
                        (img) => img.associatedParagraph === index && img.status === "generating",
                      )

                      return (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedParagraph === index
                              ? "border-primary bg-primary/5"
                              : hasImage
                                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                                : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedParagraph(selectedParagraph === index ? null : index)}
                        >
                          <div className="flex items-start justify-between">
                            <p className="text-sm flex-1">{paragraph}</p>
                            <div className="flex items-center gap-2 ml-3">
                              {hasImage && (
                                <Badge variant="secondary" className="text-xs">
                                  已配图
                                </Badge>
                              )}
                              {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
                              {selectedParagraph === index && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleGenerateImage(index)
                                  }}
                                  disabled={isLoading}
                                >
                                  <Wand2 className="h-3 w-3 mr-1" />
                                  配图
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          {/* Generated Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>生成的配图 ({articleImages.filter((img) => img.status === "completed").length})</span>
                {articleImages.length > 0 && (
                  <Badge variant="outline">
                    {articleImages.filter((img) => img.status === "generating").length} 生成中
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {articleImages.length > 0 ? (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {articleImages.map((image) => (
                      <div key={image.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {image.status === "generating" ? (
                              <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin" />
                              </div>
                            ) : image.status === "completed" ? (
                              <img
                                src={image.url || "/placeholder.svg"}
                                alt="Generated illustration"
                                className="w-24 h-16 object-cover rounded-lg cursor-pointer"
                                onClick={() => setPreviewImage(image.url)}
                              />
                            ) : (
                              <div className="w-24 h-16 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                                <span className="text-red-500 text-xs">失败</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {image.associatedParagraph !== undefined
                                  ? `段落 ${image.associatedParagraph + 1}`
                                  : "整篇文章"}
                              </Badge>
                              <Badge
                                variant={
                                  image.status === "completed"
                                    ? "default"
                                    : image.status === "generating"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className="text-xs"
                              >
                                {image.status === "completed"
                                  ? "已完成"
                                  : image.status === "generating"
                                    ? "生成中"
                                    : "失败"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{image.prompt}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(image.createdAt).toLocaleString("zh-CN")}
                            </p>
                          </div>

                          {image.status === "completed" && (
                            <div className="flex flex-col gap-1">
                              <Button variant="ghost" size="sm" onClick={() => setPreviewImage(image.url)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleRegenerateImage(image)}>
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadImage(image.url, `${selectedArticle.title}-${image.id}`)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteGeneratedImage(image.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>还没有生成配图</p>
                    <p className="text-sm">选择文章后点击生成按钮开始创建</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>图片预览</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="flex justify-center">
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Preview"
                className="max-w-full max-h-96 object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
