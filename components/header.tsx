import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { openUrl } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import GitHub from './icons/GitHub'

export default function Header() {
  const goToRepository = () => {
    openUrl('https://github.com/text2sql-ai/chat-demo')
  }

  const goToDocs = () => {
    openUrl('https://www.text2sql.ai/docs/api-integration#generate-sql')
  }

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 p-4 flex items-center justify-between bg-black/20 backdrop-blur-sm text-white shadow-lg border-b border-white/10">
        <div className="flex items-center">
          <a
            href="https://www.text2sql.ai"
            target="_blank"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              className="mr-2 size-6"
              src={'/logo_icon.svg'}
              alt="logo icon"
            />
            <span className="text-base sm:text-lg font-semibold">
              Text2SQL.ai
            </span>
          </a>
          <span className="ml-4 text-sm text-gray-300 hidden sm:block">
            Chat Demo
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 fill-gray-300 hover:text-white hover:fill-white hover:bg-white/10"
            onClick={goToDocs}
          >
            <span className="hidden sm:inline">API </span>Docs
            <ArrowUpRight className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 fill-gray-300 hover:text-white hover:fill-white hover:bg-white/10"
            onClick={goToRepository}
          >
            <GitHub className="size-4" />
            <span className="hidden sm:inline">GitHub</span>
            <ArrowUpRight className="size-3" />
          </Button>
        </div>
      </header>
    </TooltipProvider>
  )
}
