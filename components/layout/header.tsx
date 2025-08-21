"use client"

import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, User } from "lucide-react"

const moduleNames = {
  dashboard: "工作台",
  collection: "内容采集",
  materials: "素材管理",
  rewrite: "AI改写",
  illustration: "自动配图",
  publish: "发布管理",
  settings: "系统配置",
}

export function Header() {
  const { currentModule, articles } = useApp()
  const pendingCount = articles.filter((a) => a.status === "pending").length

  return (
    <header className="h-16 bg-gradient-to-r from-card to-muted/30 border-b border-border px-8 flex items-center justify-between shadow-sm animate-fade-in">
      <div className="animate-slide-up">
        <h2 className="text-xl font-bold text-foreground">{moduleNames[currentModule as keyof typeof moduleNames]}</h2>
        <p className="text-sm text-muted-foreground">管理您的公众号内容创作流程</p>
      </div>

      <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <Button
          variant="ghost"
          size="sm"
          className="relative hover:bg-accent/10 hover:text-accent transition-all-smooth"
        >
          <Bell className="h-4 w-4" />
          {pendingCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-scale-in bg-accent text-accent-foreground"
            >
              {pendingCount}
            </Badge>
          )}
        </Button>

        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-all-smooth">
          <User className="h-4 w-4 mr-2" />
          <span className="font-medium">管理员</span>
        </Button>
      </div>
    </header>
  )
}
