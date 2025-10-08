"use client"

import { useEffect, useRef } from "react"
import { Phone, Video, MoreVertical } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Message, Contact } from "@/types/chat"
import { cn } from "@/lib/utils"

interface ChatAreaProps {
  contact: Contact | null
  messages: Message[]
  isTyping: boolean
  isSidebarCollapsed: boolean
}

export function ChatArea({ contact, messages, isTyping}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  if (!contact) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select a conversation</h3>
          <p className="text-sm text-muted-foreground">Choose a contact from the sidebar to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Chat Header */}
      <div className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={ contact.profile} alt={contact.name} />
            <AvatarFallback className="bg-primary/10 text-primary">{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{contact.name}</h3>
            <p className="text-xs text-muted-foreground">{contact.online ? "Online" : "Offline"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button title='Call' variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Phone className="h-4 w-4" />
          </Button>
          <Button title='Video Call' variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
              message.sender === "user" && "flex-row-reverse",
            )}
          >
            

            <div className={cn("flex flex-col gap-1 max-w-[70%]", message.sender === "user" && "items-end")}>
              <div
                className={cn(
                  "rounded-2xl px-4 py-2.5 shadow-sm",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border text-card-foreground rounded-bl-sm",
                )}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                {message.sender === "user" && (
                  <span className="text-xs text-muted-foreground">
                    {message.status === "sent" && "✓"}
                    {(message.status === "received" || message.status === "delivered") && "✓✓"}
                    {message.status === "read" && <span className="text-primary">✓✓</span>}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarImage src={contact.profile} alt={contact.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">{contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
                <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
                <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
