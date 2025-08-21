"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useApp } from "@/contexts/app-context"
import { Settings, Bot, Rss, Users, Plus, CheckCircle, XCircle, RefreshCw, Trash2 } from "lucide-react"

const aiModels = [
  { value: "gpt-4", label: "GPT-4", provider: "OpenAI" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo", provider: "OpenAI" },
  { value: "claude-3-opus", label: "Claude 3 Opus", provider: "Anthropic" },
  { value: "claude-3-sonnet", label: "Claude 3 Sonnet", provider: "Anthropic" },
  { value: "gemini-pro", label: "Gemini Pro", provider: "Google" },
]

const collectionPlatforms = [
  { id: "wechat", name: "微信公众号", enabled: true },
  { id: "zhihu", name: "知乎", enabled: true },
  { id: "weibo", name: "微博", enabled: false },
  { id: "baidu", name: "百度热搜", enabled: true },
]

export function SettingsModule() {
  const { config, updateConfig, accounts } = useApp()
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [newAccount, setNewAccount] = useState({ name: "", appId: "", appSecret: "" })
  const [platformSettings, setPlatformSettings] = useState(collectionPlatforms)

  const handleConfigUpdate = (updates: Partial<typeof config>) => {
    updateConfig(updates)
  }

  const handlePlatformToggle = (platformId: string, enabled: boolean) => {
    setPlatformSettings((prev) =>
      prev.map((platform) => (platform.id === platformId ? { ...platform, enabled } : platform)),
    )
  }

  const handleAddAccount = () => {
    // In a real app, this would make an API call to add the account
    console.log("Adding account:", newAccount)
    setNewAccount({ name: "", appId: "", appSecret: "" })
    setShowAddAccount(false)
  }

  const handleTestConnection = (accountId: string) => {
    // In a real app, this would test the connection to the WeChat API
    console.log("Testing connection for account:", accountId)
  }

  const handleRemoveAccount = (accountId: string) => {
    // In a real app, this would remove the account
    console.log("Removing account:", accountId)
  }

  return (
    <div className="space-y-6">
      {/* AI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI接口配置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>API密钥</Label>
              <Input
                type="password"
                placeholder="输入您的AI API密钥"
                value={config.aiApiKey}
                onChange={(e) => handleConfigUpdate({ aiApiKey: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">用于AI改写和配图生成功能</p>
            </div>

            <div className="space-y-2">
              <Label>AI模型</Label>
              <Select value={config.aiModel} onValueChange={(value) => handleConfigUpdate({ aiModel: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aiModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="flex items-center gap-2">
                        <span>{model.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {model.provider}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>自动改写</Label>
                <p className="text-sm text-muted-foreground">采集后自动进行AI改写</p>
              </div>
              <Switch
                checked={config.autoRewrite}
                onCheckedChange={(checked) => handleConfigUpdate({ autoRewrite: checked })}
              />
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">API状态</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {config.aiApiKey ? "API密钥已配置，连接正常" : "请配置API密钥以启用AI功能"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Collection Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rss className="h-5 w-5" />
            采集源配置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>采集间隔 (分钟)</Label>
              <Input
                type="number"
                min="1"
                max="1440"
                value={config.collectInterval}
                onChange={(e) => handleConfigUpdate({ collectInterval: Number.parseInt(e.target.value) || 60 })}
              />
              <p className="text-xs text-muted-foreground">自动采集的时间间隔</p>
            </div>

            <div className="space-y-2">
              <Label>主题切换</Label>
              <Select
                value={config.theme}
                onValueChange={(value: "light" | "dark") => handleConfigUpdate({ theme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">浅色主题</SelectItem>
                  <SelectItem value="dark">深色主题</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>启用的采集平台</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platformSettings.map((platform) => (
                <div
                  key={platform.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${platform.enabled ? "bg-green-500" : "bg-gray-300"}`}></div>
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <Switch
                    checked={platform.enabled}
                    onCheckedChange={(checked) => handlePlatformToggle(platform.id, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">采集规则说明</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• 每次采集最多获取50篇文章</li>
              <li>• 自动过滤重复内容和低质量文章</li>
              <li>• 支持关键词和分类筛选</li>
              <li>• 采集内容会自动分类和打标签</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            公众号账号管理
          </CardTitle>
          <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                添加账号
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加微信公众号</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>公众号名称</Label>
                  <Input
                    placeholder="输入公众号名称"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>AppID</Label>
                  <Input
                    placeholder="输入微信公众号AppID"
                    value={newAccount.appId}
                    onChange={(e) => setNewAccount({ ...newAccount, appId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>AppSecret</Label>
                  <Input
                    type="password"
                    placeholder="输入微信公众号AppSecret"
                    value={newAccount.appSecret}
                    onChange={(e) => setNewAccount({ ...newAccount, appSecret: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddAccount(false)}>
                    取消
                  </Button>
                  <Button
                    onClick={handleAddAccount}
                    disabled={!newAccount.name || !newAccount.appId || !newAccount.appSecret}
                  >
                    添加
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {accounts.length > 0 ? (
            <div className="space-y-4">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {account.isConnected ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <h4 className="font-medium">{account.name}</h4>
                        <p className="text-sm text-muted-foreground">AppID: {account.appId}</p>
                        {account.lastSyncAt && (
                          <p className="text-xs text-muted-foreground">
                            最后同步: {new Date(account.lastSyncAt).toLocaleString("zh-CN")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={account.isConnected ? "default" : "destructive"}>
                      {account.isConnected ? "已连接" : "未连接"}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleTestConnection(account.id)}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveAccount(account.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">还没有添加公众号账号</p>
              <p className="text-sm">点击"添加账号"开始配置您的微信公众号</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            系统信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">系统版本</Label>
              <p className="text-sm text-muted-foreground">v1.0.0</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">最后更新</Label>
              <p className="text-sm text-muted-foreground">2024-01-16</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">运行状态</Label>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">正常运行</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h4 className="font-medium">功能状态</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">内容采集</span>
                <Badge variant="default">正常</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">AI改写</span>
                <Badge variant={config.aiApiKey ? "default" : "secondary"}>{config.aiApiKey ? "正常" : "未配置"}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">智能配图</span>
                <Badge variant={config.aiApiKey ? "default" : "secondary"}>{config.aiApiKey ? "正常" : "未配置"}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">发布管理</span>
                <Badge variant={accounts.some((a) => a.isConnected) ? "default" : "secondary"}>
                  {accounts.some((a) => a.isConnected) ? "正常" : "未配置"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
