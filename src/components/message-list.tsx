import Message from '@/components/message'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Message as MessageType } from '@/types/chat'

interface MessageListProps {
  messages: MessageType[]
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 h-full">
      <div className="px-4 py-0 space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p className="text-lg mb-2">Welcome to Text2SQL Chat Demo</p>
            <p className="text-sm max-w-3/4 mx-auto">
              You can ask questions about the database, ask to generate SQL
              queries and run them. You can configure the mode of the generation
              to be one shot or conversational.
            </p>
            <p className="text-xs mt-3 text-gray-500">
              Try: "Show me all users" or "Find customers who made purchases
              over $1000"
            </p>
          </div>
        )}
        {messages.length > 0 &&
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
      </div>
    </ScrollArea>
  )
}
