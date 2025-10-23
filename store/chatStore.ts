import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message } from '@/types/chat'

interface ChatState {
  messages: Message[]
  conversationId: string | undefined
  mode: 'conversational' | 'one-shot'
  limit: number
  addMessage: (message: Message) => void
  updateMessage: (id: string, updates: Partial<Message>) => void
  setConversationId: (id: string | undefined) => void
  setMode: (mode: 'conversational' | 'one-shot') => void
  setLimit: (limit: number) => void
  clearHistory: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      conversationId: undefined,
      mode: 'conversational',
      limit: 100,
      addMessage: (message: Message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      updateMessage: (id: string, updates: Partial<Message>) =>
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === id ? { ...message, ...updates } : message,
          ),
        })),
      setConversationId: (id: string | undefined) =>
        set({ conversationId: id }),
      setMode: (mode: 'conversational' | 'one-shot') => set({ mode }),
      setLimit: (limit: number) => set({ limit }),
      clearHistory: () => set({ messages: [], conversationId: undefined }),
    }),
    {
      name: 'chat-storage',
    },
  ),
)
