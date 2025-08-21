"use client"

import { AppProvider } from "@/contexts/app-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { CollectionModule } from "@/components/modules/collection-module"
import { MaterialsModule } from "@/components/modules/materials-module"
import { RewriteModule } from "@/components/modules/rewrite-module"
import { IllustrationModule } from "@/components/modules/illustration-module"
import { PublishModule } from "@/components/modules/publish-module"
import { SettingsModule } from "@/components/modules/settings-module"
import { DashboardModule } from "@/components/modules/dashboard-module" // Added dashboard module import
import { useApp } from "@/contexts/app-context"

function MainContent() {
  const { currentModule } = useApp()

  const renderModule = () => {
    switch (currentModule) {
      case "dashboard": // Added dashboard case
        return <DashboardModule />
      case "collection":
        return <CollectionModule />
      case "materials":
        return <MaterialsModule />
      case "rewrite":
        return <RewriteModule />
      case "illustration":
        return <IllustrationModule />
      case "publish":
        return <PublishModule />
      case "settings":
        return <SettingsModule />
      default:
        return <DashboardModule /> // Changed default to dashboard instead of collection
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">{renderModule()}</main>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ThemeProvider>
  )
}
