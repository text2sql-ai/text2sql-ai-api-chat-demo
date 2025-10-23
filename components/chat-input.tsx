import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChatStore } from '@/store/chatStore'
import { Database, Loader2, MessageCircle, Send, Trash } from 'lucide-react'
import { useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

const TOOLTIP_CONTENT = {
  conversational:
    'Conversational mode: Allows clarifying questions when the request is ambiguous',
  'one-shot': 'One-shot mode: Immediate SQL generation',
}

export default function ChatInput({
  onSendMessage,
  isLoading,
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const { clearHistory, mode, setMode } = useChatStore()

  const handleClearHistory = () => {
    clearHistory()
  }

  const toggleMode = () => {
    setMode(mode === 'conversational' ? 'one-shot' : 'conversational')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="p-2 sm:p-4 pb-2 border border-t-0 rounded-xl rounded-t-none border-white/10 bg-black/10 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me to generate SQL queries..."
          className="text-xs sm:text-sm w-full min-h-[50px] sm:min-h-[60px] max-h-[50px] sm:max-h-[60px] resize-none bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 pr-12 sm:pr-14"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 text-white size-6 sm:size-8 p-0 bg-[#6D29D9] hover:bg-[#581C99]"
        >
          {isLoading ? (
            <Loader2 className="animate-spin size-3 sm:size-4" />
          ) : (
            <Send className="size-3 sm:size-4" />
          )}
        </Button>
      </form>
      <div className="flex items-center justify-end sm:justify-between gap-2 sm:gap-4 mt-1 sm:mt-2">
        <p className="text-xs text-gray-400 hidden sm:block">
          Press Enter to send, Shift+Enter for new line
        </p>
        <div className="flex items-center gap-0.5 mr-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 sm:h-6 text-xs rounded-sm text-gray-300 hover:text-white hover:bg-white/10"
                onClick={toggleMode}
              >
                {mode === 'conversational' && (
                  <>
                    <MessageCircle className="size-3 sm:size-3.5" />
                    <span className="hidden sm:inline">Conversational</span>
                    <span className="sm:hidden">Chat</span>
                  </>
                )}
                {mode === 'one-shot' && (
                  <>
                    <Database className="size-3 sm:size-3.5" />
                    <span className="hidden sm:inline">One-Shot</span>
                    <span className="sm:hidden">SQL</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{TOOLTIP_CONTENT[mode as keyof typeof TOOLTIP_CONTENT]}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-5 sm:size-6 rounded-sm text-gray-300 hover:text-white hover:bg-white/10"
                onClick={handleClearHistory}
              >
                <Trash className="size-2.5 sm:size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear history</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
