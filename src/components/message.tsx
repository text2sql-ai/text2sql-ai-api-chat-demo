import { Card } from '@/components/ui/card'
import { useText2SQL } from '@/hooks/useText2SQL'
import { useChatStore } from '@/store/chatStore'
import type { Message as MessageType } from '@/types/chat'
import { AlertCircle, CheckCircle, Copy, Database, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'

interface MessageProps {
  message: MessageType
  parentWidth: number
}

export default function Message({ message, parentWidth }: MessageProps) {
  const [copied, setCopied] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)
  const { generateSQL } = useText2SQL()
  const {
    conversationId,
    mode,
    limit,
    updateMessage,
    setConversationId,
    setLimit,
  } = useChatStore()

  const limitOptions = [1, 5, 10, 25, 50, 100, 250]
  const currentLimitIndex = limitOptions.indexOf(limit)

  const cycleLimit = () => {
    const nextIndex = (currentLimitIndex + 1) % limitOptions.length
    setLimit(limitOptions[nextIndex])
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const runQuery = async () => {
    if (!message.sql) return

    setIsRunning(true)
    try {
      const connectionID = import.meta.env.VITE_TEXT2SQL_CONNECTION_ID

      const response = await generateSQL({
        prompt: message.sql,
        conversationID: conversationId,
        runQuery: true,
        limit: limit,
        mode: mode,
        ...(connectionID && { connectionID }),
      })

      updateMessage(message.id, {
        results: response.results,
        runError: response.runError,
      })

      if (response.conversationID) {
        setConversationId(response.conversationID)
      }
    } catch (error) {
      console.error('Failed to run query:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const isUser = message.role === 'user'

  // Auto-scroll to new messages
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
  }, [])

  // Auto-scroll when results are updated
  useEffect(() => {
    if (message.results && messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
  }, [message.results])

  return (
    <div
      ref={messageRef}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <Card
        style={{ maxWidth: parentWidth ? `${parentWidth * 0.8}px` : '40svw' }}
        className={`py-3 px-4 rounded-lg border-none ${
          isUser ? 'bg-purple-600/20' : 'bg-white/5 border-white/10'
        }`}
      >
        <div className="flex items-start gap-3">
          {!isUser && (
            <img className="size-8" src={'/logo_icon.svg'} alt="logo icon" />
          )}

          <div className="flex-1 min-w-0">
            <div className="text-white">{message.content}</div>

            {message.sql && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Database size={14} />
                      Generated SQL
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-mr-2 px-2 py-1 h-auto rounded-sm text-xs text-gray-400 hover:text-white hover:bg-white/10"
                      onClick={cycleLimit}
                    >
                      {limit} result{limit !== 1 ? 's' : ''}
                    </Button>
                    <button
                      onClick={runQuery}
                      disabled={isRunning}
                      className="cursor-pointer text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <Play size={14} />
                      {isRunning ? 'Running...' : 'Run'}
                    </button>
                    <button
                      onClick={() => copyToClipboard(message.sql!)}
                      className="cursor-pointer text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <pre className="bg-black/30 p-3 rounded-lg text-sm text-green-400 overflow-x-auto border border-gray-700 no-scrollbar max-w-full">
                  <code>{message.sql}</code>
                </pre>
              </div>
            )}

            {message.results && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={14} className="text-gray-300" />
                  <span className="text-sm font-medium text-gray-300">
                    {message.results.length === 0
                      ? 'Query executed'
                      : `Query results (${message.results.length} rows)`}
                  </span>
                </div>
                {message.results.length > 0 ? (
                  <div className="bg-black/30 p-3 rounded-lg border border-gray-700 max-h-40 overflow-auto no-scrollbar">
                    <pre className="text-xs text-gray-300 max-w-full">
                      {JSON.stringify(message.results, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-black/30 p-3 rounded-lg border border-gray-700">
                    <p className="text-xs text-gray-400 italic">
                      The query executed successfully but returned no data.
                    </p>
                  </div>
                )}
              </div>
            )}

            {message.runError && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={14} className="text-red-400" />
                  <span className="text-sm font-medium text-red-400">
                    Query Error
                  </span>
                </div>
                <div className="bg-red-900/20 p-3 rounded-lg border border-red-500/30">
                  <pre className="text-sm text-red-300 max-w-full">
                    {message.runError}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
