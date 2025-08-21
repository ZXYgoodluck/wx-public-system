"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from "@/contexts/app-context"
import type { Article } from "@/types"
import { FileText, Search, Grid, List, Edit, Trash2, Eye, ThumbsUp } from "lucide-react"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  rewritten: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

const statusLabels = {
  pending: "待处理",
  rewritten: "已改写",
  published: "已发布",
}

export function MaterialsModule() {
  const { articles, updateArticle, deleteArticle } = useApp()
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSource, setSelectedSource] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)

  // Get unique values for filters
  const sources = useMemo(() => [...new Set(articles.map((a) => a.source))], [articles])
  const categories = useMemo(() => [...new Set(articles.map((a) => a.category))], [articles])

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSource = selectedSource === "all" || article.source === selectedSource
      const matchesStatus = selectedStatus === "all" || article.status === selectedStatus
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory

      return matchesSearch && matchesSource && matchesStatus && matchesCategory
    })
  }, [articles, searchTerm, selectedSource, selectedStatus, selectedCategory])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedArticles(filteredArticles.map((a) => a.id))
    } else {
      setSelectedArticles([])
    }
  }

  const handleSelectArticle = (articleId: string, checked: boolean) => {
    if (checked) {
      setSelectedArticles((prev) => [...prev, articleId])
    } else {
      setSelectedArticles((prev) => prev.filter((id) => id !== articleId))
    }
  }

  const handleBatchDelete = () => {
    selectedArticles.forEach((id) => deleteArticle(id))
    setSelectedArticles([])
  }

  const handleBatchStatusUpdate = (status: Article["status"]) => {
    selectedArticles.forEach((id) => updateArticle(id, { status }))
    setSelectedArticles([])
  }

  const handleEditArticle = (article: Article, updates: Partial<Article>) => {
    updateArticle(article.id, updates)
    setEditingArticle(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            素材管理 ({filteredArticles.length} 篇)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索标题..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="来源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部来源</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待处理</SelectItem>
                  <SelectItem value="rewritten">已改写</SelectItem>
                  <SelectItem value="published">已发布</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex border border-border rounded-md">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Batch Operations */}
          {selectedArticles.length > 0 && (
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">已选择 {selectedArticles.length} 篇文章</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBatchStatusUpdate("rewritten")}>
                  标记为已改写
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBatchStatusUpdate("published")}>
                  标记为已发布
                </Button>
                <Button size="sm" variant="destructive" onClick={handleBatchDelete}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  删除
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Articles List/Grid */}
      <Card>
        <CardContent className="p-0">
          {viewMode === "list" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="text-left">
                    <th className="p-4 w-12">
                      <Checkbox
                        checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-4 font-medium">标题</th>
                    <th className="p-4 font-medium w-24">来源</th>
                    <th className="p-4 font-medium w-24">状态</th>
                    <th className="p-4 font-medium w-32">采集时间</th>
                    <th className="p-4 font-medium w-24">数据</th>
                    <th className="p-4 font-medium w-24">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedArticles.includes(article.id)}
                          onCheckedChange={(checked) => handleSelectArticle(article.id, checked as boolean)}
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <h3 className="font-medium text-foreground line-clamp-1">{article.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{article.content}</p>
                          <div className="flex gap-1 mt-2">
                            {article.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">{article.source}</span>
                      </td>
                      <td className="p-4">
                        <Badge className={statusColors[article.status]}>{statusLabels[article.status]}</Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">{formatDate(article.collectTime)}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.readCount}
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {article.likeCount}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setEditingArticle(article)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>编辑素材</DialogTitle>
                            </DialogHeader>
                            <ArticleEditForm
                              article={editingArticle}
                              onSave={handleEditArticle}
                              onCancel={() => setEditingArticle(null)}
                            />
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Checkbox
                        checked={selectedArticles.includes(article.id)}
                        onCheckedChange={(checked) => handleSelectArticle(article.id, checked as boolean)}
                        className="mt-1"
                      />
                      <Badge className={statusColors[article.status]}>{statusLabels[article.status]}</Badge>
                    </div>
                    <CardTitle className="text-base line-clamp-2">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">{article.content}</p>

                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{article.source}</span>
                      <span>{formatDate(article.collectTime)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.readCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {article.likeCount}
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setEditingArticle(article)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>编辑素材</DialogTitle>
                          </DialogHeader>
                          <ArticleEditForm
                            article={editingArticle}
                            onSave={handleEditArticle}
                            onCancel={() => setEditingArticle(null)}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">暂无素材</h3>
              <p className="text-muted-foreground">请先采集一些内容或调整筛选条件</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface ArticleEditFormProps {
  article: Article | null
  onSave: (article: Article, updates: Partial<Article>) => void
  onCancel: () => void
}

function ArticleEditForm({ article, onSave, onCancel }: ArticleEditFormProps) {
  const [title, setTitle] = useState(article?.title || "")
  const [category, setCategory] = useState(article?.category || "")
  const [tags, setTags] = useState(article?.tags.join(", ") || "")
  const [content, setContent] = useState(article?.content || "")

  if (!article) return null

  const handleSave = () => {
    onSave(article, {
      title,
      category,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      content,
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>标题</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>分类</Label>
        <Input value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>标签 (用逗号分隔)</Label>
        <Input value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>内容</Label>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="resize-none" />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave}>保存</Button>
      </div>
    </div>
  )
}
