import { useState } from 'react'

export interface Text2SQLRequest {
  prompt: string
  connectionID?: string
  runQuery?: boolean
  limit?: number
  conversationID?: string
  mode?: 'one-shot' | 'conversational'
}

export interface Text2SQLResponse {
  output: string | null
  explanation: string
  results?: any[]
  runError?: string
  conversationID: string
}

const API_BASE_URL =
  import.meta.env.VITE_TEXT2SQL_API_BASE_URL || 'https://api.text2sql.ai'

export function useText2SQL() {
  const [isLoading, setIsLoading] = useState(false)

  const generateSQL = async (
    request: Text2SQLRequest,
  ): Promise<Text2SQLResponse> => {
    setIsLoading(true)

    try {
      const API_KEY = import.meta.env.VITE_TEXT2SQL_API_KEY || ''

      const response = await fetch(
        `${API_BASE_URL}/api/external/generate-sql`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        },
      )

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
        )
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Text2SQL API error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateSQL,
    isLoading,
  }
}
