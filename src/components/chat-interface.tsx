import ChatInput from '@/components/chat-input'
import MessageList from '@/components/message-list'
import { Card } from '@/components/ui/card'
import { useText2SQL } from '@/hooks/useText2SQL'
import { useChatStore } from '@/store/chatStore'
import type { Message } from '@/types/chat'

export default function ChatInterface() {
  const {
    messages,
    conversationId,
    mode,
    limit,
    addMessage,
    setConversationId,
  } = useChatStore()
  const { generateSQL, isLoading } = useText2SQL()

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    }

    addMessage(userMessage)

    try {
      const connectionID = import.meta.env.VITE_TEXT2SQL_CONNECTION_ID

      const response = await generateSQL({
        prompt: content,
        conversationID: conversationId,
        runQuery: false,
        limit: limit,
        mode: mode,
        ...(connectionID && { connectionID }),
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.explanation || 'Generated SQL query',
        role: 'assistant',
        timestamp: new Date(),
        sql: response.output ?? undefined,
        explanation: response.explanation,
        results: response.results,
        runError: response.runError,
      }

      addMessage(assistantMessage)

      if (response.conversationID) {
        setConversationId(response.conversationID)
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          'Sorry, I encountered an error processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      }
      addMessage(errorMessage)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100svh-65px)] bg-transparent overflow-hidden">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-2 sm:p-4 h-full">
        <Card className="flex-1 flex flex-col pb-2 bg-black/20 backdrop-blur-sm border-white/10 overflow-hidden rounded-b-none">
          <MessageList messages={messages} />
        </Card>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}
