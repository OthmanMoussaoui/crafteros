"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Smile } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ChatReactionsProps {
  matchId: string
}

export default function ChatReactions({ matchId }: ChatReactionsProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Ahmed",
      avatar: "A",
      text: "What a goal by Salah!",
      time: "12'",
    },
    {
      id: 2,
      user: "Mohamed",
      avatar: "M",
      text: "That was offside surely?",
      time: "27'",
    },
    {
      id: 3,
      user: "Sara",
      avatar: "S",
      text: "Great save by the keeper!",
      time: "38'",
    },
    {
      id: 4,
      user: "Karim",
      avatar: "K",
      text: "Zamalek needs to improve their passing",
      time: "42'",
    },
    {
      id: 5,
      user: "Layla",
      avatar: "L",
      text: "This referee is making bad calls",
      time: "45'",
    },
  ])

  // Emoji reactions
  const emojis = ["👍", "👏", "❤️", "😮", "😂", "⚽", "🔥", "👎"]

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: "You",
          avatar: "Y",
          text: message,
          time: "45'",
        },
      ])
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Live Chat</span>
          <Badge variant="outline">{messages.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] px-4">
          <div className="space-y-4 py-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{msg.avatar}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{msg.user}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <div className="flex w-full items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start" alignOffset={-40}>
              <div className="flex gap-2 flex-wrap max-w-[200px]">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    className="hover:bg-secondary rounded p-1 cursor-pointer text-lg"
                    onClick={() => setMessage((prev) => prev + emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="icon" className="h-9 w-9" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
