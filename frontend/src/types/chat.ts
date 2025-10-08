export interface Contact {
  id: string
  name: string
  profile?: string
  online: boolean
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
}

export interface Message {
  id: string
  text: string
  sender: "user" | "friend"
  timestamp: string
  status?: "sent" | "delivered" | "read" | "received"
}


export interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}