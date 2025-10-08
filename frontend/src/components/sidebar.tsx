"use client"

import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Contact } from "@/types/chat"

interface SidebarProps {
  contacts: Contact[]
  selectedContactId: string | null
  onSelectContact: (contactId: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  isMobileOpen: boolean
  onCloseMobile: () => void
  isTyping: boolean
}

export function Sidebar({
  contacts,
  selectedContactId,
  onSelectContact,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  isTyping
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 border-r border-border bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-80",
        "md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Collapse Toggle */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        {!isCollapsed && <h2 className="text-sm font-semibold text-foreground">Chats</h2>}

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hidden md:flex h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contact List */}
      <div className="overflow-y-auto h-[calc(100vh-7rem)]">
        {contacts.map((contact) => (
            <button
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={cn(
              "w-full flex items-center gap-3 p-4 transition-colors hover:bg-accent",
              selectedContactId === contact.id && "bg-accent/70",
              isCollapsed && "justify-center px-2",
            )}
            >
            <div className="relative">
              <Avatar className="h-11 w-11">
              <AvatarImage src={contact.profile} alt={contact.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {contact.name.charAt(0)}
              </AvatarFallback>
              </Avatar>
              {contact.online && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-primary border-2 border-card" />
              )}
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-foreground truncate">{contact.name}</span>
                {contact.lastMessageTime && (
                <span className="text-xs text-muted-foreground ml-2">{contact.lastMessageTime}</span>
                )}
              </div>
              {isTyping && selectedContactId === contact.id ? (
                <p className="text-xs text-primary truncate">Typing...</p>
              ) : (
                contact.lastMessage && <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
              )}
              </div>
            )}

            {!isCollapsed && contact.unreadCount > 0 && selectedContactId !== contact.id && (
              <div className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5">
              <span className="text-xs font-medium text-primary-foreground">{contact.unreadCount}</span>
              </div>
            )}
            </button>
        ))}
      </div>
    </aside>
  )
}
