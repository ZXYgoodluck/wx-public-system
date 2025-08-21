"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/app-context"
import { Search, FileText, PenTool, ImageIcon, Send, Settings, Moon, Sun, LayoutDashboard } from "lucide-react"

const modules = [
  { id: "dashboard", name: "工作台", icon: LayoutDashboard },
  { id: "collection", name: "内容采集", icon: Search },
  { id: "materials", name: "素材管理", icon: FileText },
  { id: "rewrite", name: "AI改写", icon: PenTool },
  { id: "illustration", name: "自动配图", icon: ImageIcon },
  { id: "publish", name: "发布管理", icon: Send },
  { id: "settings", name: "系统配置", icon: Settings },
]

export function Sidebar() {
  const { currentModule, setCurrentModule, config, updateConfig } = useApp()

  const toggleTheme = () => {
    const newTheme = config.theme === "light" ? "dark" : "light"
    updateConfig({ theme: newTheme })
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col shadow-lg animate-fade-in">
      <div className="p-6 border-b border-sidebar-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">公众号CMS</h1>
            <p className="text-xs text-muted-foreground">AI内容管理系统</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-3">
        {modules.map((module, index) => {
          const Icon = module.icon
          return (
            <Button
              key={module.id}
              variant={currentModule === module.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-4 h-12 text-sm font-medium transition-all-smooth hover-lift",
                currentModule === module.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted hover:text-foreground",
                "animate-slide-up",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setCurrentModule(module.id)}
            >
              <Icon className="h-5 w-5" />
              {module.name}
            </Button>
          )
        })}
      </nav>

      <div className="p-6 border-t border-sidebar-border bg-muted/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-full justify-start gap-3 h-10 transition-all-smooth hover:bg-accent/10 hover:text-accent"
        >
          {config.theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span className="text-sm">{config.theme === "light" ? "深色模式" : "浅色模式"}</span>
        </Button>
      </div>
    </div>
  )
}
