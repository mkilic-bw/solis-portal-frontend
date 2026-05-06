export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  messages: ChatMessage[];
}
