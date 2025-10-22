# Text2SQL Chat Demo

A modern chat interface for converting natural language to SQL queries using the Text2SQL API.

## Features

- 🎨 Beautiful dark mode UI with gradient background
- 💬 Real-time chat interface
- 🔄 Conversation memory with context
- 📊 SQL query execution and results display
- 🚨 Error handling and validation
- 📱 Responsive design

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up your API key:**
   Create a `.env` file in the root directory:

   ```bash
   VITE_TEXT2SQL_API_KEY=your_api_key_here
   ```

   Get your API key from [text2sql.ai](https://text2sql.ai)

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Usage

1. Open the application in your browser
2. Type natural language queries like:
   - "Show me all users"
   - "Find customers who made purchases over $1000"
   - "Get the top 10 products by sales"
3. The AI will generate SQL queries and optionally execute them
4. View results, explanations, and any errors

## API Configuration

The application uses the Text2SQL API with the following parameters:

- `prompt`: Your natural language query
- `runQuery`: Set to true to execute queries
- `mode`: Set to "conversational" for interactive refinement
- `conversationID`: Maintains context across messages

## Tech Stack

- React 19 with TypeScript
- TanStack Router for routing
- TanStack Query for state management
- Tailwind CSS for styling
- shadcn/ui components
- Lucide React for icons
