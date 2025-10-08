"use client"

import { Search, User, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  isMobileSidebarOpen: boolean
  onToggleMobileSidebar: () => void
}

export function Navbar({ isMobileSidebarOpen, onToggleMobileSidebar }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-full flex-row justify-between items-center gap-4 px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMobileSidebar}
          className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">Y</span>
          </div>
          <span className="hidden text-lg font-semibold text-foreground sm:inline-block">Ywork</span>
        </div>


        {/* User Profile */}
        <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all">
          <AvatarImage src="/profile-man.jpg" alt="User" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
