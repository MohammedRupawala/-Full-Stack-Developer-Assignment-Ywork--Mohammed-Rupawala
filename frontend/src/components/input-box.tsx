"use client"

import { useState, type KeyboardEvent } from "react"
import { Send, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageInputProps } from "@/types/chat"

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border bg-card p-4">
      <div className="flex items-end gap-2">
        <Button title='Attach' variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground shrink-0">
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            className="min-h-[44px] max-h-32 resize-none bg-secondary/50 border-border/50 focus-visible:ring-primary pr-10"
            rows={1}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 bottom-1 h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="icon"
          className="h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
