"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useApp } from "@/contexts/app-context"
import { FileText, Zap, ImageIcon, Send, TrendingUp, Clock, CheckCircle, BarChart3 } from "lucide-react"

export function DashboardModule() {
  const { setCurrentModule, articles, rewrites, generatedImages, publications } = useApp()

  const stats = {
    totalArticles: articles.length,
    pendingArticles: articles.filter((a) => a.status === "pending").length,
    rewrittenArticles: articles.filter((a) => a.status === "rewritten").length,
    publishedArticles: articles.filter((a) => a.status === "published").length,
    totalRewrites: rewrites.length,
    totalIllustrations: generatedImages.length,
    totalPublished: publications.length,
  }

  const recentActivities = [
    { type: "collection", title: "收集了3篇新文章", time: "2分钟前", icon: FileText },
    { type: "rewrite", title: "完成AI改写：《科技趋势分析》", time: "15分钟前", icon: Zap },
    { type: "illustration", title: "生成了5张配图", time: "30分钟前", icon: ImageIcon },
    { type: "publish", title: "发布到微信公众号：《市场洞察》", time: "1小时前", icon: Send },
  ]

  const quickActions = [
    { title: "收集内容", desc: "从各平台收集最新内容", module: "collection", icon: FileText, color: "bg-primary" },
    { title: "AI改写", desc: "智能改写文章内容", module: "rewrite", icon: Zap, color: "bg-secondary" },
    { title: "生成配图", desc: "AI自动生成文章配图", module: "illustration", icon: ImageIcon, color: "bg-accent" },
    { title: "一键发布", desc: "发布到微信公众号", module: "publish", icon: Send, color: "bg-primary" },
  ]

  return (
    <div className="space-y-8 p-6 animate-fade-in">
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            工作台
          </h1>
          <p className="text-lg text-muted-foreground mt-2">欢迎使用公众号内容管理系统</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-4 py-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            系统运行正常
          </Badge>
        </div>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up"
        style={{ animationDelay: "100ms" }}
      >
        <Card className="hover-lift border-primary/10 hover:border-primary/20 transition-all-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">总文章数</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalArticles}</div>
            <p className="text-sm text-muted-foreground mt-1">待处理 {stats.pendingArticles} 篇</p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-secondary/10 hover:border-secondary/20 transition-all-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">AI改写次数</CardTitle>
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Zap className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalRewrites}</div>
            <p className="text-sm text-muted-foreground mt-1">本月完成改写</p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-accent/10 hover:border-accent/20 transition-all-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">生成配图</CardTitle>
            <div className="p-2 bg-accent/10 rounded-lg">
              <ImageIcon className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalIllustrations}</div>
            <p className="text-sm text-muted-foreground mt-1">AI生成图片总数</p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-primary/10 hover:border-primary/20 transition-all-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">发布文章</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Send className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalPublished}</div>
            <p className="text-sm text-muted-foreground mt-1">已发布到公众号</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <Card className="hover-lift">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              快速操作
            </CardTitle>
            <CardDescription className="text-base">选择功能模块快速开始工作</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl border hover:bg-accent/5 hover:border-accent/20 cursor-pointer transition-all-smooth hover-lift group"
                onClick={() => setCurrentModule(action.module as any)}
                style={{ animationDelay: `${300 + index * 50}ms` }}
              >
                <div className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">{action.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              最近活动
            </CardTitle>
            <CardDescription className="text-base">系统最新操作记录</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-all-smooth animate-slide-up"
                style={{ animationDelay: `${300 + index * 50}ms` }}
              >
                <div className="p-2 rounded-full bg-accent/10">
                  <activity.icon className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="hover-lift animate-slide-up" style={{ animationDelay: "400ms" }}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-accent/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
            工作进度概览
          </CardTitle>
          <CardDescription className="text-base">当前内容处理状态统计</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-foreground">待处理文章</span>
              <span className="text-muted-foreground">
                {stats.pendingArticles}/{stats.totalArticles}
              </span>
            </div>
            <Progress value={(stats.pendingArticles / stats.totalArticles) * 100} className="h-3 bg-muted" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-foreground">已改写文章</span>
              <span className="text-muted-foreground">
                {stats.rewrittenArticles}/{stats.totalArticles}
              </span>
            </div>
            <Progress value={(stats.rewrittenArticles / stats.totalArticles) * 100} className="h-3 bg-muted" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-foreground">已发布文章</span>
              <span className="text-muted-foreground">
                {stats.publishedArticles}/{stats.totalArticles}
              </span>
            </div>
            <Progress value={(stats.publishedArticles / stats.totalArticles) * 100} className="h-3 bg-muted" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
