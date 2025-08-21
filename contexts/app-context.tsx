"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"
import type { Article, RewriteRecord, PublicationRecord, WeChatAccount, AppConfig, GeneratedImage } from "@/types"
import { mockArticles, mockAccounts } from "@/data/mock-data"

interface AppContextType {
  // Data
  articles: Article[]
  rewrites: RewriteRecord[]
  publications: PublicationRecord[]
  accounts: WeChatAccount[]
  config: AppConfig
  generatedImages: GeneratedImage[]

  // Actions
  addArticles: (articles: Article[]) => void
  updateArticle: (id: string, updates: Partial<Article>) => void
  deleteArticle: (id: string) => void
  addRewrite: (rewrite: RewriteRecord) => void
  addPublication: (publication: PublicationRecord) => void
  updateConfig: (updates: Partial<AppConfig>) => void
  addGeneratedImage: (image: GeneratedImage) => void
  updateGeneratedImage: (id: string, updates: Partial<GeneratedImage>) => void
  deleteGeneratedImage: (id: string) => void

  // UI State
  currentModule: string
  setCurrentModule: (module: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [rewrites, setRewrites] = useState<RewriteRecord[]>([])
  const [publications, setPublications] = useState<PublicationRecord[]>([])
  const [accounts, setAccounts] = useState<WeChatAccount[]>(mockAccounts)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [config, setConfig] = useState<AppConfig>({
    aiApiKey: "",
    aiModel: "gpt-4",
    collectInterval: 60,
    autoRewrite: false,
    theme: "light",
  })

  const [currentModule, setCurrentModule] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(false)

  const addArticles = (newArticles: Article[]) => {
    setArticles((prev) => [...prev, ...newArticles])
  }

  const updateArticle = (id: string, updates: Partial<Article>) => {
    setArticles((prev) => prev.map((article) => (article.id === id ? { ...article, ...updates } : article)))
  }

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((article) => article.id !== id))
  }

  const addRewrite = (rewrite: RewriteRecord) => {
    setRewrites((prev) => [...prev, rewrite])
  }

  const addPublication = (publication: PublicationRecord) => {
    setPublications((prev) => [...prev, publication])
  }

  const updateConfig = (updates: Partial<AppConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }

  const addGeneratedImage = (image: GeneratedImage) => {
    setGeneratedImages((prev) => [...prev, image])
  }

  const updateGeneratedImage = (id: string, updates: Partial<GeneratedImage>) => {
    setGeneratedImages((prev) => prev.map((image) => (image.id === id ? { ...image, ...updates } : image)))
  }

  const deleteGeneratedImage = (id: string) => {
    setGeneratedImages((prev) => prev.filter((image) => image.id !== id))
  }

  const value: AppContextType = {
    articles,
    rewrites,
    publications,
    accounts,
    config,
    generatedImages,
    addArticles,
    updateArticle,
    deleteArticle,
    addRewrite,
    addPublication,
    updateConfig,
    addGeneratedImage,
    updateGeneratedImage,
    deleteGeneratedImage,
    currentModule,
    setCurrentModule,
    isLoading,
    setIsLoading,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
