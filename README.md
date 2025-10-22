# Text2SQL Chat Demo

A modern, interactive chat interface for converting natural language to SQL queries using the Text2SQL API. This React application provides a beautiful dark-mode UI with real-time conversation capabilities, SQL query generation, execution, and comprehensive error handling.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Text2SQL API key from [text2sql.ai](https://text2sql.ai)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/text2sql-ai/chat-demo.git
   cd chat-demo
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory:

   ```bash
   VITE_TEXT2SQL_API_KEY=your_api_key_here
   VITE_TEXT2SQL_CONNECTION_ID=your_connection_id_here  # Optional
   VITE_TEXT2SQL_API_BASE_URL=https://api.text2sql.ai  # Optional, defaults to this
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3003`

## 📖 Usage

### Basic Usage

1. **Open the application** in your browser
2. **Type natural language queries** such as:
   - "Show me all users"
   - "Find customers who made purchases over $1000"
   - "Get the top 10 products by sales"
   - "How many orders were placed last month?"
3. **View generated SQL** with explanations
4. **Execute queries** to see results (requires connection ID)
5. **Continue conversations** to refine queries

### Interface Features

- **Mode Toggle**: Switch between "One-Shot" and "Conversational" modes
- **Result Limits**: Configure maximum rows returned (1, 5, 10, 25, 50, 100, 250)
- **Query Execution**: Run generated SQL queries and view results
- **Copy to Clipboard**: Copy SQL queries for external use
- **Clear History**: Reset conversation and start fresh
- **Auto-scroll**: Automatically scrolls to new messages and results

## 🔌 API Integration

This application integrates with the Text2SQL API's Generate SQL endpoint. The app supports all API parameters including conversation memory, query execution, and both one-shot and conversational modes.

**📚 Complete API Documentation:** [text2sql.ai/docs/api-integration](https://www.text2sql.ai/docs/api-integration#generate-sql)

### Key Parameters

- `prompt` (required) - Natural language description of the query
- `connectionID` (optional) - Database connection ID for query execution
- `runQuery` (optional) - Execute queries and return results
- `limit` (optional) - Maximum rows to return (defaults to 100)
- `conversationID` (optional) - Continue existing conversations
- `mode` (optional) - "one-shot" or "conversational" mode

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Routing**: TanStack Router for file-based routing
- **State Management**: Zustand for client state
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Build Tool**: Vite with TypeScript support
- **Development**: ESLint + Prettier for code quality

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server on port 3003

# Building
npm run build        # Build for production
npm run serve        # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm run check        # Format and lint in one command
```

## 🔗 Links

- **Live Demo**: [text2sql.ai/chat-demo](https://text2sql.ai/chat-demo)
- **API Documentation**: [text2sql.ai/docs/api-integration](https://www.text2sql.ai/docs/api-integration#generate-sql)
- **GitHub Repository**: [github.com/text2sql-ai/chat-demo](https://github.com/text2sql-ai/chat-demo)
- **Text2SQL Platform**: [text2sql.ai](https://text2sql.ai)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by the Text2SQL team
