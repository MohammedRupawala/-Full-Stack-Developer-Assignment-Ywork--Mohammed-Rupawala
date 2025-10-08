"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-box"
import { MessageInput } from "@/components/input-box"
import type { Contact, Message } from "@/types/chat"
import { cn } from "@/lib/utils"

const contacts: Contact[] = [
  {
    id: "1",
    name: "Vedant Panchal",
    profile: "/profile-man.jpg",
    online: true,
    lastMessage: "That sounds great! Let me know when you're free.",
    lastMessageTime: "2m",
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Mohammed Rupawala",
    profile: "/profile-man.jpg",
    online: true,
    lastMessage: "Thanks for the update!",
    lastMessageTime: "15m",
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Om Kansara",
    profile: "/profile-man.jpg",
    online: false,
    lastMessage: "See you tomorrow at the meeting.",
    lastMessageTime: "1h",
    unreadCount: 0,
  },
  {
    id: "4",
    name: "Mrunal Shah",
    profile: "/profile-man.jpg",
    online: true,
    lastMessage: "I'll send you the files shortly.",
    lastMessageTime: "3h",
    unreadCount: 1,
  },
  {
    id: "5",
    name: "Dvij Oza",
    profile: "/profile-man.jpg",
    online: false,
    lastMessage: "Perfect! Talk soon.",
    lastMessageTime: "1d",
    unreadCount: 0,
  },
]

const friendResponses = [
  "That's interesting! Tell me more.",
  "I completely understand what you mean.",
  "Great point! I hadn't thought of it that way.",
  "Thanks for sharing that with me.",
  "I agree with you.",
  "That makes a lot of sense.",
  "I appreciate you letting me know.",
  "Sounds good to me!",
  "Let me think about that for a moment...",
  "That's a really good question.",
]

const initialMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1-1",
      text: "Hey Vedant! How are you doing today?",
      sender: "friend",
      timestamp: "10:30 AM",
    },
    {
      id: "1-2",
      text: "I'm doing great, thanks for asking! How about you?",
      sender: "user",
      timestamp: "10:31 AM",
      status: "read",
    },
    {
      id: "1-3",
      text: "I'm doing well too! Just working on some exciting projects.",
      sender: "friend",
      timestamp: "10:32 AM",
    },
  ],
  "2": [
    {
      id: "2-1",
      text: "Hi Mohammed! Did you get a chance to review the documents?",
      sender: "friend",
      timestamp: "9:15 AM",
    },
    {
      id: "2-2",
      text: "Yes, I did! Everything looks good to me.",
      sender: "user",
      timestamp: "9:20 AM",
      status: "read",
    },
  ],
  "3": [
    {
      id: "3-1",
      text: "Hello Om! Looking forward to our meeting tomorrow.",
      sender: "friend",
      timestamp: "Yesterday",
    },
  ],
  "4": [
    {
      id: "4-1",
      text: "Hey Mrunal! How's the project coming along?",
      sender: "friend",
      timestamp: "8:00 AM",
    },
  ],
  "5": [
    {
      id: "5-1",
      text: "Hi Dvij! Hope you're having a great day.",
      sender: "friend",
      timestamp: "Yesterday",
    },
  ],
}

export default function ChatApp() {
  const [selectedContactId, setSelectedContactId] = useState<string | null>("1")
  const [messagesByContact, setMessagesByContact] = useState<Record<string, Message[]>>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || null
  const messages = selectedContactId ? messagesByContact[selectedContactId] || [] : []

  const handleSendMessage = (text: string) => {
    if (!selectedContactId) return

    const newMessage: Message = {
      id: `${selectedContactId}-${Date.now()}`,
      text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      status: "sent",
    }

    setMessagesByContact((prev) => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage],
    }))

    setTimeout(() => {
      setMessagesByContact((prev) => ({
        ...prev,
        [selectedContactId]: prev[selectedContactId].map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg,
        ),
      }))
    }, 500)

    setTimeout(() => {
      setMessagesByContact((prev) => ({
        ...prev,
        [selectedContactId]: prev[selectedContactId].map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "read" } : msg,
        ),
      }))
    }, 1000)

    setTimeout(() => {
      setIsTyping(true)
    }, 1500)

    setTimeout(() => {
      setIsTyping(false)
      const botResponse: Message = {
        id: `${selectedContactId}-${Date.now() + 1}`,
        text: friendResponses[Math.floor(Math.random() * friendResponses.length)],
        sender: "friend",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      }
      setMessagesByContact((prev) => ({
        ...prev,
        [selectedContactId]: [...(prev[selectedContactId] || []), botResponse],
      }))
    }, 3500)
  }

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId)
    setIsMobileSidebarOpen(false)
    setIsTyping(false)
    if (!messagesByContact[contactId]) {
      setMessagesByContact((prev) => ({
        ...prev,
        [contactId]: [
          {
            id: `${contactId}-1`,
            text: "Hey! How can I help you today?",
            sender: "friend",
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            }),
          },
        ],
      }))
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-background">
      <Navbar
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex h-[calc(100vh-4rem)] pt-16">
        <Sidebar
          isTyping={isTyping}
          contacts={contacts}
          selectedContactId={selectedContactId}
          onSelectContact={handleSelectContact}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
        )}

        <main
          className={cn(
            "flex-1 flex flex-col transition-all duration-300",
            "md:ml-16",
            !isSidebarCollapsed && "md:ml-80",
          )}
        >
          <ChatArea
            contact={selectedContact}
            messages={messages}
            isTyping={isTyping}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          {selectedContact && <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />}
        </main>
      </div>
    </div>
  )
}
